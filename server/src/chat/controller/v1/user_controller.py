"""API endpoint definitions for /user namespace."""

from http import HTTPStatus

from flask import request
from flask_restx import Resource

from src.chat.dto.auth_dto import auth_resp
from src.chat.dto.user_dto import (api, user_item, user_list, user_post, user_params, user_put, user_password)
from src.chat.service.user_service import (save_new_user, get_all_users, get_a_user, update_a_user,
                                           update_a_user_password, update_forget_password)
from src.chat.util.decorator import token_required


@api.route('/')
class List(Resource):
    """
       Collection for Users
    """

    @token_required
    @api.doc('List_of_registered_users', params=user_params, security='Bearer')
    @api.response(int(HTTPStatus.OK), 'Collection for users.')
    @api.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Error internal server.')
    @api.response(int(HTTPStatus.UNAUTHORIZED), 'Unauthorized.')
    @api.response(int(HTTPStatus.FORBIDDEN), 'Provide a valid auth token.')
    @api.marshal_list_with(user_list)
    def get(self):
        """List all registered users"""
        filter_by = request.args.get('filter_by')
        return get_all_users(filter_by)

    @api.response(int(HTTPStatus.CREATED), 'User successfully created.', auth_resp)
    @api.response(int(HTTPStatus.CONFLICT), 'User already exists.')
    @api.doc('Create a new user')
    @api.expect(user_post, validate=True)
    def post(self):
        """Creates a new User """
        data = request.json
        return save_new_user(data=data)


@api.route('/me')
class Me(Resource):
    """
        My Profile
    """

    @token_required
    @api.doc('Get my profile', security='Bearer')
    @api.response(int(HTTPStatus.OK), 'Successfully get my profile.')
    @api.marshal_with(user_item)
    def get(self):
        return get_a_user(self.get.current_user_id)

    @token_required
    @api.doc('Edit my profile', security='Bearer')
    @api.expect(user_put, validate=True)
    @api.response(int(HTTPStatus.OK), 'Successfully edit my profile.')
    @api.response(int(HTTPStatus.BAD_REQUEST), 'Error.')
    @api.response(int(HTTPStatus.NOT_FOUND), 'Error not me.')
    @api.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Error saving data.')
    @api.marshal_with(user_item)
    def put(self):
        """Get data from json"""
        data = request.json
        return update_a_user(self.put.current_user_id, data)


@api.route('/me/reset-password')
class Me_Reset_Password(Resource):
    """
        Reset my password
    """

    @token_required
    @api.doc('Edit my password', security='Bearer')
    @api.expect(user_password, validate=True)
    @api.response(int(HTTPStatus.OK), 'Successfully edit my password.')
    @api.response(int(HTTPStatus.BAD_REQUEST), 'Error edit my password.')
    @api.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Error saving data.')
    def put(self):
        """Get data from json"""
        data = request.json
        return update_a_user_password(self.put.current_user_id, data)


@api.route('/me/forget-password')
class Me_Forget_Password(Resource):
    """
        Reset my password
    """

    @token_required
    @api.doc('Forgot my password', security='Bearer')
    @api.response(int(HTTPStatus.OK), 'Successfully send new password.')
    @api.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Error saving data.')
    def get(self):
        return update_forget_password(self.get.current_user_id)
