# GitHub Actions Workflows

This directory contains automated workflows for CI/CD.

## Available Workflows

### 1. `ci-cd.yml` - Full CI/CD Pipeline ⭐ **Recommended**

**Purpose**: Complete continuous integration and deployment with quality checks

**Triggers**:
- Push to `main`, `Deploy-Workflow`, or `develop`
- Pull requests to `main`
- Manual dispatch

**What it does**:
1. ✅ Code quality checks (Biome lint & format)
2. ✅ Build backend (TypeScript + Docker)
3. ✅ Build frontend (Next.js + Docker)
4. ✅ Validate database schema
5. ✅ Run tests
6. ✅ Deploy to VPS (only on `main`/`Deploy-Workflow`)
7. ✅ Health checks

**When to use**: 
- ✅ Production deployments
- ✅ Feature branches (CI checks only)
- ✅ Pull requests

**Duration**: ~15-20 minutes (full pipeline with deployment)

---

### 2. `deploy-vps.yml` - Quick Deployment Only

**Purpose**: Fast deployment without CI checks

**Triggers**:
- Push to `main` or `Deploy-Workflow`
- Manual dispatch

**What it does**:
1. SSH to VPS
2. Pull latest code
3. Build & restart containers
4. Basic verification

**When to use**:
- ⚡ Emergency hotfixes
- ⚡ Quick updates
- ⚡ When you've already tested locally

**Duration**: ~5-7 minutes

⚠️ **Warning**: Skips tests and validation. Use with caution!

---

## Workflow Comparison

| Feature | `ci-cd.yml` | `deploy-vps.yml` |
|---------|-------------|------------------|
| Code quality checks | ✅ Yes | ❌ No |
| Build validation | ✅ Yes | ❌ No |
| Database validation | ✅ Yes | ❌ No |
| Tests | ✅ Yes | ❌ No |
| Deployment | ✅ Yes | ✅ Yes |
| Health checks | ✅ Yes | ❌ Basic only |
| Speed | 🐢 15-20 min | ⚡ 5-7 min |
| Safety | ✅ High | ⚠️ Medium |

## How to Run

### Automatic (on Push)

```bash
# Triggers ci-cd.yml
git push origin main
git push origin Deploy-Workflow
git push origin develop

# Triggers deploy-vps.yml
git push origin main
git push origin Deploy-Workflow
```

### Manual Dispatch

1. Go to **Actions** tab in GitHub
2. Select workflow from left sidebar
3. Click **Run workflow** button
4. Choose branch
5. Click **Run workflow**

## Viewing Results

### In GitHub UI

1. Go to **Actions** tab
2. Click on workflow run
3. Expand each job to see details
4. View logs for debugging

### Using GitHub CLI

```bash
# List recent runs
gh run list

# View specific run
gh run view <run-id>

# View logs
gh run view <run-id> --log

# Watch live
gh run watch <run-id>
```

## Workflow Jobs Explained

### ci-cd.yml Jobs

