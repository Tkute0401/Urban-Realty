# Stage 1: Frontend build
FROM node:20-alpine AS frontend-builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client .
ARG VITE_API_BASE_URL
ARG VITE_GOOGLE_MAPS_API_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
RUN npm run build

# Stage 2: Backend build
FROM node:18-alpine AS backend-builder

WORKDIR /app
COPY package*.json ./
RUN npm install
# Copy everything to preserve the exact folder structure
COPY . .
# Remove client folder to avoid conflicts (we'll copy the built version later)
RUN rm -rf client

# Final stage
FROM node:18-alpine

WORKDIR /app

# Copy built frontend
COPY --from=frontend-builder /app/client/dist ./client/dist

# Copy backend with complete project structure
COPY --from=backend-builder /app ./

# Create uploads directory
RUN mkdir -p /app/uploads

# Debug: Show the file structure
RUN echo "=== App directory structure ===" && ls -la /app
RUN echo "=== Checking for shared folder ===" && if [ -d "/app/shared" ]; then ls -la /app/shared; else echo "No shared folder"; fi
RUN echo "=== Checking for server folder ===" && if [ -d "/app/server" ]; then ls -la /app/server; else echo "No server folder"; fi

EXPOSE 5000
CMD ["node", "server/server.js"]
