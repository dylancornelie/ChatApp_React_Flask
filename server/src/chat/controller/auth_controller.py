"""API endpoint definitions for /auth namespace."""

import http

from flask import request
from flask_restx import Resource

from src.chat.service.auth_service import login_user, logout_user
from src.chat.util.dto import AuthDto

api = AuthDto.api
user_auth = AuthDto.user_auth


@api.route('/login')
class Login(Resource):
    """
        User Login Resource
    """
    @api.doc('user login')
    @api.expect(user_auth, validate=True)
    @api.response(http.HTTPStatus.OK.numerator, 'Successfully logged in.')
    @api.response(http.HTTPStatus.UNAUTHORIZED.numerator, 'Email or password does not match.')
    def post(self):
        # get the post data
        return login_user(data=request.json)


@api.route('/logout')
class Logout(Resource):
    """
    Logout Resource
    """
    @api.doc('logout a user')
    @api.response(http.HTTPStatus.OK.numerator, 'Successfully logged out.')
    @api.response(http.HTTPStatus.INTERNAL_SERVER_ERROR.numerator, 'Error internal server.')
    @api.response(http.HTTPStatus.UNAUTHORIZED.numerator, 'Unauthorized.')
    @api.response(http.HTTPStatus.FORBIDDEN.numerator, 'Provide a valid auth token.')
    def get(self):
        return logout_user(request)
