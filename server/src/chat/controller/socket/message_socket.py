from flask import request
from flask_restx import marshal
from flask_socketio import Namespace

from src.chat.dto.message_dto import message_item
from src.chat.service.message_service import save_new_message, ws_connect, valid_input_room, valid_input_message


class WsMessageNamespace(Namespace):

    def on_connect(self):
        ws_connect()

    def on_join_project(self, data):
        room = valid_input_room(data)
        self.enter_room(request.sid, room)

    def on_leave_project(self, data):
        room = valid_input_room(data)
        self.leave_room(request.sid, room)

    def on_send_message(self, data):
        data = valid_input_message(data)
        message = save_new_message(data)
        message_dto = marshal(message, message_item, skip_none=True)

        self.emit('receive_message', data=message_dto, room=data.get('room'))
