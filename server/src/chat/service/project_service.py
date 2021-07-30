"""Service logic for project """

from http import HTTPStatus
from typing import Dict, List, Tuple

from flask import current_app
from werkzeug.exceptions import Conflict, Forbidden, InternalServerError, BadRequest

from src.chat import db
from src.chat.model.pagination import Pagination
from src.chat.model.project import Project, user_coaches_to_project, user_participates_of_project
from src.chat.model.user import User
from src.chat.service import save_data, insert_data
from src.chat.service.user_service import get_a_user
from src.chat.util.pagination import paginate


def save_new_project(current_user_id: int, data: Dict) -> Tuple[Project, int]:
    """
    Save a new project with data

    :param current_user_id: int
    :param data: Dict['title', 'participants', 'coaches']
    :return: Project and status Http created
    """

    project = Project.query.filter_by(title=data['title']).first()
    if project:
        raise Conflict('Project already exists. Please create new other project.')

    new_project = Project(
        title=data['title'],
        owner_id=current_user_id,
    )
    save_data(new_project)

    # Remove user duple of participants in coaches
    participants = [user for user in data.get('participants', []) if user not in data.get('coaches', [])]
    if participants:
        insert_participants(id_project=new_project.id, participants=participants)
    if data.get('coaches'):
        insert_coaches(id_project=new_project.id, coaches=data.get('coaches'))

    return new_project, HTTPStatus.CREATED


def get_all_projects(current_user_id: int, filter_by) -> Pagination:
    """
    Save a new project with data

    :param current_user_id: int
    :param filter_by: str | None
    :return: Pagination for project
    """

    query = Project.query.filter((Project.owner_id == current_user_id)
                                 | (Project.coaches.any(User.id == current_user_id))
                                 | (Project.participants.any(User.id == current_user_id))
                                 )

    if filter_by:
        query = query.filter(Project.title.like(f'%{filter_by}%'))

    return paginate(query)


def get_project_item(id_project: int) -> Project:
    """
    Find project with its id

    :param id_project: int
    :return: Project
    """

    return Project.query.filter_by(id=id_project).first_or_404('Project Not Found')


def update_project(current_user_id: int, id_project: int, data: Dict) -> Dict:
    """
    Update project with new data

    :param current_user_id: int
    :param id_project: int
    :param data: Dict['title']
    :return: Message
    """

    project = get_project_item(id_project)
    required_own_project(current_user_id, project)

    try:
        project.title = data['title']
        db.session.commit()
        return dict(message='Your project was successfully changed.')

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to save your data.")


def delete_project(current_user_id: int, id_project: int) -> Dict:
    """
    Delete project

    :param current_user_id: int
    :param id_project: int
    :return: Message
    """

    project = get_project_item(id_project)
    required_own_project(current_user_id, project)

    try:
        db.session.delete(project)
        db.session.commit()
        return dict(message='Your project was successfully removed.')

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to delete your data.")


def invite_participant_into_project(current_user_id: int, id_project: int, data: Dict) -> Dict:
    """
    Invite new member into project

    :param current_user_id: int
    :param id_project: int
    :param data: Dict['participant']
    :return: Message
    """

    project = get_project_item(id_project)
    user = get_a_user(data.get('participant'))

    required_member_in_project(current_user_id=current_user_id, project=project)

    # check new user exist project ou non
    if user.id == project.owner_id or user in project.participants or user in project.coaches:
        e = BadRequest()
        e.data = dict(
            errors=dict(participant="You can't add an existing project member."),
            message='Input payload validation failed.'
        )
        raise e

    insert_participants(id_project=project.id, participants=[data.get('participant')])

    return dict(message='You added these participants.')


def leave_from_project(current_user_id: int, id_project: int) -> Dict:
    """
    A member want to leave from project

    :param current_user_id: int
    :param id_project: int
    :return: Message
    """

    project = get_project_item(id_project)
    current_user = get_a_user(current_user_id)

    required_member_in_project(current_user_id=current_user_id, project=project)

    if project.owner == current_user:
        e = BadRequest()
        e.data = dict(
            errors=dict(owner="The owner can't leave the project."),
            message='Request failed.'
        )
        raise e

    try:
        if current_user in project.coaches:
            project.coaches.remove(current_user)
        elif current_user in project.participants:
            project.participants.remove(current_user)

        db.session.commit()

        return dict(message='You left the project.')

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to remove your data.")


