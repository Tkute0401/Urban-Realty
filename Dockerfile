# Stage 1: Next.js Frontend build
FROM node:20-alpine AS nextjs-builder

WORKDIR /app/new-nextjs-app
COPY new-nextjs-app/package*.json ./

# Set npm cache and install with optimizations
RUN npm config set cache /tmp/npm-cache --global && \
    npm config set registry https://registry.npmjs.org/ --global && \
    npm ci --no-audit --no-fund

COPY new-nextjs-app .
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY \
    NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    DISABLE_ESLINT_PLUGIN=true

RUN npm run build

# Stage 2: Backend build
FROM node:20-alpine AS backend-builder

WORKDIR /app
COPY package*.json ./

# Install with optimizations
RUN npm config set cache /tmp/npm-cache --global && \
    npm config set registry https://registry.npmjs.org/ --global && \
    npm ci --omit=dev --no-audit --no-fund

# Copy everything to preserve the exact folder structure
COPY . .
# Remove client and new-nextjs-app folders to avoid conflicts (we'll copy the built Next.js version later)
RUN rm -rf client new-nextjs-app

# Final stage - Multi-app container
FROM node:20-alpine

WORKDIR /app

# Install system dependencies for better performance
RUN apk add --no-cache dumb-init tzdata

# Copy built Next.js app
COPY --from=nextjs-builder /app/new-nextjs-app/.next/standalone ./nextjs/
COPY --from=nextjs-builder /app/new-nextjs-app/.next/static ./nextjs/.next/static
COPY --from=nextjs-builder /app/new-nextjs-app/public ./nextjs/public

# Copy backend with complete project structure
COPY --from=backend-builder /app ./

# Create necessary directories
RUN mkdir -p /app/uploads /app/logs && \
    chown -R node:node /app && \
    chmod -R 755 /app

# Install PM2 for process management with optimizations
RUN npm install pm2@latest -g --no-audit --no-fund && \
    pm2 install pm2-server-monit

# Copy PM2 ecosystem configuration
COPY ecosystem.config.js ./

# Switch to non-root user for security
USER node

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node healthcheck.js || exit 1

EXPOSE 3000 5000

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
