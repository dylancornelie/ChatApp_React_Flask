import json
import unittest
from http import HTTPStatus

from flask import url_for

from src.chat import db
from src.chat.model.pagination import Pagination
from src.chat.model.user import User
from src.chat.service.auth_service import encode_auth_token
from test.base import BaseTestCase


def register_user(client, email='test@test.com',
                  username='test', password='test',
                  first_name='first_name', last_name='last_name'):
    return client.post(
        url_for('api.user_v1_list'),
        data=json.dumps(dict(
            email=email,
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )),
        content_type='application/json'
    )


def get_user(client, token='', page=Pagination.DEFAULT_PAGE_NUMBER, per_page=Pagination.DEFAULT_PAGE_SIZE,
             filter_by=None):
    return client.get(
        url_for('api.user_v1_list',
                page=page,
                per_page=per_page,
                filter_by=filter_by
                ),
        headers=dict(Authorization='Bearer ' + token),
        content_type='application/json'
    )


class TestUserControllerModel(BaseTestCase):

    def seed(self, email='test@test.com',
             username='username', password='test',
             first_name='first name', last_name='last name', ):
        user = User(
            email=email,
            password=password,
            username=username,
            first_name=first_name,
            last_name=last_name,
        )
        db.session.add(user)
        db.session.commit()

    def test_post_new_user_require_username(self):
        with self.client as client:
            response = register_user(client, username=None)
            self.assert400(response)

    def test_post_new_user_require_email(self):
        with self.client as client:
            response = register_user(client, email=None)
            self.assert400(response)

    def test_post_new_user_require_password(self):
        with self.client as client:
            response = register_user(client, password=None)
            self.assert400(response)

    def test_post_new_user_require_first_name(self):
        with self.client as client:
            response = register_user(client, first_name=None)
            self.assert400(response)

    def test_post_new_user_require_last_name(self):
        with self.client as client:
            response = register_user(client, last_name=None)
            self.assert400(response)

    def test_post_new_user_success(self):
        with self.client as client:
            response = register_user(client)
            self.assertStatus(response, HTTPStatus.CREATED)
            response = json.loads(response.data)

            self.assertIsNotNone(response['authorization'])
            self.assertIsNotNone(response['token_expires_in'])
            self.assertEqual(5, response['token_expires_in'])
            self.assertIsNotNone(response['token_type'])
            self.assertEqual('Bearer', response['token_type'])

    def test_post_new_user_error_exist(self):
        with self.client as client:
            response = register_user(client)
            self.assertStatus(response, HTTPStatus.CREATED)

            response = register_user(client)
            self.assertStatus(response, HTTPStatus.CONFLICT)

            response = json.loads(response.data)
            self.assertEqual('User already exists. Please Log in.', response['message'])

    def test_get_list_user_without_provide_token_authorization(self):
        with self.client as client:
            response = client.get(url_for('api.user_v1_list'))
            self.assert403(response)

    def test_get_list_user_without_provide_token_bearer(self):
        with self.client as client:
            response = client.get(url_for('api.user_v1_list'),
                                  headers=dict(Authorization='token'))
            self.assert403(response)

    def test_get_list_user_without_provide_invalid_bearer_and_token(self):
        with self.client as client:
            response = client.get(url_for('api.user_v1_list'),
                                  headers=dict(Authorization='Bearer' + 'token'))
            self.assert403(response)

    def test_get_list_user_success_basic(self):
        token, _ = encode_auth_token(1)
        with self.client as client:
            response = get_user(client, token=token)
            self.assert200(response)

    def test_get_list_user_success_having_full_attributes(self):
        self.seed()
        token, _ = encode_auth_token(1)

        with self.client as client:
            response = get_user(client, token=token)
            self.assert200(response)

            response = json.loads(response.data)

            self.assertIsNotNone(response['has_prev'])
            self.assertFalse(response['has_prev'])

            self.assertIsNotNone(response['has_next'])
            self.assertFalse(response['has_next'])

            self.assertIsNotNone(response['prev'])
            self.assertIsNotNone(response['next'])

            self.assertIsNotNone(response['total'])
            self.assertEqual(1, response['total'])

            self.assertIsNotNone(response['pages'])
            self.assertEqual(1, response['pages'])

            self.assertIsNotNone(response['data'])
            self.assertEqual(1, len(response['data']))

    def test_get_list_user_success_having_follow_pages(self):
        for i in range(5):
            self.seed(email=f'test{i}@test.com', username=f'username{i}')

        with self.client as client:
            token, _ = encode_auth_token(1)
            response = get_user(client, token=token, per_page=3)
            self.assert200(response)

            response = json.loads(response.data)

            self.assertFalse(response['has_prev'])
            self.assertTrue(response['has_next'])
            self.assertEqual(5, response['total'])
            self.assertEqual(2, response['pages'])
            self.assertEqual(3, len(response['data']))

            token, _ = encode_auth_token(1)
            response = get_user(client, token=token, page=2, per_page=3)
            self.assert200(response)

            response = json.loads(response.data)

            self.assertTrue(response['has_prev'])
            self.assertFalse(response['has_next'])
            self.assertEqual(5, response['total'])
            self.assertEqual(2, response['pages'])
            self.assertEqual(2, len(response['data']))

    def test_get_list_user_success_filter_by(self):
        for i in range(5):
            self.seed(email=f'test{i}@test.com', username=f'username{i}')

        with self.client as client:
            token, _ = encode_auth_token(1)
            response = get_user(client, token=token, filter_by='username')
            self.assert200(response)

            response = json.loads(response.data)
            self.assertEqual(5, response['total'])

            token, _ = encode_auth_token(1)
            response = get_user(client, token=token, filter_by='1')
            self.assert200(response)

            response = json.loads(response.data)
            self.assertEqual(1, response['total'])


if __name__ == '__main__':
    unittest.main()
