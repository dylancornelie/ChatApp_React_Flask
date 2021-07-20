import json
import unittest
from http import HTTPStatus

from flask import url_for

from src.chat import db
from src.chat.model.user import User
from test.base import BaseTestCase


class TestUserControllerModel(BaseTestCase):
    users = []

    def test_post_new_user_miss_username_receive_BAD_REQUEST(self):
        response = self.client.post(
            url_for('api-v1.user_list'),
            data=json.dumps(dict(
                email='example@gmail.com',
                password='123456'
            )),
            content_type='application/json'
        )
        self.assert400(response)

    def test_post_new_user_miss_email_receive_BAD_REQUEST(self):
        response = self.client.post(
            url_for('api-v1.user_list'),
            data=json.dumps(dict(
                username='example',
                password='123456'
            )),
            content_type='application/json'
        )
        self.assert400(response)

    def test_post_new_user_miss_password_receive_BAD_REQUEST(self):
        response = self.client.post(
            url_for('api-v1.user_list'),
            data=json.dumps(dict(
                email='example@gmail.com',
                username='example',
            )),
            content_type='application/json'
        )
        self.assert400(response)

    def test_post_new_user_not_email_receive_BAD_REQUEST(self):
        response = self.client.post(
            url_for('api-v1.user_list'),
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
            url_for('api-v1.user_list'),
            data=json.dumps(dict(
                email='example@gmail.com',
                username='example',
                password='123456'
            )),
            content_type='application/json'
        )
        self.assertStatus(response, HTTPStatus.CREATED)

    def test_get_item_user_receive_OK(self):
        user = User(
            email='example@gmail.com',
            username='example',
            password='123456'
        )
        db.session.add(user)
        db.session.commit()

        response = self.client.get(url_for('api-v1.user_item', public_id=user.public_id))
        self.assert200(response)

    def test_get_item_user_receive_NOT_FOUND(self):
        response = self.client.get(url_for('api-v1.user_item', public_id='user.public_id'))
        self.assert404(response)


if __name__ == '__main__':
    unittest.main()
