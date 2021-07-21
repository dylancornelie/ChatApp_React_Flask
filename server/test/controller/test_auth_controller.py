import unittest
import json
from http import HTTPStatus
from test.base import BaseTestCase
from flask import url_for


def register_user(self):
    return self.client.post(
        url_for('api.user_v1_list'),
        data=json.dumps(dict(
            email='example@gmail.com',
            username='username',
            password='123456',
            first_name='first name',
            last_name='last name',
        )),
        content_type='application/json'
    )


def login_user(self):
    return self.client.post(
        url_for('api.auth_login'),
        data=json.dumps(dict(
            email='example@gmail.com',
            password='123456'
        )),
        content_type='application/json'
    )


class TestAuthBlueprint(BaseTestCase):

    def test_register_user(self):
        """ Test for register user """
        with self.client:
            # user registration
            user_response = register_user(self)
            response_data = json.loads(user_response.data)
            self.assertIsNotNone(response_data['Authorization'])
            self.assertStatus(user_response, HTTPStatus.CREATED)

    def test_registered_user_login(self):
        """ Test for login of registered-user login """
        with self.client:
            # user registration
            register_user(self)

            # registered user login
            login_response = login_user(self)
            data = json.loads(login_response.data)
            self.assertIsNotNone(data['Authorization'])
            self.assert200(login_response)

    def test_valid_logout(self):
        """ Test for logout before token expires """
        with self.client:
            # user registration
            register_user(self)

            # registered user login
            login_response = login_user(self)

            # valid token logout
            response = self.client.get(
                url_for('api.auth_logout'),
                headers=dict(
                    Authorization='Bearer ' + json.loads(
                        login_response.data
                    )['Authorization']
                )
            )
            data = json.loads(response.data)
            self.assertEqual('success', data['status'])
            self.assert200(response)


if __name__ == '__main__':
    unittest.main()
