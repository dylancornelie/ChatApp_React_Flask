from flask import Blueprint
from flask_restx import Api

from src.chat.controller.auth_controller import api as auth_ns
from src.chat.controller.v1.user_controller import api as user_ns_v1

blueprint_v1 = Blueprint('api-v1', __name__)
_API_v1 = '/api/v1'

authorizations = {
    'apikey': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'Authorization'
    }
}

api = Api(blueprint_v1,
          title='FLASK RESTPLUS API CHAT',
          version='1.0',
          description='a chat systems for flask restplus web service',
          authorizations=authorizations,
          security='apikey',
          )

api.add_namespace(auth_ns)
api.add_namespace(user_ns_v1, path=_API_v1 + '/users')
