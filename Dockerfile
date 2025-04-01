# Stage 1: Frontend build
FROM node:18-alpine AS frontend-builder

WORKDIR /app/client
COPY client/package*.json client/.yarnrc* ./
RUN yarn cache clean && \
    yarn install
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
COPY server .

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
RUN ls -la /app/client/dist

EXPOSE 5000
CMD ["node", "server.js"]