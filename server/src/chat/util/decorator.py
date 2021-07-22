from functools import wraps

from src.chat.service.auth_service import get_logged_in_user


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        current_user_id = get_logged_in_user()
        setattr(decorated, 'current_user_id', current_user_id)
        return f(*args, **kwargs)

    return decorated
