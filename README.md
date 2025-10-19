# SCDS for Kandypack

A group project for the Database Systems module.

## Project structure

The project is organized into the following main directories:

- **backend/**: Contains the backend code, including API endpoints, database utilities, and business logic. Built with TypeScript.
  - `src/`: Source code for the backend.
    - `modules/`: Contains feature-specific modules (e.g., `auth` for authentication).
    - `utils/`: Utility functions and database connection logic.
  - `Dockerfile`: Docker configuration for the backend service.
  - `package.json`: Dependencies and scripts for the backend.

- **frontend/**: Contains the frontend code, built with Next.js and TypeScript.
  - `app/`: Application pages and layouts.
  - `components/`: Reusable UI components.
  - `Dockerfile`: Docker configuration for the frontend service.
  - `package.json`: Dependencies and scripts for the frontend.

- **db/**: Contains database-related files.
  - `init-scripts/`: SQL scripts for initializing the database schema and data.

- **backend-tests/**: Contains HTTP tests for backend endpoints. Use these files instead of using Postman.

- **docker-compose.yml**: Defines the services for the project, including frontend, backend, and database.

- **.env.example**: Example environment variables file for configuration.

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

**NOTE**: Every time any changes are made to the `package.json` file, the system has to be stopped and restarted. Use the commands below to do so:
```sh
# Stop and remove the docker containers
docker compose down

# Create and run the docker containers
docker compose up --build --watch
```

If you have made changes to the `db/init-scripts`, you have to clear the database and re-run the system.
```sh
# This command will stop the containers and clear the database 
docker compose down -v

# Create and run the docker containers
docker compose up --build --watch
```



We are using orval to generate the API client automatically from the backend code. Use `bun run generate:api` from the frontend to do so.

## CI/CD Pipeline

This project includes a comprehensive CI/CD pipeline that automatically builds, tests, and deploys the application.

### Pipeline Overview

The pipeline runs automatically on:
- Push to `main`, `Deploy-Workflow`, or `develop` branches
- Pull requests to `main`
- Manual workflow dispatch

### Pipeline Stages

1. **Code Quality & Linting** - Biome linting and formatting checks
2. **Build Backend** - TypeScript type checking and Docker image build
3. **Build Frontend** - Next.js build and Docker image creation
4. **Database Validation** - PostgreSQL schema and data verification
5. **Integration Tests** - Automated testing (configurable)
6. **Deploy to VPS** - Automatic deployment to production (main/Deploy-Workflow only)

### Local Commands

```bash
# Code quality
bun run lint              # Check for issues
bun run lint:fix          # Auto-fix issues
bun run format            # Format all files
bun run check:fix         # Fix everything

# Development
bun run dev               # Start all services
bun run dev:backend       # Backend only
bun run dev:frontend      # Frontend only

# Building
bun run build:backend     # Build backend
bun run build:frontend    # Build frontend

# Docker
bun run docker:prod       # Run production build
```

### Deployment

The application automatically deploys to VPS when code is pushed to `main` or `Deploy-Workflow` branches.

**Prerequisites**:
- VPS with Docker installed
- GitHub Secrets configured

**Required Secrets**:
- `SSH_KEY` - Private SSH key for VPS
- `HOST` - VPS IP address
- `USER` - SSH username
- `DEPLOY_PATH` - Deployment directory
- `ENV_FILE` - Production environment variables

For detailed deployment instructions, see:
- [CI/CD Guide](.github/CI_CD_GUIDE.md) - Complete CI/CD documentation
- [Deployment Quick Start](.github/DEPLOYMENT_QUICKSTART.md) - 15-minute setup guide
- [Secrets Setup](.github/SECRETS_SETUP.md) - GitHub secrets configuration
- [Deployment Guide](DEPLOYMENT.md) - Full deployment documentation

### Production Access

After deployment, access the application at:
- **Frontend**: `http://YOUR_VPS_IP:3000`
- **Backend API**: `http://YOUR_VPS_IP:2000`
- **API Docs**: `http://YOUR_VPS_IP:2000/swagger`
