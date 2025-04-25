# Compilation stage with specific version of Node.js
FROM node:22.11-alpine AS builder

WORKDIR /app

# Copy only the files needed to install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code
COPY tsconfig.json ./
COPY src/ ./src/

# Compiling TypeScript to JavaScript
RUN npm run build

# Execution stage with specific version of Node.js
FROM node:22.11-alpine AS production

# Set non-root user from the beginning
USER node
WORKDIR /app

# Copy package configuration files with the right owner
COPY --chown=node:node package*.json ./

# Install production dependencies first (cache enhancement)
RUN npm ci --omit=dev

# Then copy the compiled and static files
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node public/ ./public/

# Expose the port for the web application
EXPOSE 3000

# Setting environment variables
ENV NODE_ENV=production

# Launch the application
CMD ["node", "dist/index.js"]
