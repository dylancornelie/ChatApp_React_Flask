"""API endpoint definitions for /auth namespace."""

from http import HTTPStatus

from flask import request
from flask_restx import Resource

from src.chat.dto.auth_dto import api, auth_login, auth_resp
from src.chat.service.auth_service import login_user, logout_user
from src.chat.util.decorator import token_required


@api.route('/login')
class Login(Resource):
    """
        User Login Resource
    """

    @api.doc('Login')
    @api.expect(auth_login, validate=True)
    @api.response(int(HTTPStatus.OK), 'Successfully logged in.', auth_resp)
    @api.response(int(HTTPStatus.UNAUTHORIZED), "Email or password does not match")
    @api.response(int(HTTPStatus.BAD_REQUEST), "Validation error.")
    @api.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), "Internal server error.")
    def post(self):
        # get the post data
        data = request.json
        return login_user(email=data['email'], password=data['password'])


@api.route('/logout')
class Logout(Resource):
    """
    Logout Resource
    """

    @token_required
    @api.doc('Logout a user', security='Bearer')
    @api.response(int(HTTPStatus.OK), 'Successfully logged out.')
    @api.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Error internal server.')
    @api.response(int(HTTPStatus.UNAUTHORIZED), 'Unauthorized.')
    @api.response(int(HTTPStatus.FORBIDDEN), 'Provide a valid auth token.')
    def get(self):
        return logout_user()
