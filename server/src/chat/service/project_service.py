"""Service logic for project """

from typing import Dict

from werkzeug.exceptions import Conflict

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
