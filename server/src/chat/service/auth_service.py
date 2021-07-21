import datetime
from http import HTTPStatus
from typing import Dict, Tuple, Union

import jwt

from src.chat.config import key
from src.chat.model.user import User
from src.chat.service.blacklist_service import save_token_into_blacklist, check_blacklist


def encode_auth_token(user_id: int) -> str:
    """
    Generates the Auth Token ex
    :param user_id: integer
    :return: string: JWT
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
    :param auth_token: string : JWT
    :return: integer|string: User's ID or Error message
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
    """
        Login by user's email
        :param data:
        :return: object, integer: Object message and http's status
    """
    try:
        # fetch the user data
        user = User.query.filter_by(email=data.get('email')).first()
        if user and user.check_password(data.get('password')):
            auth_token = encode_auth_token(user.id)
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


def logout_user(new_request) -> Tuple[Dict[str, str], int]:
    """
       Logout account
       :param new_request
       :return: object, integer: Object message and http's status
    """
    auth_header = new_request.headers.get('Authorization')
    if auth_header:
        try:
            auth_token = auth_header.split(" ")[1]
        except IndexError:
            responseObject = {
                'status': 'fail',
                'message': 'Bearer token malformed.'
            }
            return responseObject, HTTPStatus.UNAUTHORIZED
    else:
        auth_token = ''

    if auth_token:
        resp = decode_auth_token(auth_token)
        if not isinstance(resp, str):
            # mark the token as blacklisted
            return save_token_into_blacklist(token=auth_token)
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


def get_logged_in_user(new_request) -> Tuple[Dict[str, Union[str,int]], int]:
    """
       Login by user's email
       :param new_request:
       :return: object, integer: Object message and http's status
    """
    # get the auth token
    auth_header = new_request.headers.get('Authorization')
    if auth_header:
        try:
            auth_token = auth_header.split(" ")[1]
        except IndexError:
            responseObject = {
                'status': 'fail',
                'message': 'Bearer token malformed.'
            }
            return responseObject, HTTPStatus.UNAUTHORIZED
    else:
        auth_token = ''

    if auth_token:
        resp = decode_auth_token(auth_token)
        if not isinstance(resp, str):
            response_object = {
                'status': 'success',
                'user_id': resp
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
