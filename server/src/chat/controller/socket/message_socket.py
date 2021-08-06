from flask import request
from flask_socketio import Namespace

from src.chat.service.socket.message_socket_service import ws_connect, input_room


class WsMessageNamespace(Namespace):

    def on_connect(self):
        ws_connect()

    def on_join_project(self, data):
        room = input_room(data)
        self.enter_room(request.sid, room)

    def on_leave_project(self, data):
        room = input_room(data)
        self.leave_room(request.sid, room)
