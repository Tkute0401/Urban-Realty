# Stage 1: Frontend build
FROM node:18-alpine AS frontend-builder

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
COPY ./package*.json ./
RUN npm install
COPY server .

# Final stage
FROM node:18-alpine

WORKDIR /app

# Copy built frontend to /app/client/dist
COPY --from=frontend-builder /app/client/dist ./client/dist

# Copy backend
COPY --from=backend-builder /app/node_modules ./node_modules
COPY --from=backend-builder /app ./

# Create directories
RUN mkdir -p /app/uploads

# Add verification step before CMD
RUN ls -la /app/client/dist && \
    echo "Frontend files:" && \
    ls -la /app/client/dist

# Verify file locations
RUN ls -la /app/client/dist && \
    ls -la /app

EXPOSE 5000
CMD ["node", "server.js"]