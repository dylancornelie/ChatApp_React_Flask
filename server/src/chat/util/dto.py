from flask_restx import Namespace, fields


class UserDto:
    api = Namespace('user', description='user related operations')
    _user = api.model('user', {
        'email': fields.String(required=True, description='user email address'),
        'username': fields.String(required=True, description='user username'),
    })
    user_post = api.inherit('user_post', _user, {
        'password': fields.String(required=True, description='user password'),
    })
    user_get = api.inherit('user_get', _user, {
        'public_id': fields.String(description='user Identifier'),
    })
