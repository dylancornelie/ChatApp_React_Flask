from flask import Flask
from dotenv import load_dotenv

app = Flask(__name__)


load_dotenv()  # take environment variables from .env.

if __name__ == '__main__':
    app.run()
