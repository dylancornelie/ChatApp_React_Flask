"""Class definition for Message model."""
from base64 import b64decode, b64encode
from os import path
from pathlib import Path
from uuid import uuid4

from flask import current_app
from sqlalchemy.sql import func
from werkzeug.utils import secure_filename

from src.chat import db


class Message(db.Model):
    """ Project Model for storing project related details """
    __tablename__ = 'message'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    content = db.Column(db.String)
    _file_name = db.Column(db.String)
    _file_head = db.Column(db.String)

    _registered_on = db.Column(db.DateTime, default=func.now())

    sender_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    sender = db.relationship('User', backref=db.backref('sender_message', lazy='dynamic'), foreign_keys=[sender_id])

    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    receiver = db.relationship('User', backref=db.backref('receiver_message', lazy='dynamic'),
                               foreign_keys=[receiver_id])

    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    project = db.relationship('Project', backref=db.backref('message_project', lazy='dynamic', cascade="all, delete-orphan"))

    @property
    def created_at(self):
        raise AttributeError('create_at: read-only field')

    @created_at.getter
    def created_at(self):
        return self._registered_on.strftime('%m/%d/%Y, %H:%M')

    @property
    def file_name(self):
        raise AttributeError('file: read-write field')

    @file_name.setter
    def file_name(self, file_name: str):
        self._file_name = uuid4().hex + secure_filename(file_name)

    @file_name.getter
    def file_name(self):
        if not self._file_name:
            return None
        return self._file_name[32:]

    @property
    def file_base64(self):
        raise AttributeError('file: read-write field')

    @file_base64.getter
    def file_base64(self):
        if not self._file_name:
            return None

        tmp_file = open(self._get_file_patch(), 'rb')
        return self._file_head + 'base64,' + b64encode(tmp_file.read()).decode('ascii')

    @file_base64.setter
    def file_base64(self, file_64: str):
        data = file_64.split('base64,')
        self._file_head = data[0]

        self._create_folder_patch()

        with open(self._get_file_patch(), 'wb+') as fh:
            fh.write(b64decode(data[1]))

    def _get_patch(self) -> str:
        return path.join(current_app.config['UPLOAD_FOLDER'], 'projects', f'id_{self.project_id}')

    def _get_file_patch(self) -> str:
        return path.join(self._get_patch(), self._file_name)

    def _create_folder_patch(self):
        path = Path(self._get_patch())
        path.mkdir(parents=True, exist_ok=True)

    def __repr__(self):
        return "<Message '{}'>".format(self.id)
