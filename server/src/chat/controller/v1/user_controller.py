from http import HTTPStatus

from flask import request
from flask_restx import Resource

from src.chat.service.user_service import save_new_user, get_all_users, get_a_user
from src.chat.util.dto import UserDto, params
from src.chat.util.decorator import token_required

api = UserDto.api
_user_list = UserDto.user_list
_user_item = UserDto.user_item
_user_post = UserDto.user_post


@api.route('/')
class List(Resource):
    # @token_required
    @api.doc('list_of_registered_users', params=params)
    @api.marshal_list_with(_user_list)
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


@api.route('/<int:id>')
@api.param('id', 'The User identifier')
@api.response(HTTPStatus.NOT_FOUND.numerator, 'User not found.')
class Item(Resource):
    @token_required
    @api.doc('get a user')
    @api.marshal_with(_user_item)
    def get(self, current_user_id, id):
        """get a user given its identifier"""
        user = get_a_user(id)
        if not user:
            api.abort(HTTPStatus.NOT_FOUND, 'user not found')
        else:
            return user


@api.route('/me')
class Me(Resource):
    @token_required
    @api.doc('get me')
    @api.marshal_with(_user_item)
    def get(self, current_user_id):
        return get_a_user(current_user_id)
