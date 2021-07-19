from flask import request
from flask_restx import Resource
from http import HTTPStatus

from src.chat.util.dto import UserDto
from src.chat.service.user_service import save_new_user, get_all_users, get_a_user

api = UserDto.api
_user_get = UserDto.user_get
_user_post = UserDto.user_post


@api.route('/')
class UserList(Resource):
    @api.doc('list_of_registered_users')
    @api.marshal_list_with(_user_get, envelope='data')
    def get(self):
        """List all registered users"""
        return get_all_users()

    @api.response(HTTPStatus.CREATED.numerator, 'User successfully created.')
    @api.response(HTTPStatus.CONFLICT.numerator, 'User already exists.')
    @api.doc('create a new user')
    @api.expect(_user_post, validate=True)
    def post(self):
        """Creates a new User """
        data = request.json
        return save_new_user(data=data)


@api.route('/<string:public_id>')
@api.param('public_id', 'The User identifier')
@api.response(HTTPStatus.NOT_FOUND.numerator, 'User not found.')
class User(Resource):
    @api.doc('get a user')
    @api.marshal_with(_user_get)
    def get(self, public_id):
        """get a user given its identifier"""
        user = get_a_user(public_id)
        if not user:
            api.abort(HTTPStatus.NOT_FOUND)
        else:
            return user
