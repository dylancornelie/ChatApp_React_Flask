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

# Notification
## SSE - Client
### Registered
````js
const sse = new EventSource('/api/v1/users/stream');

sse.addEventListener('greeting', (event)=>{
          console.log(JSON.parse(event.data))
})
````
### Notify
````js
axios.post('/api/v1/users/stream');
````