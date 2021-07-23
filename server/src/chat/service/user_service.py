"""Service logic for user """
import random
import string
from http import HTTPStatus
from typing import Dict, Tuple

from flask import current_app
from flask_mailman import EmailMessage
from werkzeug.exceptions import Conflict, InternalServerError, BadRequest

from src.chat import db
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


def get_all_users(filter_by) -> Pagination:
    query = User.query

    if filter_by:
        query = query.filter((User.username.like(f'%{filter_by}%'))
                             | (User.first_name.like(f'%{filter_by}%'))
                             | (User.last_name.like(f'%{filter_by}%'))
                             )

    return paginate(query)


def get_a_user(id: int) -> User:
    return User.query.filter_by(id=id).first()


def update_a_user(id: int, new_data) -> User:
    user = User.query.filter_by(id=id).first_or_404()

    try:
        for k, v in new_data.items():
            setattr(user, k, v)
        db.session.commit()
        return user

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to save your data.")


def update_a_user_password(id: int, data) -> Dict:
    user = User.query.filter_by(id=id).first_or_404()
    errors = dict()
    if not user.check_password(data['older_password']):
        errors['older_password'] = "'older_password' is not correct"
    if user.check_password(data['new_password']):
        errors['new_password'] = "'new_password' must be different from old"
    if len(errors) != 0:
        e = BadRequest()
        e.data = dict(
            errors=errors,
            message='Input payload validation failed'
        )
        raise e

    try:
        user.password = data['new_password']
        db.session.commit()
        return dict(message='Your password was successfully changed')

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to save your data.")


def update_forget_password(id: int) -> Dict:
    user = User.query.filter_by(id=id).first_or_404()

    letters = string.ascii_lowercase
    new_password = ''.join(random.choice(letters) for _ in range(8))

    try:
        user.password = new_password
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to save your data.")

    try:
        msg = EmailMessage(
            subject='Reset random password',
            from_email='',
            body=f"Hey {user.username}, sending you this email from {current_app.config['APPLICATION']}.\nYour new password is: {new_password}",
            to=[user.email]
        )
        msg.send()
    except Exception as e:
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to send your email.")

    return dict(message='Your new password was successfully sent your email')


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
