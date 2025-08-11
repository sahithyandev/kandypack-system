# SCDS for Kandypack

A group project for the Database Systems project.

## Project setup

Docker and Docker Compose are required to run the whole system. All other dependencies are setup using docker.

The system is tested to be working with:
- Docker v28.2.2
- Docker Compose v2.36.2

## Development

The below command runs the whole system.

```sh
docker compose up --build --watch
```

Once the system is started, the following urls can be used to access the services.

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:2000](http://localhost:2000)
- Database: Exposed on port 5433
