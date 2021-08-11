"""Class definition for Project model."""
from os import path

from flask import current_app

from src.chat import db

user_participates_of_project = db.Table(
    'user_participates_of_project',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('project_id', db.Integer, db.ForeignKey('project.id'), primary_key=True),
)

user_coaches_to_project = db.Table(
    'user_coaches_to_project',
    db.Column('user_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('project_id', db.Integer, db.ForeignKey('project.id'), primary_key=True),
)


class Project(db.Model):
    """ Project Model for storing project related details """
    __tablename__ = 'project'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), unique=True, nullable=False)

    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    owner = db.relationship('User', backref=db.backref('own_projects', lazy='dynamic'))

    coaches = db.relationship('User',
                              secondary=user_coaches_to_project,
                              backref=db.backref('coach_projects', lazy='dynamic'),
                              lazy='dynamic')

    participants = db.relationship('User',
                                   secondary=user_participates_of_project,
                                   backref=db.backref('participate_projects', lazy='dynamic'),
                                   lazy='dynamic')

    def get_id_members(self):
        return [self.owner_id] + [user.id for user in self.coaches] + [user.id for user in self.participants]

    def get_dir_img(self):
        return path.join(current_app.config['UPLOAD_FOLDER'], 'projects', f'id_{self.id}')

    def __repr__(self):
        return "<Project '{}'>".format(self.title)
