import os
import unittest
from dotenv import load_dotenv
from src.chat import create_app
from src import blueprint_v1
from src.chat.model import user, blacklist

load_dotenv()  # take environment variables from .env.

app = create_app(os.getenv('APP_ENV') or 'development')
app.register_blueprint(blueprint_v1)

app.app_context().push()


@app.cli.command("test")
def test():
    """Runs the unit tests."""
    tests = unittest.TestLoader().discover('test', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    return 0 if result.wasSuccessful() else 0