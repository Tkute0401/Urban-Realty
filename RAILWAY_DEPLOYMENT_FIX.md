# Railway Deployment Fix for Urban Realty

## Issue Resolved
The application was failing to respond on Railway due to a complex multi-server architecture that Railway couldn't handle properly.

## Changes Made

### 1. Unified Server Architecture
- **Problem**: The original setup tried to run two separate servers (Express API + Next.js) with PM2, but Railway expects a single application.
- **Solution**: Created a unified `server.js` that combines both Express API and Next.js frontend in a single process.

### 2. Updated Configuration Files

#### `server.js` (NEW)
- Unified server that handles both API routes and serves the Next.js frontend
- Proper error handling for missing environment variables
- Graceful shutdown handling
- Clear error messages for Railway deployment

#### `ecosystem.config.js` (UPDATED)
- Simplified to run only one unified application
- Removed dual-server configuration
- Updated logging paths

#### `Dockerfile` (UPDATED)
- Added `server.js` to the build process
- Removed standalone Next.js output (not needed with unified server)
- Added executable permissions for `server.js`

#### `next.config.js` (UPDATED)
- Removed `output: 'standalone'` since we're using unified server
- Kept other Railway optimizations

#### `package.json` (UPDATED)
- Added `next` dependency to root package.json for unified server

### 3. Environment Variables Required

The following environment variables **MUST** be set in Railway:

#### Required Variables:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure secret key (minimum 32 characters)

#### Optional Variables:
- `EMAIL_FROM`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`: Email configuration
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: Image upload
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`: Payment processing
- `GOOGLE_MAPS_API_KEY`: Maps functionality
- `SENTRY_DSN`: Error tracking

## How to Deploy

1. **Set Environment Variables in Railway**:
   - Go to your Railway project dashboard
   - Navigate to the "Variables" tab
   - Add the required variables listed above

2. **Deploy**:
   - Push these changes to your repository
   - Railway will automatically rebuild and deploy

3. **Verify Deployment**:
   - Check the health endpoint: `https://your-app.railway.app/api/v1/health`
   - The application should now respond properly

## Architecture Overview

```
┌─────────────────────────────────────┐
│           Railway Container          │
│                                     │
│  ┌─────────────────────────────────┐│
│  │        Unified Server.js         ││
│  │                                 ││
│  │  ┌─────────────┐ ┌─────────────┐││
│  │  │ Express API │ │ Next.js App │││
│  │  │             │ │             │││
│  │  │ /api/*      │ │ /* (pages)  │││
│  │  └─────────────┘ └─────────────┘││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

## Benefits of This Fix

1. **Single Process**: Railway can properly manage one application process
2. **Simplified Architecture**: Easier to debug and maintain
3. **Better Error Handling**: Clear error messages for missing configuration
4. **Railway Optimized**: Follows Railway best practices
5. **Health Checks**: Proper health check endpoint for Railway monitoring

## Testing Locally

To test locally, create a `.env` file with the required variables:

```bash
MONGODB_URI=mongodb://localhost:27017/urban-realty
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
NODE_ENV=development
PORT=3000
```

Then run:
```bash
npm install
cd new-nextjs-app && npm install && npm run build
cd .. && node server.js
```

The application will be available at `http://localhost:3000`