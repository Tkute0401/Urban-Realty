# Multi-stage Docker build for Next.js + Express backend
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install root dependencies
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Install Next.js app dependencies
WORKDIR /app/new-nextjs-app
COPY new-nextjs-app/package.json new-nextjs-app/package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy root dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json* ./

# Copy Next.js app dependencies
COPY --from=deps /app/new-nextjs-app/node_modules ./new-nextjs-app/node_modules
COPY new-nextjs-app/package.json new-nextjs-app/package-lock.json* ./new-nextjs-app/

# Copy all source code
COPY . .

# Build the Next.js application
WORKDIR /app/new-nextjs-app
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built Next.js application
COPY --from=builder /app/new-nextjs-app/public ./new-nextjs-app/public
COPY --from=builder /app/new-nextjs-app/.next/standalone ./
COPY --from=builder /app/new-nextjs-app/.next/static ./new-nextjs-app/.next/static

# Copy backend files
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/uploads ./uploads
COPY --from=builder /app/package.json ./
COPY --from=builder /app/ecosystem.config.js ./

# Install PM2 globally for process management
RUN npm install -g pm2

# Create logs directory
RUN mkdir -p /app/logs

# Set correct permissions
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
