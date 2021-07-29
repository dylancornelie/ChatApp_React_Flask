"""Service logic for project """

from typing import Dict, List

from flask import current_app
from werkzeug.exceptions import Conflict, Forbidden, InternalServerError

from src.chat import db
from src.chat.model.pagination import Pagination
from src.chat.model.project import Project, user_coaches_to_project, user_participates_of_project
from src.chat.model.user import User
from src.chat.service import save_data, insert_data
from src.chat.service.user_service import get_a_user
from src.chat.util.pagination import paginate


def save_new_project(current_user_id: int, data: Dict) -> Project:
    project = Project.query.filter_by(title=data['title']).first()
    if not project:
        new_project = Project(
            title=data['title'],
            owner_id=current_user_id,
        )
        save_data(new_project)

        # Remove user duple in participants into coaches
        participants = [user for user in data['participants'] if user not in data['coaches']]

        insert_coaches(id_project=new_project.id, coaches=data['coaches'])
        insert_participants(id_project=new_project.id, participants=participants)

        return new_project

    raise Conflict('Project already exists. Please create new other project.')


def get_all_projects(current_user_id: int, filter_by) -> Pagination:
    query = Project.query.filter((Project.owner_id == current_user_id)
                                 | (Project.coaches.any(User.id == current_user_id))
                                 | (Project.participants.any(User.id == current_user_id))
                                 )

    if filter_by:
        query = query.filter(Project.title.like(f'%{filter_by}%'))

    return paginate(query)


def get_project_item(id_project: int) -> Project:
    return Project.query.filter_by(id=id_project).first_or_404('Project Not Found')


def update_project(current_user_id: int, id_project: int, data: Dict) -> Dict:
    project = get_project_item(id_project)
    _required_own_project(current_user_id, project)

    try:
        project.title = data['title']
        db.session.commit()
        return dict(message='Your project was successfully changed.')

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to save your data.")


def delete_project(current_user_id: int, id_project: int) -> Dict:
    project = get_project_item(id_project)
    _required_own_project(current_user_id, project)

    try:
        db.session.delete(project)
        db.session.commit()
        return dict(message='Your project was successfully removed.')

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to delete your data.")


def invite_participant_into_project(current_user_id: int, id_project: int, data: Dict) -> Dict:
    project = get_project_item(id_project)

    _required_member_in_project(current_user_id=current_user_id, project=project)

    # Find all participants exist in project
    participants_project = project.participants.filter(User.id.in_(data['participants'])).all()
    id_participants_project = [user.id for user in participants_project]

    # Remove participants duple
    data_insert_participants = [id for id in data['participants'] if id not in id_participants_project]
    insert_participants(id_project=project.id, participants=data_insert_participants)

    return dict(message='You added these participants.')


def leave_from_project(current_user_id: int, id_project: int) -> Dict:
    project = get_project_item(id_project)
    if project.owner_id == current_user_id:
        raise Forbidden("The owner can't leave the project.")
    current_user = get_a_user(current_user_id)
    try:
        if project.coaches.any(User.id == current_user_id):
            project.coaches.remove(current_user)
        if project.participants.any(User.id == current_user_id):
            project.participants.remove(current_user)

        db.session.commit()

        return dict(message='You left the project.')

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to remove your data.")


def designate_coach_into_project(current_user_id: int, id_project: int, data: Dict) -> Dict:
    project = get_project_item(id_project)
    _required_own_or_coach_in_project(current_user_id=current_user_id, project=project)

    try:
        # Find new coaches in participants
        participants = project.participants.filter(User.id.in_(data['coaches'])).all()

        for user in participants:
            # Remove them from list participants
            project.participants.remove(user)

            # Add them into list coaches
            project.coaches.append(user)

        db.session.commit()

        return dict(message='You designated some new coaches into project.')

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to remove your data.")


def withdraw_coach_in_project(current_user_id: int, id_project: int, data: Dict) -> Dict:
    project = get_project_item(id_project)
    _required_own_or_coach_in_project(current_user_id=current_user_id, project=project)

    try:
        # Find some coaches
        coaches = project.coaches.filter(User.id.in_(data['coaches'])).all()

        for user in coaches:
            # Remove them from list coaches
            project.coaches.remove(user)

            # Add them into list participant
            project.participants.append(user)

        db.session.commit()

        return dict(message='You withdrew some coaches. They will be a participant.')

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to remove your data.")


def remove_participant_in_project(current_user_id: int, id_project: int, data: Dict) -> Dict:
    project = get_project_item(id_project)
    _required_own_or_coach_in_project(current_user_id=current_user_id, project=project)

    try:
        # Find some participants
        participants = project.participants.filter(User.id.in_(data['participants'])).all()

        for user in participants:
            # Remove them from list participants
            project.participants.remove(user)

        db.session.commit()

        return dict(message='You removed some participants.')

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to remove your data.")


def _required_own_project(current_user_id: int, project: Project) -> None:
    if project.owner_id != current_user_id:
        raise Forbidden("You must be the project's owner.")


def _required_own_or_coach_in_project(current_user_id: int, project: Project) -> None:
    if not (project.owner_id == current_user_id or project.coaches.any(User.id == current_user_id)):
        raise Forbidden("Yous must be an project's owner or coach.")


def _required_member_in_project(current_user_id: int, project: Project) -> None:
    if not (project.owner_id == current_user_id
            or project.coaches.any(User.id == current_user_id)
            or project.participants.any(User.id == current_user_id)):
        raise Forbidden("You must be a project's member.")


def insert_participants(id_project: int, participants: List) -> None:
    data_participant = list(dict(user_id=i, project_id=id_project) for i in participants)
    insert_data(user_participates_of_project, data_participant)


def insert_coaches(id_project: int, coaches: List) -> None:
    data_participant = list(dict(user_id=i, project_id=id_project) for i in coaches)
    insert_data(user_coaches_to_project, data_participant)
