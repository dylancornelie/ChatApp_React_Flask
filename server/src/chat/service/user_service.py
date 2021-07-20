from http import HTTPStatus
from typing import Dict, Tuple

from src.chat import db
from src.chat.model.pagination import Pagination
from src.chat.model.user import User
from src.chat.util.pagination import paginate


def save_new_user(data: Dict[str, str]) -> Tuple[Dict[str, str], int]:
    user = User.query.filter((User.email == data['email']) | (User.username == data['username'])).first()
    if not user:
        new_user = User(
            email=data['email'],
            username=data['username'],
            password=data['password']
        )
        save_changes(new_user)
        response_object = {
            'status': 'success',
            'message': 'Successfully registered.'
        }
        return response_object, HTTPStatus.CREATED

    else:
        response_object = {
            'status': 'fail',
            'message': 'User already exists. Please Log in.',
        }
        return response_object, HTTPStatus.CONFLICT


def get_all_users() -> Pagination:
    return paginate(User.query)


def get_a_user(public_id) -> User:
    return User.query.filter_by(public_id=public_id).first()


def save_changes(data: User) -> None:
    db.session.add(data)
    db.session.commit()
