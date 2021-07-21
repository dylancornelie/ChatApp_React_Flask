import json
import unittest
from http import HTTPStatus

from flask import url_for

from src.chat import db
from src.chat.model.user import User
from test.base import BaseTestCase
from test.controller.test_auth_controller import login_user, register_user


class TestUserControllerModel(BaseTestCase):
    users = []

    def test_post_new_user_miss_username_receive_BAD_REQUEST(self):
        response = self.client.post(
            url_for('api.user_v1_list'),
            data=json.dumps(dict(
                email='example@gmail.com',
                password='123456'
            )),
            content_type='application/json'
        )
        self.assert400(response)

    def test_post_new_user_miss_email_receive_BAD_REQUEST(self):
        response = self.client.post(
            url_for('api.user_v1_list'),
            data=json.dumps(dict(
                username='example',
                password='123456'
            )),
            content_type='application/json'
        )
        self.assert400(response)

    def test_post_new_user_miss_password_receive_BAD_REQUEST(self):
        response = self.client.post(
            url_for('api.user_v1_list'),
            data=json.dumps(dict(
                email='example@gmail.com',
                username='example',
            )),
            content_type='application/json'
        )
        self.assert400(response)

    def test_post_new_user_not_email_receive_BAD_REQUEST(self):
        response = self.client.post(
            url_for('api.user_v1_list'),
            data=json.dumps(dict(
                email='example',
                username='example',
                password='123456'
            )),
            content_type='application/json'
        )
        self.assert400(response)

    def test_post_new_user_receive_OK(self):
        response = self.client.post(
            url_for('api.user_v1_list'),
            data=json.dumps(dict(
                email='example@gmail.com',
                username='example',
                password='123456',
                first_name='first name',
                last_name='last name',
            )),
            content_type='application/json'
        )
        self.assertStatus(response, HTTPStatus.CREATED)

    def test_get_item_user_receive_OK(self):
        with self.client:
            # user registration
            register_user(self)

            # registered user login
            login_response = login_user(self)

            response = self.client.get(
                url_for('api.user_v1_item', id=1),
                headers=dict(
                    Authorization='Bearer ' + json.loads(
                        login_response.data
                    )['Authorization']
                ))
            self.assert200(response)

    def test_get_item_user_receive_NOT_FOUND(self):
        with self.client:
            # user registration
            register_user(self)

            # registered user login
            login_response = login_user(self)

            response = self.client.get(
                url_for('api.user_v1_item', id=123),
                headers=dict(
                    Authorization='Bearer ' + json.loads(
                        login_response.data
                    )['Authorization']
                ))
            self.assert404(response)

if __name__ == '__main__':
    unittest.main()
