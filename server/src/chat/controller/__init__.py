from flask import Blueprint, request
from flask_restx import Api

from src.chat import sio
from src.chat.controller.auth_controller import api as auth_ns
from src.chat.controller.socket.message_socket import WsMessageNamespace
from src.chat.controller.v1.message_controller import api as message_ns_v1
from src.chat.controller.v1.project_controller import api as project_ns_v1
from src.chat.controller.v1.user_controller import api as user_ns_v1

api_bp = Blueprint('api', __name__)
_API_v1 = '/api/v1'

authorizations = {
    'Bearer': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization'
    }
}

api_v1 = Api(api_bp,
             title='FLASK RESTPLUS API CHAT',
             version='1.0',
             description='A chat systems for flask restx web service',
             authorizations=authorizations,
             )

api_v1.add_namespace(auth_ns)
api_v1.add_namespace(user_ns_v1, path=_API_v1 + '/users')
api_v1.add_namespace(project_ns_v1, path=_API_v1 + '/projects')
api_v1.add_namespace(message_ns_v1, path=_API_v1 + '/messages')

# Socket
sio.on_namespace(WsMessageNamespace('/ws/messages'))


@sio.on_error_default
def default_error_handler(e):
    if request.event["message"] == 'connect':
        raise e

    if hasattr(e, 'data'):
        error = e.data
        sio.emit('error', error, namespace='/ws/messages')
    elif hasattr(e, 'description'):
        error = dict(message=e.description)
        sio.emit('error', error, namespace='/ws/messages')
    else:
        raise e
