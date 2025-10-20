# CI/CD Pipeline Guide

Complete guide for the Kandypack system's Continuous Integration and Continuous Deployment pipeline.

## 📋 Overview

The CI/CD pipeline automatically builds, tests, and deploys your application when code is pushed to the repository.

### Pipeline Flow

```
Code Push/PR
    ↓
┌───────────────────────────────────────┐
│  Stage 1: Code Quality & Linting     │
│  - Biome lint check                  │
│  - Format verification                │
└───────────────────────────────────────┘
    ↓
┌───────────────────────────────────────┐
│  Stage 2: Build Backend               │
│  - Install dependencies               │
│  - Type checking                      │
│  - Docker image build                 │
└───────────────────────────────────────┘
    ↓
┌───────────────────────────────────────┐
│  Stage 3: Build Frontend              │
│  - Install dependencies               │
│  - Type checking                      │
│  - Next.js production build           │
│  - Docker image build                 │
└───────────────────────────────────────┘
    ↓
┌───────────────────────────────────────┐
│  Stage 4: Database Validation         │
│  - Start PostgreSQL container         │
│  - Run init scripts                   │
│  - Verify schema & data               │
└───────────────────────────────────────┘
    ↓
┌───────────────────────────────────────┐
│  Stage 5: Integration Tests           │
│  - Run test suites                    │
│  - API endpoint tests                 │
└───────────────────────────────────────┘
    ↓
┌───────────────────────────────────────┐
│  Stage 6: Deploy to VPS               │
│  (Only on main/Deploy-Workflow)       │
│  - SSH to VPS                         │
│  - Pull latest code                   │
│  - Build & start containers           │
│  - Health checks                      │
└───────────────────────────────────────┘
```

## 🚀 Workflows

### 1. Main CI/CD Pipeline (`ci-cd.yml`)

**Triggers**:
- Push to `main`, `Deploy-Workflow`, or `develop` branches
- Pull requests to `main`
- Manual workflow dispatch

**Jobs**:

#### Job 1: Code Quality & Linting
- Runs Biome linting
- Checks code formatting
- Continues even if warnings found

#### Job 2: Build Backend
- Installs Bun dependencies
- Type checking
- Builds Docker image
- Validates image

#### Job 3: Build Frontend
- Installs Bun dependencies
- Type checking
- Builds Next.js app
- Builds Docker image
- Validates image

#### Job 4: Database Validation
- Spins up PostgreSQL container
- Runs all init scripts
- Verifies tables and data
- Tests database connections

#### Job 5: Integration Tests
- Placeholder for your tests
- Add your test commands here

#### Job 6: Deploy to VPS
- **Only runs on**: `main` and `Deploy-Workflow` branches
- **Only if**: All previous jobs pass
- Deploys to production VPS
- Performs health checks
- Shows deployment summary

### 2. Standalone Deploy Workflow (`deploy-vps.yml`)

**Triggers**:
- Push to `main` or `Deploy-Workflow`
- Manual workflow dispatch

**Use case**: Quick deployment without full CI checks

## 🔧 Local Development Commands

```bash
# Install dependencies
bun install

# Linting
bun run lint              # Check for issues
bun run lint:fix          # Auto-fix issues

# Formatting
bun run format            # Format all files
bun run format:check      # Check formatting only

# Full check (lint + format)
bun run check             # Check everything
bun run check:fix         # Fix everything

# Development
bun run dev               # Start all services with Docker
bun run dev:backend       # Backend only
bun run dev:frontend      # Frontend only

# Building
bun run build:backend     # Build backend
bun run build:frontend    # Build frontend

# Docker commands
bun run docker:up         # Start development containers
bun run docker:down       # Stop containers
bun run docker:prod       # Start production containers
bun run docker:prod:build # Build and start production
```

## 📝 Adding Tests

### Backend Tests

Create `backend/test/` directory:

```bash
mkdir -p backend/test
```

Add to `backend/package.json`:
```json
{
  "scripts": {
    "test": "bun test",
    "test:watch": "bun test --watch"
  }
}
```

Example test file `backend/test/auth.test.ts`:
```typescript
import { describe, test, expect } from "bun:test";
import { app } from "../src/index";

describe("Auth API", () => {
  test("POST /auth/sign-in should return token", async () => {
    const response = await app.handle(
      new Request("http://localhost/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "testuser",
          password: "password123",
        }),
      })
    );
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.token).toBeDefined();
  });
});
```

### Frontend Tests

Add to `frontend/package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.4",
    "jest": "^29.7.0"
  }
}
```

### Update CI/CD to Run Tests

Edit `.github/workflows/ci-cd.yml`, replace the test job:

