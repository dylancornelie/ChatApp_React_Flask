import http
import unittest

from src.chat import db
from src.chat.model.user import User
from src.chat.service.blacklist_service import save_token
from test.base import BaseTestCase


class TestUserModel(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.seed()

    def seed(self):
        self.user = User(
            email='test@test.com',
            password='test',
        )
        db.session.add(self.user)
        db.session.commit()

    def test_encode_auth_token(self):
        auth_token = User.encode_auth_token(self.user.id)
        self.assertTrue(isinstance(auth_token, str))

    def test_decode_auth_token(self):
        auth_token = User.encode_auth_token(self.user.id)
        self.assertTrue(isinstance(auth_token, str))
        self.assertTrue(User.decode_auth_token(auth_token) == 1)

    def test_save_black_token(self):
        auth_token = User.encode_auth_token(self.user.id)
        response_object, response_status = save_token(auth_token)

        self.assertEqual('success', response_object['status'])
        self.assertEqual(http.HTTPStatus.OK, response_status)


if __name__ == '__main__':
    unittest.main()
