import json
import unittest
from http import HTTPStatus

from flask import url_for

from test.base import BaseTestCase
from test.controller.test_auth_controller import login_user


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


class TestUserControllerModel(BaseTestCase):

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


if __name__ == '__main__':
    unittest.main()
