"""Service logic for auth """

from datetime import datetime, timezone, timedelta
from typing import Dict, Tuple

import jwt
from flask import current_app, request
from werkzeug.exceptions import Unauthorized, Forbidden

from src.chat.model.user import User
from src.chat.service.blacklist_service import save_token_into_blacklist, check_blacklist


def encode_auth_token(user_id: int) -> Tuple[str, int]:
    """
    Generates the Auth Token ex
    :param user_id: integer
    :return: string: JWT
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

    payload = dict(exp=expire, iat=now, sub=user_id)
    key = current_app.config.get("SECRET_KEY")

    return jwt.encode(payload, key, algorithm="HS256"), expire_in


def decode_auth_token(auth_token: str) -> int:
    """
    Decodes the auth token
    :param auth_token: string : JWT
    :return: integer|string: User's ID or Error message
    """
    try:
        payload = jwt.decode(auth_token, key=current_app.config.get("SECRET_KEY"), algorithms=['HS256'])
        if not check_blacklist(auth_token):
            return payload['sub']
        raise Unauthorized('Token blacklisted. Please log in again.')
    except jwt.ExpiredSignatureError:
        raise Unauthorized('Signature expired. Please log in again.')
    except jwt.InvalidTokenError:
        raise Unauthorized('Invalid token. Please log in again.')


def login_user(email: str, password: str) -> Dict[str, str]:
    """
        Login by user's email
        :param email: str
        :param password: str
        :return: object, integer: Object message and http's status
    """
    # fetch the user data
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        auth_token, expire = encode_auth_token(user.id)
        response_object = dict(
            message='Successfully logged in.',
            authorization=auth_token,
            token_type='Bearer',
            token_expires_in=expire
        )
        return response_object
    raise Unauthorized('email or password does not match.')


def logout_user() -> str:
    """
       Logout account
       :return: object: Object message
    """
    auth_token = _get_auth_token()

    # mark the token as blacklisted
    return save_token_into_blacklist(token=auth_token)


def get_logged_in_user() -> int:
    """
       Login by user's email
       :return: object: Object message
    """
    # get the auth token
    auth_token = _get_auth_token()
    return decode_auth_token(auth_token)


def _get_auth_token() -> str:
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        raise Forbidden('Provide a valid auth token.')
    if not auth_header.startswith('Bearer '):
        raise Unauthorized('Bearer token malformed.')
    auth_token = auth_header.split(" ")[1]
    if not auth_token:
        raise Forbidden('Provide a valid auth token.')
    return auth_token
