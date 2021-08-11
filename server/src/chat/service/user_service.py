"""Service logic for user """
import json
import random
import string
from http import HTTPStatus
from typing import Dict, Tuple

from flask import current_app
from flask_mailman import EmailMessage
from werkzeug.exceptions import Conflict, InternalServerError, BadRequest

from src.chat import db, redis
from src.chat.model.pagination import Pagination
from src.chat.model.user import User
from src.chat.service import save_data
from src.chat.service.auth_service import generate_token
from src.chat.util.pagination import paginate
from src.chat.util.stream import sub_webpush


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
        return generate_token(user_id=new_user.id, message='Successfully registered.'), HTTPStatus.CREATED
    raise Conflict('User already exists. Please Log in.')


def get_all_users(filter_by) -> Pagination:
    query = User.query

    if filter_by:
        query = query.filter((User.username.like(f'%{filter_by}%'))
                             | (User.first_name.like(f'%{filter_by}%'))
                             | (User.last_name.like(f'%{filter_by}%'))
                             | (User.username.like(f'%{filter_by}%'))
                             )

    return paginate(query)


def get_a_user(id: int) -> User:
    return User.query.filter_by(id=id).first_or_404('User Not Found')


def update_a_user(id: int, new_data) -> Dict:
    user = get_a_user(id)

    try:
        for k, v in new_data.items():
            setattr(user, k, v)
        db.session.commit()
        return dict(message='Your profile was successfully changed')

    except Exception as e:
        db.session.rollback()
        current_app.logger.error(str(e), exc_info=True)
        raise InternalServerError("The server encountered an internal error and was unable to save your data.")


def update_a_user_password(id: int, data) -> Dict:
    user = get_a_user(id)
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


def update_forget_password(email: str) -> Dict:
    user = User.query.filter_by(email=email).first_or_404(f'{email} is not exist.')

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

    return dict(message=f'Your new password was successfully sent your email {email}.')


def sub_user_channel(user_id: int) -> str:
    return f"sub:user:{user_id}"


def store_data_subscription_webpub(data: Dict, user_id: int) -> Dict:
    channel = sub_webpush(sub_user_channel(user_id))
    redis.set(channel, json.dumps(data))
    return dict(message='Stored the key')


def unsubscription_data_subscription_webpub(user_id: int) -> Dict:
    channel = sub_webpush(sub_user_channel(user_id))
    redis.delete(channel)
    return dict(message='Stored the key')
