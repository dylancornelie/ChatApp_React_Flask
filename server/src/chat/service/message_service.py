"""Service logic for message """

from http import HTTPStatus
from typing import Dict, Tuple

from werkzeug.exceptions import BadRequest

from src.chat.model.message import Message
from src.chat.model.pagination import Pagination
from src.chat.service import save_data
from src.chat.service.project_service import (get_project_item, is_owner, is_coach, is_participant,
                                              required_member_in_project)
from src.chat.util.pagination import paginate


def save_new_message(user_id: int, project_id: int, data: Dict) -> Tuple[Dict, int]:
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
    receiver = data.get('receiver', None)
    if receiver:
        # Receiver must be a member
        if not(is_owner(receiver, project) or is_coach(receiver, project) or is_participant(receiver, project)):
            e = BadRequest()
            e.data = dict(
                errors=dict(receiver="A receiver must be a project's member."),
                message='Input payload validation failed.'
            )
            raise e

        # Sender must be owner or coach
        if is_participant(user_id, project):
            e = BadRequest()
            e.data = dict(
                errors=dict(sender="A sender must be a project's owner or coach."),
                message='Input payload validation failed.'
            )
            raise e

        new_message.receiver_id = receiver

    save_data(new_message)

    return dict(message='You created new message'), HTTPStatus.CREATED


def get_all_messages(user_id: int, project_id: int) -> Pagination:
    """
    Get all message for one user in project

    :param user_id: int
    :param project_id: int
    :return: Pagination for message
    """

    query = Message.query \
        .filter(Message.project_id == project_id) \
        .filter((Message.receiver == None)
                | (Message.receiver_id == user_id)
                | (Message.owner_id == user_id)
                ) \
        .order_by(Message.id.desc())

    return paginate(query)
