import datetime
from http import HTTPStatus
from typing import Dict, Tuple
from typing import Union

import jwt

from src.chat.config import key
from src.chat.model.user import User
from src.chat.service.blacklist_service import save_token, check_blacklist


def encode_auth_token(user_id: int) -> str:
    """
    Generates the Auth Token ex
    :return: string
    """
    try:
        payload = {
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1, seconds=5),
            'iat': datetime.datetime.utcnow(),
            'sub': user_id
        }
        return jwt.encode(
            payload,
            key,
            algorithm='HS256'
        )
    except Exception as e:
        raise e


def decode_auth_token(auth_token: str) -> Union[str, int]:
    """
    Decodes the auth token
    :param auth_token:
    :return: integer|string
    """
    try:
        payload = jwt.decode(auth_token, key, algorithms=['HS256'])
        is_blacklisted_token = check_blacklist(auth_token)
        if is_blacklisted_token:
            return 'Token blacklisted. Please log in again.'
        else:
            return payload['sub']
    except jwt.ExpiredSignatureError:
        return 'Signature expired. Please log in again.'
    except jwt.InvalidTokenError:
        return 'Invalid token. Please log in again.'


def login_user(data: Dict[str, str]) -> Tuple[Dict[str, str], int]:
    try:
        # fetch the user data
        user = User.query.filter_by(email=data.get('email')).first()
        if user and user.check_password(data.get('password')):
            auth_token = User.encode_auth_token(user.id)
            if auth_token:
                response_object = {
                    'status': 'success',
                    'message': 'Successfully logged in.',
                    'Authorization': auth_token
                }
                return response_object, HTTPStatus.OK
        else:
            response_object = {
                'status': 'fail',
                'message': 'email or password does not match.'
            }
            return response_object, HTTPStatus.UNAUTHORIZED

    except Exception as e:
        response_object = {
            'status': 'fail',
            'message': 'Try again'
        }
        return response_object, HTTPStatus.INTERNAL_SERVER_ERROR


def logout_user(data: str) -> Tuple[Dict[str, str], int]:
    if data:
        auth_token = data.split(" ")[1]
    else:
        auth_token = ''
    if auth_token:
        resp = User.decode_auth_token(auth_token)
        if not isinstance(resp, str):
            # mark the token as blacklisted
            return save_token(token=auth_token)
        else:
            response_object = {
                'status': 'fail',
                'message': resp
            }
            return response_object, HTTPStatus.UNAUTHORIZED
    else:
        response_object = {
            'status': 'fail',
            'message': 'Provide a valid auth token.'
        }
        return response_object, HTTPStatus.FORBIDDEN


def get_logged_in_user(new_request):
    # get the auth token
    auth_token = new_request.headers.get('Authorization')
    if auth_token:
        resp = User.decode_auth_token(auth_token)
        if not isinstance(resp, str):
            user = User.query.filter_by(id=resp).first()
            response_object = {
                'status': 'success',
                'data': {
                    'user_id': user.id,
                    'email': user.email,
                }
            }
            return response_object, HTTPStatus.OK
        response_object = {
            'status': 'fail',
            'message': resp
        }
        return response_object, HTTPStatus.UNAUTHORIZED
    else:
        response_object = {
            'status': 'fail',
            'message': 'Provide a valid auth token.'
        }
        return response_object, HTTPStatus.UNAUTHORIZED
