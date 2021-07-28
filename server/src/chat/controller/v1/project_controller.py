"""API endpoint definitions for /project namespace."""

from http import HTTPStatus

from flask import request
from flask_restx import Resource

from src.chat.dto.project_dto import (api, project_list, project_item, project_post, project_put, project_params)
from src.chat.service.project_service import (save_new_project, get_all_projects, update_project, delete_project)
from src.chat.util.decorator import token_required


@api.route('/')
class List(Resource):
    """
       Collection for Project
    """

    @token_required
    @api.doc('List of project', params=project_params, security='Bearer')
    @api.response(int(HTTPStatus.OK), 'Collection for projects.')
    @api.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Error internal server.')
    @api.response(int(HTTPStatus.UNAUTHORIZED), 'Unauthorized.')
    @api.response(int(HTTPStatus.FORBIDDEN), 'Provide a valid auth token.')
    @api.marshal_list_with(project_list, skip_none=True)
    def get(self):
        """List all registered project"""
        filter_by = request.args.get('filter_by')
        return get_all_projects(current_user_id=self.get.current_user_id, filter_by=filter_by)

    @token_required
    @api.doc('Create a new project', security='Bearer')
    @api.response(int(HTTPStatus.CREATED), 'Project successfully created.')
    @api.response(int(HTTPStatus.CONFLICT), 'Project already exists.')
    @api.expect(project_post, validate=True)
    @api.marshal_with(project_item, skip_none=True)
    def post(self):
        """Creates a new Project """
        data = request.json
        return save_new_project(current_user_id=self.post.current_user_id, data=data)


@api.route('/<int:id>')
class Item(Resource):
    @token_required
    @api.doc('Edit the project', security='Bearer')
    @api.expect(project_put, validate=True)
    @api.response(int(HTTPStatus.OK), 'Successfully edit the project.')
    @api.response(int(HTTPStatus.FORBIDDEN), 'Error unauthorized.')
    @api.response(int(HTTPStatus.NOT_FOUND), 'Not found project.')
    @api.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Error saving data.')
    def put(self, id: int):
        """Edit your registered project"""
        data = request.json
        return update_project(self.put.current_user_id, id, data)

    @token_required
    @api.doc('Delete your project.', security='Bearer')
    @api.response(int(HTTPStatus.OK), 'Successfully remove the project.')
    @api.response(int(HTTPStatus.FORBIDDEN), 'Error unauthorized.')
    @api.response(int(HTTPStatus.NOT_FOUND), 'Not found project.')
    @api.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Error saving data.')
    def delete(self, id: int):
        """Delete your project"""
        return delete_project(self.delete.current_user_id, id)
