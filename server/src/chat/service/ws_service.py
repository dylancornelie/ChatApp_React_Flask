from typing import List

from flask import request

from src.chat import redis


def save_user_id_with_sid(user_id: int):
    redis.set(f'sid:{request.sid}', user_id)


def delete_user_id_by_sid():
    redis.delete(f'sid:{request.sid}')


def get_user_id_by_sid():
    redis.get(f'sid:{request.sid}')


def user_join_into_project(room: str) -> List:
    redis.sadd(room, get_user_id_by_sid())
    return list(
        map(
            lambda x: dict(user_id=int(x.decode("utf-8"))),
            list(redis.smembers(room)),
        )
    )


def user_leave_from_project(room: str) -> None:
    redis.srem(room, get_user_id_by_sid())
