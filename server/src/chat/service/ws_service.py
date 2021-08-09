import json
from typing import List, Optional, Dict

from flask import request

from src.chat import redis


def save_user_id_with_sid(user_id: int) -> None:
    data = dict(user_id=user_id)
    redis.set(f'sid:{request.sid}', json.dumps(data))


def delete_user_id_by_sid() -> Dict:
    data = redis.getdel(f'sid:{request.sid}')
    return json.loads(data.decode("utf-8"))


def get_user_id_by_sid() -> int:
    data = redis.get(f'sid:{request.sid}')
    data = json.loads(data.decode("utf-8"))
    return data.get('user_id')


def get_sid_by_user_id_in_room(user_id: int, room: str) -> Optional[str]:
    for user in get_all_user_in_room(room):
        if user.get('user_id') == user_id:
            return user.get('sid')
    return None


def get_all_user_in_room(room: str) -> List:
    return list(
        map(
            lambda x: json.loads(x.decode("utf-8")),
            list(redis.smembers(room)),
        )
    )


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
    redis.set(f'sid:{request.sid}', data)

    return list(
        map(
            lambda x: dict(user_id=x.get('user_id')),
            get_all_user_in_room(room),
        )
    )


def user_leave_from_project(room: str) -> Dict:
    data = dict(
        user_id=get_user_id_by_sid(),
        sid=request.sid,
        room=room
    )
    redis.srem(room, json.dumps(data, sort_keys=True))
    return data
