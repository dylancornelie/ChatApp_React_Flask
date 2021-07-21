from functools import wraps
from flask import request

from src.chat.service.auth_service import get_logged_in_user


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        data, status = get_logged_in_user(request)
        current_user_id = data.get('data')
        if not current_user_id:
            return data, status

        return f(current_user_id, *args, **kwargs)

    return decorated
