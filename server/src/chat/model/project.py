"""Class definition for Project model."""

from src.chat import db, flask_bcrypt


class Project(db.Model):
    """ Project Model for storing project related details """
    __tablename__ = "project"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), unique=True, nullable=False)

    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    owner = db.relationship("User", backref=db.backref("projects", lazy='dynamic'))

    def __repr__(self):
        return "<Project '{}'>".format(self.title)
