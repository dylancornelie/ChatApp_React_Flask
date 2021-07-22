"""Service logic for user """

from http import HTTPStatus
from typing import Dict, Tuple

from werkzeug.exceptions import Conflict

from src.chat.model.pagination import Pagination
from src.chat.model.user import User
from src.chat.service import save_data
from src.chat.service.auth_service import encode_auth_token
from src.chat.util.pagination import paginate


def save_new_user(data: Dict[str, str]) -> Tuple[Dict[str, str], int]:
    user = User.query.filter((User.email == data['email']) | (User.username == data['username'])).first()
    if not user:
        new_user = User(
            email=data['email'],
            username=data['username'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name']
        )
        save_data(new_user)
        return _generate_token(new_user)
    raise Conflict('User already exists. Please Log in.')


def get_all_users() -> Pagination:
    return paginate(User.query)


def get_a_user(id) -> User:
    return User.query.filter_by(id=id).first()


def _generate_token(user: User):
    # generate the auth token
    auth_token, expire = encode_auth_token(user.id)
    response_object = dict(
        message='Successfully registered.',
        authorization=auth_token,
        token_type='Bearer',
        token_expires_in=expire
    )
    return response_object, HTTPStatus.CREATED
