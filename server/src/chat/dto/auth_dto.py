"""The definition for Auth schema."""

from flask_restx import Namespace

api = Namespace('auth', description='authentication related operations')

auth_login = api.schema_model('Auth_Login', {
    'type': 'object',
    'required': ['email', 'password'],
    'properties': {
        'email': {
            'type': 'string',
            'format': 'email',
        },
        'password': {
            'type': 'string',
        },
    }
})

auth_resp = api.schema_model('Auth_Resp', {
    'type': 'object',
    'properties': {
        'message': {
            'type': 'string',
        },
        'authorization': {
            'type': 'string',
            'title': 'An access token'
        },
        'token_type': {
            'type': 'string',
            'title': 'An type-token'
        },
        'expires_in': {
            'type': 'integer',
            'title': 'An lifetime in seconds of the Access Token'
        }
    }
})
