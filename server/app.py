"""Flask CLI/Application entry point."""

import os
import unittest
import click

from dotenv import load_dotenv
from src.chat import create_app, db
from src.chat.model import user, token_blacklist

load_dotenv()  # take environment variables from .env.

app = create_app(os.getenv('APP_ENV') or 'development')


@app.shell_context_processor
def shell():
    return {
        "db": db,
        "User": user.User,
        "BlacklistedToken": token_blacklist.BlacklistedToken,
    }


@app.cli.command('test')
def test():
    """Runs the unit tests."""
    tests = unittest.TestLoader().discover('test', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    return 0 if result.wasSuccessful() else 1


@app.cli.command('seed')
@click.option('--n', type=int, default=100)
def seed(n):
    """Fake data."""
    from faker import Faker
    from src.chat import db
    fake = Faker('fr-FR')

    # Remove all older data
    db.session.remove()
    db.drop_all()

    # Create database
    db.create_all()
    db.session.commit()

    # Fake data
    Faker.seed(n + 10)
    for _ in range(n):
        fake_user = user.User(
            email=fake.unique.email(),
            username=fake.unique.domain_word(),
            password='123456',
            first_name=fake.first_name(),
            last_name=fake.last_name(),
        )
        db.session.add(fake_user)
    db.session.commit()
