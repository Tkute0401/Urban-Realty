# Stage 1: Next.js Frontend build
FROM node:18-alpine AS nextjs-builder

WORKDIR /app/new-nextjs-app
COPY new-nextjs-app/package*.json ./
RUN npm install
COPY new-nextjs-app .
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
RUN npm run build

# Stage 2: Backend build
FROM node:18-alpine AS backend-builder

WORKDIR /app
COPY package*.json ./
RUN npm install
# Copy everything to preserve the exact folder structure
COPY . .
# Remove client and new-nextjs-app folders to avoid conflicts (we'll copy the built Next.js version later)
RUN rm -rf client new-nextjs-app

# Final stage - Multi-app container
FROM node:18-alpine

WORKDIR /app

# Copy built Next.js app
COPY --from=nextjs-builder /app/new-nextjs-app/.next/standalone ./nextjs/
COPY --from=nextjs-builder /app/new-nextjs-app/.next/static ./nextjs/.next/static
COPY --from=nextjs-builder /app/new-nextjs-app/public ./nextjs/public

# Copy backend with complete project structure
COPY --from=backend-builder /app ./

# Create uploads directory
RUN mkdir -p /app/uploads

# Install PM2 for process management
RUN npm install pm2 -g

# Copy PM2 ecosystem configuration
COPY ecosystem.config.js ./

# Debug: Show the file structure
RUN echo "=== App directory structure ===" && ls -la /app
RUN echo "=== Checking for shared folder ===" && if [ -d "/app/shared" ]; then ls -la /app/shared; else echo "No shared folder"; fi
RUN echo "=== Checking for server folder ===" && if [ -d "/app/server" ]; then ls -la /app/server; else echo "No server folder"; fi
RUN echo "=== Checking for nextjs folder ===" && if [ -d "/app/nextjs" ]; then ls -la /app/nextjs; else echo "No nextjs folder"; fi

EXPOSE 3000 5000
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
