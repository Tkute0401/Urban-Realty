# Railway Deployment Guide

This guide specifically addresses Railway hosting deployment and the "Frontend assets not found" issue.

## 🚨 Railway Deployment Issues

### Common Problems
1. **Frontend assets not found** - Build files missing in production
2. **Build failures** - Docker build process failing
3. **Health check failures** - Server not responding properly
4. **Environment variables** - Missing configuration

## 🚀 Railway Deployment Setup

### 1. Railway Configuration

Your `Railway.toml` is configured for:
- **Builder**: Docker
- **Start Command**: `node server/server.js`
- **Health Check**: `/api/v1/health`
- **Timeout**: 300 seconds
- **Restart Policy**: On failure with 3 retries

### 2. Environment Variables

Set these in your Railway dashboard:

**Required:**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

**Optional (for frontend):**
```env
VITE_API_BASE_URL=https://your-railway-app.railway.app
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 3. Build Process

The Dockerfile handles:
- ✅ Installing all dependencies
- ✅ Extracting frontend from `dist.zip` or building from source
- ✅ Creating necessary directories
- ✅ Verifying frontend build
- ✅ Starting the server

## 🔧 Troubleshooting Railway Deployment

### Issue 1: Frontend Assets Not Found

**Symptoms:**
```json
{
  "success": false,
  "error": "Frontend assets not found",
  "path": "/client/dist/index.html"
}
```

**Solutions:**

#### Option A: Check Build Logs
1. Go to Railway dashboard
2. Check deployment logs
3. Look for build errors in the Docker build process

#### Option B: Force Rebuild
1. In Railway dashboard, trigger a new deployment
2. The Dockerfile will extract `dist.zip` or build fresh

#### Option C: Manual Fix
If the issue persists, the build script will:
1. Extract `client/dist.zip` if it exists
2. Build frontend from source if zip doesn't exist
3. Verify the build was successful

### Issue 2: Build Failures

**Common Causes:**
- Missing dependencies
- Node.js version mismatch
- Memory issues during build

**Solutions:**
1. Check Railway logs for specific error messages
2. Ensure all dependencies are in `package.json`
3. The Dockerfile uses Node.js 18 for consistency

### Issue 3: Health Check Failures

**Symptoms:**
- Railway shows deployment as failed
- Health check endpoint not responding

**Solutions:**
1. Check if server is starting properly
2. Verify environment variables are set
3. Check database connectivity

## 📋 Railway Deployment Checklist

### Before Deployment
- [ ] All environment variables set in Railway dashboard
- [ ] MongoDB connection string is valid
- [ ] `client/dist.zip` exists (or source code is ready to build)
- [ ] All dependencies are in `package.json`

### During Deployment
- [ ] Monitor Railway build logs
- [ ] Check for any build errors
- [ ] Verify frontend build completion
- [ ] Confirm server startup

### After Deployment
- [ ] Test health check endpoint: `https://your-app.railway.app/api/v1/health`
- [ ] Test main application: `https://your-app.railway.app/`
- [ ] Verify API endpoints are working
- [ ] Check frontend is loading properly

## 🔍 Monitoring Your Railway App

### Health Check Endpoints
- `GET /api/v1/health` - Basic health status
- `GET /api/v1/test` - API functionality test

### Railway Dashboard
- Monitor deployment status
- Check logs for errors
- View resource usage
- Set up alerts

### Logs to Watch For
```
✅ Frontend build verified successfully
✅ Railway build process completed successfully!
Server running in production mode on port 5000
Serving static files from: /app/client/dist
```

## 🚀 Quick Railway Deployment

### Step 1: Connect Repository
1. Connect your GitHub repository to Railway
2. Railway will automatically detect the Dockerfile

### Step 2: Set Environment Variables
1. Go to Railway dashboard
2. Add all required environment variables
3. Save changes

### Step 3: Deploy
1. Railway will automatically build and deploy
2. Monitor the build logs
3. Wait for deployment to complete

### Step 4: Verify
1. Test your application URL
2. Check health endpoints
3. Verify frontend is loading

## 🔧 Advanced Railway Configuration

### Custom Domain
1. Add custom domain in Railway dashboard
2. Update DNS settings
3. Update environment variables if needed

### Environment-Specific Deployments
1. Create different environments (staging, production)
2. Set environment-specific variables
3. Use Railway's environment management

### Scaling
1. Adjust resources in Railway dashboard
2. Monitor performance
3. Scale based on usage

## 📞 Support

If you're still experiencing issues:

1. **Check Railway Logs**: Look for specific error messages
2. **Verify Environment Variables**: Ensure all required variables are set
3. **Test Locally**: Try the build process locally first
4. **Railway Support**: Contact Railway support if needed

## 🔄 Update Process

To update your Railway deployment:

1. Push changes to your main branch
2. Railway will automatically redeploy
3. Monitor the deployment process
4. Verify the update was successful

The updated configuration should resolve the Railway deployment issues and ensure your application runs properly in production.