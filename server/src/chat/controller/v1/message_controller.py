"""API endpoint definitions for /messages namespace."""

from http import HTTPStatus

from flask import request
from flask_restx import Resource

from src.chat.dto.message_dto import api, message_list, message_post, message_params
from src.chat.service.message_service import save_new_message, get_all_messages
from src.chat.util.decorator import token_required


@api.route('/<int:project_id>')
class List(Resource):
    """
       Collection for Message in Project
    """

    @token_required
    @api.doc('List of message', params=message_params, security='Bearer')
    @api.response(int(HTTPStatus.OK), 'Collection for projects.', message_list, skip_none=True)
    @api.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Error internal server.')
    @api.response(int(HTTPStatus.UNAUTHORIZED), 'Unauthorized.')
    @api.response(int(HTTPStatus.FORBIDDEN), 'Provide a valid auth token.')
    @api.marshal_with(message_list, skip_none=True)
    def get(self, project_id: int):
        """List all registered message in project"""
        return get_all_messages(user_id=self.get.current_user_id, project_id=project_id)

    # @token_required
    # @api.doc('Create a new message', security='Bearer')
    # @api.response(int(HTTPStatus.CREATED), 'Message successfully created.')
    # @api.response(int(HTTPStatus.CONFLICT), 'Message already exists.')
    # @api.expect(message_post, validate=True)
    # def post(self, project_id: int):
    #     """All member can create a new Message"""
    #     data = request.json
    #     return save_new_message(user_id=self.post.current_user_id, project_id=project_id, data=data)
