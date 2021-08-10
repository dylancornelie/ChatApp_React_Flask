from flask import request
from flask_restx import marshal
from flask_socketio import Namespace

from src.chat.dto.message_dto import message_item
from src.chat.service.message_service import save_new_message, valid_input_room, valid_input_message, \
    notify_new_message_into_members_offline
from src.chat.service.ws_service import (save_user_id_with_sid, delete_user_id_by_sid, get_user_id_by_sid,
                                         user_join_into_project, user_leave_from_project, get_sid_by_user_id_in_room)
from src.chat.util.decorator import token_required


class WsMessageNamespace(Namespace):

    @token_required
    def on_connect(self):
        save_user_id_with_sid(self.on_connect.current_user_id)

    def on_join_project(self, data):
        data = valid_input_room(data)
        self.enter_room(request.sid, data.get('room'))

        # Add one user online in project
        user_id = get_user_id_by_sid()
        list_online = user_join_into_project(data.get('room'))

        self.emit('online', data=dict(user_id=user_id), room=data.get('room'), include_self=False)

        return list_online

    def on_leave_project(self, data):
        data = valid_input_room(data)
        self.leave_room(request.sid, data.get('room'))

        # one user leave from project
        data_leave = user_leave_from_project(data.get('room'))
        self.emit('offline', data=dict(user_id=data_leave.get('user_id')), room=data_leave.get('room'),
                  include_self=False)

    def on_send_message(self, data):
        data = valid_input_message(data)
        data['sender_id'] = get_user_id_by_sid()

        message = save_new_message(data)
        message_dto = marshal(message, message_item, skip_none=True)

        if not message.receiver_id:
            self.emit('receive_message', data=message_dto, room=data.get('room'), include_self=False)
            notify_new_message_into_members_offline(message=message, room=data.get('room'))
        else:
            sid_receive = get_sid_by_user_id_in_room(user_id=message.receiver_id, room=data.get('room'))
            if sid_receive:
                self.emit('receive_message', data=message_dto, room=sid_receive, include_self=False)
            else:
                notify_new_message_into_members_offline(message=message, only_receive=True)

        return message_dto

    def on_disconnect(self):
        data = delete_user_id_by_sid()
        if data.get('room'):
            user_leave_from_project(data.get('room'), data.get('user_id'))
            self.emit('offline', data=dict(user_id=data.get('user_id')), room=data.get('room'), include_self=False)
