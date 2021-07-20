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
    api = Namespace('user', description='user related operations')
    user_post = api.model('user_post', {
        'email': fields.String(required=True, description='user email address'),
        'username': fields.String(required=True, description='user username'),
        'password': fields.String(required=True, description='user password'),
    })
    user_item = api.model('user_item', {
        'email': fields.String(description='user email address'),
        'username': fields.String(description='user username'),
        'public_id': fields.String(description='user Identifier'),
    })
    user_list = api.model('user_list', model=_list_model(user_item))
