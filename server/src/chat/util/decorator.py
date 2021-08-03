from functools import wraps

from flask import request
from werkzeug.exceptions import Forbidden

from src.chat.service.auth_service import decode_auth_token


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_token = _get_auth_token()
        current_user_id = decode_auth_token(auth_token)

        setattr(decorated, 'auth_token', auth_token)
        setattr(decorated, 'current_user_id', current_user_id)

        return f(*args, **kwargs)

    return decorated


def _get_auth_token() -> str:
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        raise Forbidden('Provide a valid auth token.')
    if not auth_header.startswith('Bearer'):
        raise Forbidden('Bearer token malformed.')
    auth_token = auth_header.split(" ")
    if len(auth_token) == 1:
        raise Forbidden('Provide a valid auth token.')
    return auth_token[1]
