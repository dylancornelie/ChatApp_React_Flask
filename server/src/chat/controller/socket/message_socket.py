from flask import request
from flask_restx import marshal
from flask_socketio import Namespace

from src.chat.dto.message_dto import message_item
from src.chat.service.message_service import save_new_message, valid_input_room, valid_input_message
from src.chat.service.project_service import user_join_into_project, user_leave_from_project
from src.chat.util.decorator import token_required


class WsMessageNamespace(Namespace):

    @token_required
    def on_connect(self):
        pass

    def on_join_project(self, data):
        data = valid_input_room(data)
        self.enter_room(request.sid, data.get('room'))

        # Add one user online in project
        list_online = user_join_into_project(data)

        self.emit('online', data=dict(user_id=data.get('user_id')), room=data.get('room'), include_self=False)

        return list_online

    def on_leave_project(self, data):
        data = valid_input_room(data)
        self.leave_room(request.sid, data.get('room'))

        # one user leave from project
        user_leave_from_project(data)
        self.emit('offline', data=dict(user_id=data.get('user_id')), room=data.get('room'), include_self=False)

    def on_send_message(self, data):
        data = valid_input_message(data)
        message = save_new_message(data)
        message_dto = marshal(message, message_item, skip_none=True)

        self.emit('receive_message', data=message_dto, room=data.get('room'))
