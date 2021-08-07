"""Service logic for message """

from typing import Dict

from flask import current_app
from werkzeug.exceptions import BadRequest

from src.chat.model.message import Message
from src.chat.model.pagination import Pagination
from src.chat.service import save_data
from src.chat.service.project_service import (get_project_item, is_owner, is_coach, is_participant,
                                              required_member_in_project)
from src.chat.util.pagination import paginate


def save_new_message(data: Dict) -> Message:
    """
    Save a new message with data

    :param data: Dict['project_id', 'owner_id', 'content', 'receiver_id']
    :return: Message
    """

    project_id = data.get('project_id')
    sender_id = data.get('sender_id')

    content = data.get('content')
    file_name = data.get('file_name')
    file_base64 = data.get('file_base64')

    receiver = data.get('receiver_id', None)

    project = get_project_item(project_id)
    required_member_in_project(sender_id, project)
    new_message = Message(
        sender_id=sender_id,
        project_id=project_id
    )

    if content:
        new_message.content = content
    if file_name and file_base64:
        new_message.file_name = file_name
        new_message.file_base64 = file_base64

    if receiver:
        # Receiver must be a member
        if not (is_owner(receiver, project) or is_coach(receiver, project) or is_participant(receiver, project)):
            e = BadRequest()
            e.data = dict(
                errors=dict(receiver="A receiver must be a project's member."),
                message='Input payload validation failed.'
            )
            raise e

        # Sender must be owner or coach
        if is_participant(sender_id, project):
            e = BadRequest()
            e.data = dict(
                errors=dict(sender="A sender must be a project's owner or coach."),
                message='Input payload validation failed.'
            )
            raise e

        new_message.receiver_id = receiver

    save_data(new_message)

    return new_message


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
                | (Message.sender_id == user_id)
                ) \
        .order_by(Message.id.desc())

    return paginate(query)


def valid_input_room(data):
    if data.get('project_id'):
        return _get_room_for_project(data.get('project_id'))

    e = BadRequest()
    e.data = dict(
        errors=dict(project_id="'project_id' is required."),
        message='Input payload validation failed'
    )
    raise e


def valid_input_message(data):
    errors = dict()
    if not data.get('project_id'):
        errors['project_id'] = "'project_id' is required."
    if not data.get('sender_id'):
        errors['sender_id'] = "'sender_id' is required."

    if not data.get('content') and not (data.get('file_name') and data.get('file_base64')):
        errors['content'] = "'content' is required."

    if not data.get('file_name') and data.get('file_base64'):
        errors['file_name'] = "'file_name' is required. "
    if data.get('file_name') and not data.get('file_base64'):
        errors['file_name'] = "'file_base64' is required."

    if data.get('file_name') and not _allowed_file(data.get('file_name')):
        errors['file_name'] = "'file_name' must be allowed extensions " \
                              + f"in {current_app.config['ALLOWED_EXTENSIONS']}"

    if errors:
        e = BadRequest()
        e.data = dict(
            errors=errors,
            message='Input payload validation failed.'
        )
        raise e

    data['room'] = _get_room_for_project(data.get('project_id'))

    return data


def _get_room_for_project(project_id: int) -> str:
    return f"Project_id_{project_id}"


def _allowed_file(filename) -> bool:
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config['ALLOWED_EXTENSIONS']
