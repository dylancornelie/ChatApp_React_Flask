"""The definition for User schema."""

from flask_restx import Namespace, fields

from src.chat.util.pagination import list_model, params

api = Namespace('user_v1', description='user related operations')

user_post = api.schema_model('User_Post', {
    'required': ['email', 'username', 'password', 'first_name', 'last_name'],
    'properties': {
        'email': {
            'type': 'string',
            'format': 'email',
        },
        'username': {
            'type': 'string',
        },
        'password': {
            'type': 'string',
        },
        'first_name': {
            'type': 'string',
        },
        'last_name': {
            'type': 'string',
        },
    },
    'type': 'object',
})

user_put = api.schema_model('User_Put', {
    'required': ['email', 'username', 'first_name', 'last_name'],
    'properties': {
        'email': {
            'type': 'string',
            'format': 'email',
        },
        'username': {
            'type': 'string',
        },
        'first_name': {
            'type': 'string',
        },
        'last_name': {
            'type': 'string',
        },
    },
    'type': 'object',
})

user_password = api.schema_model('User_Password', {
    'required': ['older_password', 'new_password'],
    'properties': {
        'older_password': {
            'type': 'string',
        },
        'new_password': {
            'type': 'string',
        },
    },
    'type': 'object',
})


user_item = api.model('User_Item', {
    'id': fields.Integer(description="user's identifier"),
    'email': fields.String(description='user email address'),
    'username': fields.String(description='user username'),
    'first_name': fields.String(description="user's first name"),
    'last_name': fields.String(description="user's last name"),
})

user_list = api.model('User_List', model=list_model(user_item))

user_params = params.copy()
user_params['filter_by'] = {'in': 'query', 'description': 'The filter for email, first name and last name', 'type': 'string'}
