import os
import unittest
from dotenv import load_dotenv
from src import create_app

load_dotenv()  # take environment variables from .env.

app = create_app(os.getenv('APP_ENV') or 'development')

app.app_context().push()


@app.cli.command("test")
def test():
    """Runs the unit tests."""
    tests = unittest.TestLoader().discover('test', pattern='test*.py')
    result = unittest.TextTestRunner(verbosity=2).run(tests)
    return 0 if result.wasSuccessful() else 0