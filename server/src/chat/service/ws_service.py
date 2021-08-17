import json
from typing import List, Optional, Dict

from flask import request

from src.chat import redis


def save_user_id_with_sid(user_id: int) -> None:
    data = dict(user_id=user_id)
    redis.set(_get_sid_channel(), json.dumps(data))


def delete_user_id_by_sid() -> Dict:
    channel = _get_sid_channel()
    data = redis.get(channel)
    redis.delete(channel)
    return _transfer_data(data)


def get_user_id_by_sid() -> Optional[int]:
    data = redis.get(_get_sid_channel())
    if data:
        data = _transfer_data(data)
        return data.get('user_id')
    return None


def get_sid_by_user_id_in_room(user_id: int, room: str) -> Optional[str]:
    data = redis.sscan(room, 0, f'*user_id*{user_id}*')[1]
    return _transfer_data(data).get('sid') if data else None


def get_all_user_in_room(room: str) -> List:
    return [_transfer_data(x) for x in redis.smembers(room)]


def user_join_into_project(room: str) -> List:
    data = json.dumps(
        dict(
            user_id=get_user_id_by_sid(),
            sid=request.sid,
            room=room
        ),
        sort_keys=True
    )
    redis.sadd(room, data)
    redis.set(_get_sid_channel(), data)

    return [dict(user_id=x.get('user_id')) for x in get_all_user_in_room(room)]


def user_leave_from_project() -> Dict:
    channel = _get_sid_channel()
    data = redis.get(channel)

    # remove user's sid
    redis.delete(channel)

    if data:
        data = _transfer_data(data)

        # remove user's room
        if data.get('room'):
            redis.srem(data.get('room'), json.dumps(data, sort_keys=True))

    return data


def _get_sid_channel() -> str:
    return f'sid:{request.sid}'


def _transfer_data(data) -> Dict:
    if isinstance(data, bytes):
        data = data.decode("utf-8")
    return json.loads(data)