```yaml
test:
  name: Integration Tests
  runs-on: ubuntu-latest
  needs: [build-backend, build-frontend]
  
  steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Bun
      uses: oven-sh/setup-bun@v1

    - name: Install dependencies
      run: bun install

    - name: Run backend tests
      working-directory: ./backend
      run: bun test

    - name: Run frontend tests
      working-directory: ./frontend
      run: bun test
```

## 🔒 Required GitHub Secrets

All secrets must be set in **Repository Settings → Secrets and variables → Actions**:

| Secret | Description | Required For |
|--------|-------------|--------------|
| `SSH_KEY` | Private SSH key for VPS | Deployment |
| `HOST` | VPS IP or domain | Deployment |
| `USER` | SSH username | Deployment |
| `DEPLOY_PATH` | Deploy directory on VPS | Deployment |
| `ENV_FILE` | Production environment variables | Deployment |

See [SECRETS_SETUP.md](./SECRETS_SETUP.md) for detailed instructions.

## 🎯 Branch Strategy

### `main` branch
- Production-ready code
- Triggers full CI/CD + deployment
- Protected branch (require PR reviews)

### `Deploy-Workflow` branch
- Testing deployment workflows
- Triggers full CI/CD + deployment
- For deployment testing

### `develop` branch
- Development branch
- Triggers CI checks only (no deployment)
- Merge to `main` via PR

### Feature branches
- Create from `develop`
- PR triggers CI checks
- Merge to `develop` after review

## 📊 Pipeline Status Badges

Add to your `README.md`:

```markdown
[![CI/CD Pipeline](https://github.com/YOUR_USERNAME/kandypack-system/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/YOUR_USERNAME/kandypack-system/actions/workflows/ci-cd.yml)
```

## 🐛 Troubleshooting

### Pipeline fails at "Code Quality & Linting"

```bash
# Run locally to see issues
bun run check

# Auto-fix most issues
bun run check:fix

# Commit fixes
git add .
git commit -m "fix: code quality issues"
git push
```

### Pipeline fails at "Build Backend/Frontend"

```bash
# Test build locally
cd backend && bun install && bun run build
cd frontend && bun install && bun run build

# Check for missing dependencies
bun install
```

### Pipeline fails at "Database Validation"

```bash
# Test database locally with Docker
docker run -d \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=kandypack \
  -v ./db/init-scripts:/docker-entrypoint-initdb.d \
  -p 5432:5432 \
  postgres:17

# Check logs
docker logs <container_id>
```

### Deployment fails

```bash
# Check GitHub Actions logs first
# Then SSH into VPS
ssh your-user@your-vps-ip

# Check container status
cd ~/kandypack-system
docker compose -f docker-compose.prod.yml ps

# Check logs
docker compose -f docker-compose.prod.yml logs

# Manual deployment
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
```

### Health check fails

```bash
# Test backend health endpoint
curl http://your-vps-ip:2000/health

# Check if backend is running
ssh your-user@your-vps-ip
docker compose -f docker-compose.prod.yml logs backend

# Restart backend
docker compose -f docker-compose.prod.yml restart backend
```

## 🔄 Skip Deployment

To push code without triggering deployment:

**Option 1**: Push to a feature branch
```bash
git checkout -b feature/my-feature
git push origin feature/my-feature
```

**Option 2**: Add `[skip ci]` to commit message
```bash
git commit -m "docs: update README [skip ci]"
git push
```

## 📈 Monitoring

### View Pipeline Status
- Go to **Actions** tab in GitHub
- Click on workflow run
- Expand jobs to see details

### Deployment Logs
```bash
# SSH to VPS
ssh your-user@your-vps-ip

# View all logs
cd ~/kandypack-system
docker compose -f docker-compose.prod.yml logs -f

# View specific service
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
```

### System Health
```bash
# Check running containers
docker compose -f docker-compose.prod.yml ps

# Check resource usage
docker stats

# Check disk space
df -h
```

## 🚀 Advanced Configuration

### Add Code Coverage

Install coverage tools:
```bash
bun add -d @coverage-tool
```

Update CI:
```yaml
- name: Generate coverage report
  run: bun test --coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

### Add Slack Notifications

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Add Performance Testing

```yaml
- name: Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
  with:
    urls: |
      http://${{ secrets.HOST }}:3000
```

## 📚 Best Practices

1. **Always run tests locally** before pushing
2. **Use feature branches** for development
3. **Require PR reviews** for main branch
4. **Keep secrets secure** - never commit them
5. **Monitor pipeline failures** and fix quickly
6. **Update dependencies** regularly
7. **Document** any pipeline changes
8. **Test deployment** on staging first

## 🆘 Getting Help

1. Check GitHub Actions logs
2. Review this documentation
3. Check VPS logs via SSH
4. Test locally with Docker
5. Verify all secrets are set correctly
