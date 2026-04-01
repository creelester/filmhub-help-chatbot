FROM oven/bun:1.3.11

WORKDIR /app

# Copy root package files
COPY package.json bun.lockb* ./

# Copy workspace packages
COPY packages/server/package.json ./packages/server/

# Install dependencies
RUN bun install

# Copy server source code
COPY packages/server ./packages/server

# Expose port
EXPOSE 10000

# Start the server
CMD ["bun", "--cwd", "packages/server", "run", "start"]