def designate_coach_into_project(current_user_id: int, id_project: int, data: Dict) -> Dict:
    """
    Owner or coach designate a participant becoming to be new coach

    :param current_user_id: int
    :param id_project: int
    :param data: Dict['coach']
    :return: Message
    """

    project = get_project_item(id_project)
    required_own_or_coach_in_project(current_user_id=current_user_id, project=project)
    user = get_a_user(data.get('coach'))

    if user == project.owner or user in project.coaches:
        e = BadRequest()
        e.data = dict(
            errors=dict(coach="You can't add an owner or a coach become a new coach."),
            message='Input payload validation failed.'
        )
        raise e

    if user not in project.participants:
        e = BadRequest()
        e.data = dict(
            errors=dict(coach="You can't add a not member become a new coach."),
            message='Input payload validation failed.'
        )
        raise e

    try:
        # Remove them from list participants
        project.participants.remove(user)

        # Add them into list coaches
        project.coaches.append(user)

        db.session.commit()

        return dict(message='You designated a new coach.')

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to remove your data.")


def withdraw_coach_in_project(current_user_id: int, id_project: int, data: Dict) -> Dict:
    """
    Owner or coach withdraw a coach become be participant

    :param current_user_id: int
    :param id_project: int
    :param data: Dict['coach']
    :return: Message
    """

    project = get_project_item(id_project)
    required_own_or_coach_in_project(current_user_id=current_user_id, project=project)
    user = get_a_user(data.get('coach'))

    if user == project.owner or user not in project.coaches:
        e = BadRequest()
        e.data = dict(
            errors=dict(coach="You can't withdraw a not coach become a participant."),
            message='Input payload validation failed.'
        )
        raise e

    try:
        # Remove them from list coaches
        project.coaches.remove(user)

        # Add them into list participant
        project.participants.append(user)

        db.session.commit()

        return dict(message='You withdrew a coach. He will be a participant.')

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to remove your data.")


def remove_participant_in_project(current_user_id: int, id_project: int, data: Dict) -> Dict:
    """
    Owner or coach remove a participant from project

    :param current_user_id: int
    :param id_project: int
    :param data: Dict['coach']
    :return: Message
    """

    project = get_project_item(id_project)
    required_own_or_coach_in_project(current_user_id=current_user_id, project=project)
    user = get_a_user(data.get('participant'))

    if user == project.owner or user in project.coaches:
        e = BadRequest()
        e.data = dict(
            errors=dict(participant="You can't remove an owner or coach from project."),
            message='Input payload validation failed.'
        )
        raise e

    if user not in project.participants:
        e = BadRequest()
        e.data = dict(
            errors=dict(participant="You can't remove a not member from project."),
            message='Input payload validation failed.'
        )
        raise e

    try:
        # Remove them from list participants
        project.participants.remove(user)

        db.session.commit()

        return dict(message='You removed some participants.')

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to remove your data.")


def required_own_project(current_user_id: int, project: Project) -> None:
    """
    Check user is owner

    :param current_user_id: int
    :param project: Project
    """

    if project.owner_id != current_user_id:
        raise Forbidden("You must be the project's owner.")


def required_own_or_coach_in_project(current_user_id: int, project: Project) -> None:
    """
    Check user is owner or coach

    :param current_user_id: int
    :param project: Project
    """

    if not (project.owner_id == current_user_id
            or any(current_user_id == user.id for user in project.coaches)):
        raise Forbidden("Yous must be an project's owner or coach.")


def required_member_in_project(current_user_id: int, project: Project) -> None:
    """
    Check user is member

    :param current_user_id: int
    :param project: Project
    """

    if not (project.owner_id == current_user_id
            or any(current_user_id == user.id for user in project.coaches)
            or any(current_user_id == user.id for user in project.participants)):
        raise Forbidden("You must be a project's member.")


def insert_participants(id_project: int, participants: List[int]) -> None:
    """
    Add list participants into project

    :param id_project: int
    :param participants: List[int]
    """

    data_participant = list(dict(user_id=i, project_id=id_project) for i in participants)
    insert_data(user_participates_of_project, data_participant)


def insert_coaches(id_project: int, coaches: List[int]) -> None:
    """
    Add list coaches into project

    :param id_project: int
    :param coaches: List[int]
    """

    data_participant = list(dict(user_id=i, project_id=id_project) for i in coaches)
    insert_data(user_coaches_to_project, data_participant)
