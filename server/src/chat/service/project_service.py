"""Service logic for project """

from typing import Dict

from flask import current_app
from werkzeug.exceptions import Conflict, Forbidden, InternalServerError

from src.chat import db
from src.chat.model.pagination import Pagination
from src.chat.model.project import Project, user_coaches_to_project, user_participates_of_project
from src.chat.model.user import User
from src.chat.service import save_data, insert_data
from src.chat.util.pagination import paginate


def save_new_project(current_user_id: int, data: Dict) -> Project:
    project = Project.query.filter_by(title=data['title']).first()
    if not project:
        new_project = Project(
            title=data['title'],
            owner_id=current_user_id,
        )
        save_data(new_project)

        data_coach = list(dict(user_id=i, project_id=new_project.id) for i in data['coach'])
        data_participant = list(dict(user_id=i, project_id=new_project.id) for i in data['participant'])

        insert_data(user_coaches_to_project, data_coach)
        insert_data(user_participates_of_project, data_participant)

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
        return Project.query.filter_by(id = id_project).first_or_404('Project Not Found')


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


def _required_own_project(current_user_id: int, project: Project) -> None:
    if project.owner_id != current_user_id:
        raise Forbidden("You must be the project's owner")
