FROM oven/bun:1.3.11

WORKDIR /app

# Copy workspace configuration
COPY package.json bun.lock* ./
COPY packages/server/package.json ./packages/server/

# Install all dependencies (this will install in workspaces)
RUN bun install

# Copy server source code
COPY packages/server ./packages/server

# Set working directory to server
WORKDIR /app/packages/server

# Expose port
EXPOSE 10000

# Start the server
CMD ["bun", "run", "index.ts"]
