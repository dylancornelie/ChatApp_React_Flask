from flask_restx import Namespace, fields

from src.chat.model.pagination import Pagination


def _list_model(data):
    return {
        'total': fields.Integer(description='the total number of items'),
        'pages': fields.Integer(description='the total number of pages'),
        'has_next': fields.Boolean(description='true if a next page exists'),
        'has_prev': fields.Boolean(description='true if a previous page exists'),
        'next': fields.String(description='a pagination for the next page'),
        'prev': fields.String(description='a pagination object for the previous page'),
        'data': fields.List(fields.Nested(data), description='the items for the current page'),
    }


params = {
    'page': {'in': 'query', 'description': 'The current page number', 'default': Pagination.DEFAULT_PAGE_NUMBER,
             'type': 'integer'},
    'per_page': {'in': 'query', 'description': 'The number of items to be displayed on a page',
                 'default': Pagination.DEFAULT_PAGE_SIZE,
                 'type': 'integer'}
}


class UserDto:
    api = Namespace('user_v1', description='user related operations')
    user_post = api.schema_model('user_post', {
        'required': ['email', 'username', 'password', 'first_name', 'last_name'],
        'properties': {
            'email': {
                'type': 'string',
                'format': 'email',
                'pattern': '^\\S+@\\S+\\.\\S+$',
                'title': 'user email address',
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
    user_item = api.model('user_item', {
        'id': fields.Integer(description="user's identifier"),
        'email': fields.String(description='user email address'),
        'username': fields.String(description='user username'),
        'first_name': fields.String(description="user's first name"),
        'last_name': fields.String(description="user's last name"),
    })
    user_list = api.model('user_list', model=_list_model(user_item))
