"""Service logic for project """

from typing import Dict

from werkzeug.exceptions import Conflict

from src.chat.model.pagination import Pagination
from src.chat.model.project import Project
from src.chat.service import save_data
from src.chat.util.pagination import paginate


def save_new_project(current_user_id: int, data: Dict) -> Project:
    project = Project.query.filter_by(title=data['title']).first()
    if not project:
        new_project = Project(
            title=data['title'],
            owner_id=current_user_id,
        )
        save_data(new_project)
        return new_project

    raise Conflict('Project already exists. Please create new other project.')


def get_all_projects(current_user_id: int, filter_by) -> Pagination:
    query = Project.query.filter(Project.owner_id == current_user_id)

    if filter_by:
        query = query.filter(Project.title.like(f'%{filter_by}%'))

    return paginate(query)
