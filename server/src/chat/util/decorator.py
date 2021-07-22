from functools import wraps

from src.chat.service.auth_service import get_logged_in_user


def token_required(f):
    @wraps(f)
    def decorated(self, *args, **kwargs):
        current_user_id = get_logged_in_user()
        return f(self, current_user_id, *args, **kwargs)

    return decorated
