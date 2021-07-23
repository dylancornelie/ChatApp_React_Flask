# Server

## Install library
`pip install -r requirements.txt`

## Start server
- Set environment:
  - Bask: `export FLASK_ENV=development`
  - CMD: `set FLASK_ENV=development`
  - Powershell: `$env:FLASK_ENV = "development"` 
- Execute: `flask run`
- Initial database: `flask db init`
- Generate an initial migration: `flask db migrate -m "Initial migration."`
- Migration: `flask db upgrade`

# Server email
- Flask-Mailman [here](https://www.waynerv.com/flask-mailman/)