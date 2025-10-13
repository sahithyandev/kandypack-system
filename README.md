# SCDS for Kandypack

A group project for the Database Systems module.

## Project setup

After the cloning the repository, you have to create the `.env` file at the project root. Use the `.env.example` file as an example.

Docker and Docker Compose are required to run the whole system. All other dependencies are setup using docker.

The system is tested to be working with:
- Docker v28.2.2
- Docker Compose v2.36.2


Even though the system can be run by using Docker and Docker Compose alone, it's recommended to have the below-mentioned tools installed. The developer experience will be better if you do so.

- Bun v1.2 (or higher)

If you do have Bun installed, run `bun install` from both frontend and backend directories. It will enable autocompletition and other intellisense on your IDE.


## Development

The below command runs the whole system in watch mode.

```sh
docker compose up --build --watch
```

Once the system is started, the following urls can be used to access the services.

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:2000](http://localhost:2000)
- Database: Exposed on port **5433**

We are using orval to generate the API client automatically from the backend code. Use `bun run generate:api` from the frontend to do so.  
