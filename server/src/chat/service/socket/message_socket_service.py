from flask_socketio import ConnectionRefusedError
from werkzeug.exceptions import Forbidden, Unauthorized, BadRequest

from src.chat.util.decorator import token_required


def ws_connect():
    try:
        token_required(ws_connect)
    except (Forbidden, Unauthorized) as e:
        raise ConnectionRefusedError(e.description)


def input_room(data):
    if data.get('project_id'):
        return data.get('project_id')

    e = BadRequest()
    e.data = dict(
        errors=dict(project_id="'project_id' is required."),
        message='Input payload validation failed'
    )
    raise e
