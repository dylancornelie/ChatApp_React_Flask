"""Service logic for message """

from http import HTTPStatus
from typing import Dict, Tuple

from src.chat.model.message import Message
from src.chat.model.pagination import Pagination
from src.chat.model.project import Project
from src.chat.service import save_data
from src.chat.service.project_service import get_project_item, required_member_in_project
from src.chat.util.pagination import paginate


def save_new_message(user_id: int, project_id: int, data: Dict) -> Tuple[Message, int]:
    """
    Save a new message with data

    :param user_id: int
    :param user_id: int
    :param data: Dict['content', 'receiver']
    :return: Message and status Http created
    """
    project = get_project_item(project_id)
    required_member_in_project(user_id, project)
    new_message = Message(
        content=data.get('content'),
        owner_id=user_id,
        project_id=project_id
    )

    if data.get('receiver'):
        required_member_in_project(data.get('receiver'), project, "You must send a project's member.")
        new_message.receiver_id = data.get('receiver')

    save_data(new_message)

    return new_message, HTTPStatus.CREATED


def get_all_messages(user_id: int, project_id: int) -> Pagination:
    """
    Get all message for one user in project

    :param user_id: int
    :param project_id: int
    :return: Pagination for message
    """

    query = Message.query \
        .filter(Project.id == project_id) \
        .filter((Message.receiver is None)
                | (Message.receiver_id == user_id)
                | (Message.owner_id == user_id)
                )

    return paginate(query)
