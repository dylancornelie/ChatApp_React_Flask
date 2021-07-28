"""API endpoint definitions for /project namespace."""

from http import HTTPStatus

from flask import request
from flask_restx import Resource

from src.chat.dto.project_dto import (
    api, project_list, project_item, project_post, project_params,
    project_invite, project_designate_coach
)
from src.chat.service.project_service import (
    save_new_project, get_all_projects, update_project, delete_project,
    invite_participant_into_project, leave_from_project, designate_coach_into_project, withdraw_coach_in_project
)
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
@api.doc('Item project', security='Bearer')
@api.response(int(HTTPStatus.OK), 'Successfully edit the project.')
@api.response(int(HTTPStatus.FORBIDDEN), 'Error unauthorized.')
@api.response(int(HTTPStatus.NOT_FOUND), 'Not found project.')
@api.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Error saving data.')
class Item(Resource):
    @token_required
    def put(self, id: int):
        """Edit your registered project"""
        data = request.json
        return update_project(self.put.current_user_id, id, data)

    @token_required
    def delete(self, id: int):
        """Delete your project"""
        return delete_project(self.delete.current_user_id, id)


@api.route('/<int:id>/invite')
@api.doc('Invite participant into the project', security='Bearer')
@api.response(int(HTTPStatus.OK), 'Successfully add new participants the project.')
@api.response(int(HTTPStatus.FORBIDDEN), 'Error unauthorized.')
@api.response(int(HTTPStatus.NOT_FOUND), 'Not found project.')
@api.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Error saving data.')
class Invite(Resource):
    @token_required
    @api.expect(project_invite, validate=True)
    def post(self, id: int):
        """Invite some participants into the project"""
        data = request.json
        return invite_participant_into_project(self.post.current_user_id, id, data)


@api.route('/<int:id>/leave')
@api.doc('Participant left from the project', security='Bearer')
@api.response(int(HTTPStatus.OK), 'Successfully add new participants the project.')
@api.response(int(HTTPStatus.FORBIDDEN), 'Error unauthorized.')
@api.response(int(HTTPStatus.NOT_FOUND), 'Not found project.')
@api.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Error saving data.')
class Leave(Resource):
    @token_required
    def delete(self, id: int):
        """Participant want to left from the project"""
        return leave_from_project(self.delete.current_user_id, id)


@api.route('/<int:id>/designate-coaches')
@api.doc('A coach (and the owner) can designate a new coach, remove the coach status', security='Bearer')
@api.response(int(HTTPStatus.OK), 'Successfully designate new coach the project.')
@api.response(int(HTTPStatus.FORBIDDEN), 'Error unauthorized.')
@api.response(int(HTTPStatus.NOT_FOUND), 'Not found project.')
@api.response(int(HTTPStatus.INTERNAL_SERVER_ERROR), 'Error saving data.')
class Designate(Resource):
    @token_required
    @api.expect(project_designate_coach, validate=True)
    def post(self, id: int):
        """A coach (and the owner) can designate some new coaches. They will be withdrawn from list participants"""
        data = request.json
        return designate_coach_into_project(self.post.current_user_id, id, data)

    @token_required
    @api.expect(project_designate_coach, validate=True)
    def delete(self, id: int):
        """A coach (and the owner) can withdraw some coaches status in project and they will be a participant"""
        data = request.json
        return withdraw_coach_in_project(self.post.current_user_id, id, data)
