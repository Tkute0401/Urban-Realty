# Stage 1: Build the frontend (client)
FROM node:18-alpine AS client-builder

WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client .
# Explicitly set the output directory
RUN npm run build -- --outDir=dist

# Stage 2: Build the backend (server)
FROM node:18-alpine AS server-builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 3: Final lightweight image
FROM node:18-alpine

WORKDIR /app
# Copy built client files (verify this path matches your build output)
COPY --from=client-builder /app/client/dist ./client/dist
# Copy server files (excluding client)
COPY --from=server-builder /app .
# Prune dev dependencies
RUN npm prune --production

EXPOSE 3000
CMD ["npm", "start"]