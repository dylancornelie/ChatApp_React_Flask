from http import HTTPStatus
from typing import Dict, Tuple

from src.chat import db
from src.chat.model.blacklist import BlacklistToken


def save_token(token: str) -> Tuple[Dict[str, str], int]:
    blacklist_token = BlacklistToken(token=token)
    try:
        # insert the token
        db.session.add(blacklist_token)
        db.session.commit()
        response_object = {
            'status': 'success',
            'message': 'Successfully logged out.'
        }
        return response_object, HTTPStatus.OK
    except Exception as e:
        response_object = {
            'status': 'fail',
            'message': e
        }
        return response_object, HTTPStatus.INTERNAL_SERVER_ERROR


def check_blacklist(auth_token) -> bool:
    # check whether auth token has been blacklisted
    return BlacklistToken.query.filter_by(token=str(auth_token)).first() is not None
