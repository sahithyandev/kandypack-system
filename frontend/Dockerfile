# frontend/Dockerfile
FROM oven/bun:1.2
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
# RUN bun install
RUN BUN_INSTALL_SKIP_INTEGRITY=1 bun install


# Copy app code
COPY . .

# Expose frontend port
EXPOSE 3000

# Start Next.js
CMD ["bun", "dev"]
