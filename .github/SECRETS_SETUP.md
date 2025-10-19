# GitHub Secrets Setup Guide

This document provides step-by-step instructions to configure GitHub secrets for VPS deployment.

## Required Secrets

Navigate to: **Repository Settings → Secrets and variables → Actions → New repository secret**

### 1. GH_PAT

**Purpose**: GitHub Personal Access Token for cloning the repository on VPS

**How to create it**:
1. Go to GitHub: **Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Click **Generate new token (classic)**
3. Give it a name: `Kandypack VPS Deploy`
4. Set expiration: `90 days` or `No expiration` (not recommended)
5. Select scopes:
   - ✅ `repo` (Full control of private repositories)
6. Click **Generate token**
7. **Copy the token immediately** (you won't see it again!)

**Value format**:
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ Keep this token secure! Treat it like a password.

---

### 2. SSH_KEY

**Purpose**: Private SSH key to authenticate with your VPS

**How to get it**:
```bash
# Generate a new SSH key (if you don't have one)
ssh-keygen -t rsa -b 4096 -C "github-actions@kandypack" -f ~/.ssh/kandypack_deploy

# Copy public key to your VPS
ssh-copy-id -i ~/.ssh/kandypack_deploy.pub your-username@your-vps-ip

# Get the private key content
cat ~/.ssh/kandypack_deploy
```

**Value format**:
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAABlwAAAAdzc2gtcn
... (many lines of key data) ...
AAAEC2dpdGh1Yi1hY3Rpb25zQGthbmR5cGFjaw==
-----END OPENSSH PRIVATE KEY-----
```
⚠️ Copy the **entire** key including BEGIN and END lines

---

### 3. HOST

**Purpose**: IP address or domain of your VPS

**Value examples**:
- `203.0.113.42` (IP address)
- `kandypack.example.com` (domain)
- `server.mydomain.org` (subdomain)

---

### 4. USER

**Purpose**: SSH username on your VPS

**Common values**:
- `ubuntu` (for Ubuntu servers)
- `root` (not recommended)
- `admin` (some cloud providers)
- Your custom username

**How to check**:
```bash
# The username you use to SSH
ssh YOUR_USERNAME@your-vps-ip
```

---

### 5. DEPLOY_PATH

**Purpose**: Directory where the application will be deployed on VPS

**Value examples**:
- `/home/ubuntu/kandypack-system`
- `/var/www/kandypack`
- `/opt/kandypack`

**Setup on VPS**:
```bash
ssh your-username@your-vps-ip
mkdir -p /home/ubuntu/kandypack-system
```

---

### 6. ENV_FILE

**Purpose**: Environment variables for production

**Value** (copy this template and replace values):

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=YOUR_SECURE_DB_PASSWORD_HERE
POSTGRES_DB=kandypack
DATABASE_URL=postgresql://postgres:YOUR_SECURE_DB_PASSWORD_HERE@db:5432/kandypack

# Backend Configuration  
JWT_SECRET=YOUR_JWT_SECRET_MINIMUM_32_CHARACTERS_LONG
PORT=2000

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://YOUR_VPS_IP:2000
```

**How to generate secure values**:

```bash
# Generate secure password (32 characters)
openssl rand -base64 32

# Generate JWT secret (64 characters)
openssl rand -base64 64
```

**Important notes**:
- Replace `YOUR_SECURE_DB_PASSWORD_HERE` in both places (must match)
- Replace `YOUR_JWT_SECRET_MINIMUM_32_CHARACTERS_LONG` with generated secret
- Replace `YOUR_VPS_IP` with your actual VPS IP or domain
- Keep passwords secure and never commit to git

---

## Verification Checklist

Before deploying, verify:

- [ ] All 6 secrets are created in GitHub
- [ ] GitHub PAT (GH_PAT) has `repo` scope
- [ ] SSH key is properly formatted (includes BEGIN/END lines)
- [ ] Public key is added to VPS `~/.ssh/authorized_keys`
- [ ] VPS has Docker and Docker Compose installed
- [ ] Deploy directory exists on VPS
- [ ] VPS firewall allows SSH (port 22)
- [ ] Database password matches in both places in ENV_FILE
- [ ] JWT secret is at least 32 characters

## Testing SSH Connection

Before running the workflow, test SSH connection:

```bash
ssh -i ~/.ssh/kandypack_deploy your-username@your-vps-ip "echo 'Connection successful'"
```

If successful, you'll see: `Connection successful`

## Common Issues

### Issue: "Permission denied (publickey)"
**Solution**: Public key not added to VPS
```bash
ssh-copy-id -i ~/.ssh/kandypack_deploy.pub your-username@your-vps-ip
```

### Issue: "Host key verification failed"
**Solution**: Remove old host key
```bash
ssh-keyscan -H your-vps-ip >> ~/.ssh/known_hosts
```

### Issue: Containers won't start
**Solution**: Check environment variables
- Verify DATABASE_URL format
- Ensure passwords match
- Check VPS logs: `docker compose -f docker-compose.prod.yml logs`

## Security Best Practices

1. **Never expose secrets**: Don't print or log secret values
2. **Rotate secrets regularly**: Change passwords every 90 days
3. **Use strong passwords**: Minimum 32 characters, random
4. **Limit SSH access**: Use SSH keys, disable password auth
5. **Enable firewall**: Only allow necessary ports

## Need Help?

1. Check GitHub Actions logs for deployment errors
2. SSH into VPS and check: `docker compose -f docker-compose.prod.yml logs`
3. Verify secrets are correctly formatted (no extra spaces/newlines)
