from flask_restx import Api
from flask import Blueprint

from src.chat.controller.v1.user_controller import api as user_ns_v1

blueprint_v1 = Blueprint('api/v1', __name__)

api = Api(blueprint_v1,
          title='FLASK RESTPLUS API CHAT',
          version='1.0',
          description='a chat systems for flask restplus web service'
          )

api.add_namespace(user_ns_v1, path='/user')
