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
# Copy server folder
COPY server ./server
# Copy shared folder (if it exists at root level)
COPY shared ./shared
# Copy any other necessary files
COPY server.js ./

# Final stage
FROM node:18-alpine

WORKDIR /app

# Copy built frontend
COPY --from=frontend-builder /app/client/dist ./client/dist

# Copy backend
COPY --from=backend-builder /app ./

# Create uploads directory
RUN mkdir -p /app/uploads

# Verification
RUN ls -la /app
RUN if [ -d "/app/shared" ]; then echo "Shared folder found"; ls -la /app/shared; else echo "Shared folder NOT found"; fi
RUN if [ -d "/app/server" ]; then echo "Server folder found"; ls -la /app/server; else echo "Server folder NOT found"; fi

EXPOSE 5000
CMD ["node", "server/server.js"]