#### Job 1: `lint` (Code Quality & Linting)
- Installs dependencies
- Runs Biome linting
- Checks code formatting
- **Continues on error** (won't block deployment)

#### Job 2: `build-backend`
- Depends on: `lint`
- Installs Bun dependencies
- Type checks TypeScript
- Builds Docker image
- Tests image validity

#### Job 3: `build-frontend`
- Depends on: `lint`
- Installs Bun dependencies
- Type checks TypeScript
- Builds Next.js for production
- Builds Docker image
- Tests image validity

#### Job 4: `validate-db`
- Starts PostgreSQL container
- Runs all init scripts
- Verifies schema creation
- Checks sample data
- **Fails if**: Database scripts have errors

#### Job 5: `test`
- Depends on: `build-backend`, `build-frontend`
- Runs integration tests
- **Currently**: Placeholder (add your tests)

#### Job 6: `deploy`
- Depends on: All previous jobs
- **Only runs on**: `main` or `Deploy-Workflow` push
- SSHs to VPS
- Pulls/clones latest code
- Builds Docker images
- Starts containers
- Verifies deployment
- Runs health checks

## Configuration

### Branch Protection

Recommended settings for `main` branch:

```yaml
# In GitHub: Settings → Branches → Branch protection rules

✅ Require pull request before merging
✅ Require status checks to pass
   - lint
   - build-backend
   - build-frontend
   - validate-db
   - test
✅ Require conversation resolution
✅ Require linear history
```

### Required Secrets

For deployment jobs to work, configure these secrets in:
**Settings → Secrets and variables → Actions**

| Secret | Description |
|--------|-------------|
| `SSH_KEY` | Private SSH key for VPS access |
| `HOST` | VPS IP address or domain |
| `USER` | SSH username on VPS |
| `DEPLOY_PATH` | Deployment directory path |
| `ENV_FILE` | Production environment variables |

See [SECRETS_SETUP.md](../SECRETS_SETUP.md) for detailed instructions.

## Customization

### Skip CI

Add to commit message to skip workflow:

```bash
git commit -m "docs: update README [skip ci]"
```

### Run Specific Job

Currently not supported. All jobs run in sequence.

### Modify Triggers

Edit workflow file:

```yaml
on:
  push:
    branches: ["main", "your-branch"]
  pull_request:
    branches: ["main"]
```

### Add Environment Variables

```yaml
env:
  NODE_ENV: production
  CUSTOM_VAR: value
```

### Change Job Order

Modify `needs` in job definition:

```yaml
deploy:
  needs: [build-backend, build-frontend, test]
```

## Debugging

### Workflow Fails at Lint

```bash
# Run locally
bun run check

# Fix automatically
bun run check:fix

# Commit and push
git add .
git commit -m "fix: linting"
git push
```

### Workflow Fails at Build

```bash
# Test backend build
cd backend
bun install
bun run build

# Test frontend build
cd frontend
bun install
bun run build

# Test Docker build
docker build -t test ./backend
docker build -t test ./frontend
```

### Workflow Fails at Database

```bash
# Test database scripts
docker run -d \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=kandypack \
  -v ./db/init-scripts:/docker-entrypoint-initdb.d \
  -p 5432:5432 \
  postgres:17

# Check logs
docker logs <container-id>
```

### Workflow Fails at Deploy

1. Check GitHub Actions logs
2. Verify all secrets are set
3. SSH to VPS manually:
   ```bash
   ssh user@vps-ip
   cd ~/kandypack-system
   docker compose -f docker-compose.prod.yml logs
   ```

### Re-run Failed Jobs

1. Go to failed workflow run
2. Click **Re-run failed jobs**
3. Or **Re-run all jobs**

## Best Practices

1. ✅ Always test locally before pushing
2. ✅ Use `ci-cd.yml` for production
3. ✅ Use feature branches for development
4. ✅ Require PR reviews for `main`
5. ✅ Keep secrets secure
6. ✅ Monitor workflow runs
7. ✅ Add tests as you develop
8. ✅ Update dependencies regularly

## Monitoring

### Notifications

Set up notifications in GitHub:
**Settings → Notifications → Actions**

Options:
- ✅ Email on failure
- ✅ Web notifications
- 📱 GitHub mobile app

### Slack Integration

Add to workflow:

```yaml
- name: Notify Slack
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Status Badges

Add to README.md:

```markdown
![CI/CD](https://github.com/username/repo/actions/workflows/ci-cd.yml/badge.svg)
```

## Performance Tips

### Speed up builds

1. **Cache dependencies**:
   ```yaml
   - uses: actions/cache@v3
     with:
       path: ~/.bun/install/cache
       key: ${{ runner.os }}-bun-${{ hashFiles('**/bun.lockb') }}
   ```

2. **Run jobs in parallel**:
   - `build-backend` and `build-frontend` run simultaneously
   - Only dependent jobs wait

3. **Reduce build scope**:
   - Use `--frozen-lockfile` for faster installs
   - Skip unnecessary steps with `if` conditions

## Security

### Protect Secrets

- ✅ Never echo secrets in logs
- ✅ Never commit secrets
- ✅ Rotate secrets regularly
- ✅ Use minimal permissions

### Workflow Permissions

Current settings:

```yaml
permissions:
  contents: read  # Can read repo
  # No write access
```

## Troubleshooting Commands

```bash
# View workflow file syntax
cat .github/workflows/ci-cd.yml

# List all runs
gh run list --workflow=ci-cd.yml

# View specific run details
gh run view <run-id> --log

# Cancel running workflow
gh run cancel <run-id>

# Download artifacts
gh run download <run-id>

# List all workflows
gh workflow list

# Enable/disable workflow
gh workflow enable ci-cd.yml
gh workflow disable ci-cd.yml
```

## Related Documentation

- [CI/CD Guide](../CI_CD_GUIDE.md) - Complete documentation
- [Pipeline Summary](../PIPELINE_SUMMARY.md) - Quick reference
- [Secrets Setup](../SECRETS_SETUP.md) - Configure GitHub secrets
- [Deployment Guide](../../DEPLOYMENT.md) - VPS deployment

---

**Need help?** Check [CI_CD_GUIDE.md](../CI_CD_GUIDE.md) or [PIPELINE_SUMMARY.md](../PIPELINE_SUMMARY.md)
