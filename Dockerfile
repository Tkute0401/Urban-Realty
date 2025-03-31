# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /frontend
COPY client/package.json client/package-lock.json ./
RUN npm install
COPY client .
RUN npm run build

# Stage 2: Build backend
FROM node:18-alpine AS backend-builder

WORKDIR /backend
COPY server/package.json server/package-lock.json ./
RUN npm install
COPY server .

# Stage 3: Runtime image
FROM node:18-alpine

WORKDIR /app

# Copy built frontend
COPY --from=frontend-builder /frontend/dist ./client/dist

# Copy backend
COPY --from=backend-builder /backend ./server
COPY --from=backend-builder /backend/node_modules ./server/node_modules

# Create uploads directory
RUN mkdir -p /app/server/uploads

# Environment variables will be passed at runtime
EXPOSE 5000
CMD ["node", "server/server.js"]