# Multi-stage Docker build for Next.js + Express backend
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install root dependencies
COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile || npm install

# Install Next.js app dependencies
WORKDIR /app/new-nextjs-app
COPY new-nextjs-app/package.json new-nextjs-app/package-lock.json* ./
RUN npm install --frozen-lockfile --only=production || npm install --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy root dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json* ./

# Copy Next.js app dependencies
COPY --from=deps /app/new-nextjs-app/node_modules ./new-nextjs-app/node_modules
COPY new-nextjs-app/package.json new-nextjs-app/package-lock.json* ./new-nextjs-app/

# Copy Next.js source code
COPY new-nextjs-app/src ./new-nextjs-app/src
COPY new-nextjs-app/public ./new-nextjs-app/public
COPY new-nextjs-app/next.config.js ./new-nextjs-app/
COPY new-nextjs-app/next-env.d.ts ./new-nextjs-app/
COPY new-nextjs-app/tailwind.config.js ./new-nextjs-app/
COPY new-nextjs-app/postcss.config.cjs ./new-nextjs-app/
COPY new-nextjs-app/tsconfig.json ./new-nextjs-app/
COPY new-nextjs-app/middleware.ts ./new-nextjs-app/
COPY new-nextjs-app/eslint.config.js ./new-nextjs-app/
COPY new-nextjs-app/vitest.config.ts ./new-nextjs-app/
COPY new-nextjs-app/vitest.setup.ts ./new-nextjs-app/
COPY new-nextjs-app/src/setupTests.ts ./new-nextjs-app/src/


# Copy backend files
COPY server ./server
COPY shared ./shared
COPY uploads ./uploads
COPY ecosystem.config.js ./
COPY server.js ./

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
COPY --from=builder /app/new-nextjs-app/.next ./new-nextjs-app/.next
COPY --from=builder /app/new-nextjs-app/next.config.js ./new-nextjs-app/
COPY --from=builder /app/new-nextjs-app/package.json ./new-nextjs-app/

# Copy backend files
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/uploads ./uploads
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./
COPY --from=builder /app/ecosystem.config.js ./
COPY --from=builder /app/server.js ./

# Copy root node_modules for backend dependencies
COPY --from=builder /app/node_modules ./node_modules

# Install PM2 globally for process management
RUN npm install -g pm2

# Create logs directory
RUN mkdir -p /app/logs

# Set correct permissions
RUN chown -R nextjs:nodejs /app
RUN chmod +x /app/server.js
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
