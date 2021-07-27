"""Flask CLI/Application entry point."""

import os
import unittest
from random import choices, choice, randint

import click
from dotenv import load_dotenv

from src.chat import create_app, db
from src.chat.model import user, token_blacklist, project

load_dotenv()  # take environment variables from .env.

app = create_app(os.getenv('APP_ENV') or 'development')


@app.shell_context_processor
def shell():
    return {
        'db': db,
        'User': user.User,
        'BlacklistedToken': token_blacklist.BlacklistedToken,
        'Project': project.Project,
    }


@app.cli.command('test')
def test():
    """Runs the unit tests."""
    tests = unittest.TestLoader().discover('test', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    return 0 if result.wasSuccessful() else 1


@app.cli.command('seed')
@click.option('--n', type=int, default=25)
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
    Faker.seed(n * 2 + 10)

    # fake for user
    list_fake_user = {'owner': [], 'coach': [], 'participant': []}
    for _ in range(n):
        fake_user = user.User(
            email=fake.unique.email(),
            username=fake.unique.domain_word(),
            password='123456',
            first_name=fake.first_name(),
            last_name=fake.last_name(),
        )
        db.session.add(fake_user)

        random_value = choice(['owner', 'coach', 'participant'])
        list_fake_user[random_value].append(fake_user)

    # fake for project
    for _ in range(n * 2):
        fake_project = project.Project(
            title=fake.unique.name(),
            owner=choice(list_fake_user['owner']),
        )
        db.session.add(fake_project)

        for user_coach in choices(list_fake_user['coach'], k=randint(1, len(list_fake_user['coach']))):
            fake_project.coaches.append(user_coach)
        for user_participant in choices(list_fake_user['participant'],
                                        k=randint(2, len(list_fake_user['participant']))):
            fake_project.participants.append(user_participant)

    db.session.commit()
