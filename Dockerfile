# Stage 1: Next.js Frontend build
FROM node:20-alpine AS nextjs-builder

WORKDIR /app/new-nextjs-app

# Install system dependencies for better performance
RUN apk add --no-cache libc6-compat

COPY new-nextjs-app/package*.json ./

# Set npm cache and install with optimizations
RUN npm config set cache /tmp/npm-cache --global && \
    npm config set registry https://registry.npmjs.org/ --global && \
    npm config set fetch-retries 3 --global && \
    npm config set fetch-retry-mintimeout 10000 --global && \
    npm config set fetch-retry-maxtimeout 60000 --global && \
    npm ci --only=production --no-audit --no-fund --silent

COPY new-nextjs-app .

# Build arguments and environment variables for optimal performance
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY \
    NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    DISABLE_ESLINT_PLUGIN=true \
    NODE_OPTIONS="--max-old-space-size=4096" \
    SKIP_ENV_VALIDATION=true

# Build with optimizations
RUN npm run build

# Stage 2: Backend build
FROM node:20-alpine AS backend-builder

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache libc6-compat git

COPY package*.json ./

# Install with optimizations and prevent husky from running
ENV NODE_ENV=production \
    CI=true \
    HUSKY=0

RUN npm config set cache /tmp/npm-cache --global && \
    npm config set registry https://registry.npmjs.org/ --global && \
    npm config set fetch-retries 3 --global && \
    npm config set fetch-retry-mintimeout 10000 --global && \
    npm config set fetch-retry-maxtimeout 60000 --global && \
    npm ci --omit=dev --no-audit --no-fund --silent

# Copy everything to preserve the exact folder structure
COPY . .
# Remove client and new-nextjs-app folders to avoid conflicts (we'll copy the built Next.js version later)
RUN rm -rf client new-nextjs-app .git .husky

# Final stage - Multi-app container
FROM node:20-alpine

WORKDIR /app

# Install system dependencies for better performance
RUN apk add --no-cache dumb-init tzdata libc6-compat curl && \
    addgroup -g 1001 -S nodejs && \
    adduser -S squarefooot -u 1001

# Copy built Next.js app with proper permissions
COPY --from=nextjs-builder --chown=squarefooot:nodejs /app/new-nextjs-app/.next/standalone ./nextjs/
COPY --from=nextjs-builder --chown=squarefooot:nodejs /app/new-nextjs-app/.next/static ./nextjs/.next/static
COPY --from=nextjs-builder --chown=squarefooot:nodejs /app/new-nextjs-app/public ./nextjs/public

# Copy backend with complete project structure
COPY --from=backend-builder --chown=squarefooot:nodejs /app ./

# Set production environment variables for optimal performance
ENV NODE_ENV=production \
    PORT=3000 \
    API_PORT=5000 \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_OPTIONS="--max-old-space-size=512 --enable-source-maps=false" \
    PM2_PUBLIC_KEY="" \
    PM2_SECRET_KEY="" \
    PM2_MACHINE_NAME="squarefooot-production"

# Create necessary directories with proper permissions
RUN mkdir -p /app/uploads /app/logs /app/tmp && \
    chown -R squarefooot:nodejs /app && \
    chmod -R 755 /app

# Install PM2 for process management with optimizations
RUN npm install pm2@latest -g --no-audit --no-fund --silent && \
    pm2 install pm2-server-monit

# Copy PM2 ecosystem configuration
COPY --chown=squarefooot:nodejs ecosystem.config.js ./

# Switch to non-root user for security
USER squarefooot

# Health check with faster intervals for Railway
HEALTHCHECK --interval=15s --timeout=5s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:${API_PORT:-5000}/api/v1/health || exit 1

EXPOSE 3000 5000

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
