"""Service logic for auth """

from datetime import datetime, timezone, timedelta
from typing import Dict, Tuple

import jwt
from flask import current_app
from werkzeug.exceptions import Unauthorized

from src.chat.model.user import User
from src.chat.service.blacklist_service import save_token_into_blacklist, check_blacklist
from src.chat.service.user_service import get_a_user

def encode_auth_token(user_id: int, admin: bool = False) -> Tuple[str, int]:
    """
    Generates the Auth Token ex

    :param user_id: integer
    :return: string, int: JWT and expire_in
    """
    now = datetime.now(timezone.utc)

    if current_app.config["TESTING"]:
        expire = now + timedelta(seconds=5)
        expire_in = 5
    else:
        token_age_h = current_app.config.get("TOKEN_EXPIRE_HOURS")
        token_age_m = current_app.config.get("TOKEN_EXPIRE_MINUTES")
        expire = now + timedelta(hours=token_age_h, minutes=token_age_m)
        expire_in = token_age_h * 3600 + token_age_m * 60

    payload = dict(exp=expire, iat=now, sub=user_id, admin=admin)
    key = current_app.config.get("SECRET_KEY")
    token = jwt.encode(payload, key, algorithm="HS256")
    if isinstance(token, bytes):
        token = token.decode('UTF-8')
    return token, expire_in


def decode_auth_token(auth_token: str) -> Tuple[int, bool]:
    """
    Decodes the auth token

    :param auth_token: string : JWT
    :return: integer|string: User's ID or Error message
    """
    try:
        payload = jwt.decode(auth_token, key=current_app.config.get("SECRET_KEY"), algorithms=['HS256'])
        if not check_blacklist(auth_token):
            return payload.get('sub'), payload.get('admin')
        raise Unauthorized('Token was removed. Please log in again.')
    except jwt.ExpiredSignatureError:
        raise Unauthorized('Signature expired. Please log in again.')
    except jwt.InvalidTokenError:
        raise Unauthorized('Invalid token. Please log in again.')


def decode_auth_admin_token(auth_token: str) -> int:
    """
    Decodes the auth admin token

    :param auth_token: string : JWT
    :return: integer|string: User's ID or Error message
    """
    sub, admin = decode_auth_token(auth_token)
    if admin:
        return sub
    raise Unauthorized('You are not an administrator.')


def login_user(email: str, password: str) -> Dict:
    """
    Login by user's email

    :param email: str
    :param password: str
    :return: object: Object message JWT
    """
    # fetch the user data
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        if not user.archived:
            return generate_token(user_id=user.id, message='Successfully logged in.', admin=user.admin)
        raise Unauthorized('This account is archived.')
    raise Unauthorized('Email or Password does not match.')


def logout_user(auth_token: str) -> Dict:
    """
    Logout account

    :param auth_token: str
    :return: object: Object message
    """

    # mark the token as blacklisted
    save_token_into_blacklist(token=auth_token)
    response_object = dict(
        message='Successfully logged out.',
    )
    return response_object


def refresh_token(current_user_id: int) -> Dict:
    """
    Refresh token

    :param current_user_id: int
    :return: Dict: Object message JWT
    """
    user = get_a_user(current_user_id)
    return generate_token(user_id=user.id, message='Successfully refresh token.', admin=user.admin)


def generate_token(user_id: int, message: str, admin: bool = False) -> Dict:
    """
    Generate the auth token

    :param user_id: int
    :param message: str
    :return: Dict: Object consist JWT
    """
    auth_token, expire = encode_auth_token(user_id, admin)
    response_object = dict(
        message=message,
        authorization=auth_token,
        token_type='Bearer',
        token_expires_in=expire
    )
    return response_object
