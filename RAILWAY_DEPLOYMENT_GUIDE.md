# Railway Deployment Guide - Next.js + Express Setup

## 📋 Overview

This deployment guide covers deploying the Urban Realty application with:
- **Frontend**: Next.js app (port 3000)
- **Backend**: Express.js API server (port 5000)
- **Database**: MongoDB
- **Process Manager**: PM2

## 🚀 Railway Deployment Steps

### 1. Environment Variables Setup

Set these environment variables in Railway:

```bash
# Server Configuration
NODE_ENV=production
PORT=5000

# Next.js Configuration
NEXT_PUBLIC_API_URL=https://your-railway-domain/api/v1
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_USE_MOCK_DATA=false

# Database Configuration
MONGO_URI=your-mongodb-connection-string

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d

# CORS Configuration
CORS_ORIGIN=https://your-railway-frontend-domain

# Railway Configuration
RAILWAY_ENVIRONMENT=production
NEXTJS_DIR=/app/nextjs
```

### 2. Deployment Configuration

The project uses Docker for deployment with the following setup:

- **Dockerfile**: Multi-stage build for Next.js and Express
- **PM2**: Process manager running both services
- **Railway.toml**: Railway-specific configuration

### 3. Port Configuration

- **Frontend (Next.js)**: Port 3000
- **Backend (Express)**: Port 5000
- **Railway**: Automatically handles port mapping

### 4. Build Process

1. **Next.js Build**: Creates standalone production build
2. **Express Setup**: Copies server files and dependencies
3. **PM2 Configuration**: Sets up process management

### 5. Health Checks

- **API Health**: `GET /api/v1/health`
- **Next.js Health**: `GET /` (homepage)

## 🔧 Manual Deployment Commands

If deploying manually:

```bash
# Install dependencies
npm run install-all

# Build Next.js app
npm run build

# Start in production
npm start
```

## 📊 Service Architecture

```
Internet
    ↓
Railway Load Balancer
    ↓
PM2 Process Manager
    ├── Next.js Frontend (Port 3000)
    └── Express API (Port 5000)
    ↓
MongoDB Database
```

## 🔍 Monitoring

### PM2 Commands (in container)
```bash
# Check process status
pm2 status

# View logs
pm2 logs

# Restart services
pm2 restart all
```

### Logs Location
- Next.js logs: `/app/logs/nextjs-*.log`
- Express logs: `/app/logs/server-*.log`

## 🐛 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Verify environment variables
   - Check npm dependencies

2. **API Connection Issues**
   - Verify NEXT_PUBLIC_API_URL
   - Check CORS_ORIGIN setting
   - Ensure ports are correctly configured

3. **Database Connection**
   - Verify MONGO_URI
   - Check network connectivity
   - Ensure database is accessible

### Debug Commands

```bash
# Check API health
curl https://your-domain/api/v1/health

# Check environment
curl https://your-domain/api/v1/test

# View process status
pm2 status
```

## 📝 Migration from React

This setup replaces the previous React client with Next.js:

- **Before**: React (Vite) + Express
- **After**: Next.js + Express
- **Benefits**: SSR, better SEO, improved performance

## 🔄 Rollback Plan

To rollback to React client:
1. Update Dockerfile to use `client/` instead of `new-nextjs-app/`
2. Revert package.json scripts
3. Update environment variables
4. Redeploy

## 📋 Checklist

- [ ] Environment variables configured
- [ ] MongoDB connection string set
- [ ] Google Maps API key configured
- [ ] Domain configured for CORS
- [ ] Health checks working
- [ ] PM2 processes running
- [ ] Logs accessible