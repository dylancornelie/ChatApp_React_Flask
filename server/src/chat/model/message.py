"""Class definition for Message model."""

from sqlalchemy.sql import func

from src.chat import db


class Message(db.Model):
    """ Project Model for storing project related details """
    __tablename__ = 'message'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    content = db.Column(db.String, nullable=False)
    _registered_on = db.Column(db.DateTime, default=func.now())

    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    owner = db.relationship('User', backref=db.backref('own_message', lazy='dynamic'), foreign_keys=[owner_id])

    receiver_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    receiver = db.relationship('User', backref=db.backref('receiver_message', lazy='dynamic'), foreign_keys=[receiver_id])

    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    project = db.relationship('Project', backref=db.backref('message_project', lazy='dynamic'))

    @property
    def created_at(self):
        raise AttributeError('create_at: read-only field')

    @created_at.getter
    def created_at(self):
        return self._registered_on.strftime('%m/%d/%Y, %H:%M')

    def __repr__(self):
        return "<Message '{}'>".format(self.id)
