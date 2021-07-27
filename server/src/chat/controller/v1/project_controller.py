"""API endpoint definitions for /project namespace."""

from http import HTTPStatus

from flask import request
from flask_restx import Resource

from src.chat.dto.project_dto import (api, project_list, project_item, project_post, project_params)
from src.chat.service.project_service import (save_new_project, get_all_projects)
from src.chat.util.decorator import token_required


@api.route('/')
class List(Resource):
    """
       Collection for Users
    """

    @token_required
    @api.doc('List_of_project', params=project_params, security='Bearer')
    @api.response(int(HTTPStatus.OK), 'Collection for users.')
    @api.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Error internal server.')
    @api.response(int(HTTPStatus.UNAUTHORIZED), 'Unauthorized.')
    @api.response(int(HTTPStatus.FORBIDDEN), 'Provide a valid auth token.')
    @api.marshal_list_with(project_list, skip_none=True)
    def get(self):
        """List all registered users"""
        filter_by = request.args.get('filter_by')
        return get_all_projects(current_user_id=self.get.current_user_id, filter_by=filter_by)

    @token_required
    @api.doc('Create a new project', security='Bearer')
    @api.response(int(HTTPStatus.CREATED), 'Project successfully created.')
    @api.response(int(HTTPStatus.CONFLICT), 'Project already exists.')
    @api.expect(project_post, validate=True)
    @api.marshal_with(project_item, skip_none=True)
    def post(self):
        """Creates a new User """
        data = request.json
        return save_new_project(current_user_id=self.post.current_user_id, data=data)
