# Deployment Guide

This guide addresses the "Frontend assets not found" issue and provides comprehensive deployment instructions.

## 🚨 Common Issue: Frontend Assets Not Found

### Problem
When starting the server, you might encounter this error:
```json
{
  "success": false,
  "error": "Frontend assets not found",
  "path": "/client/dist/index.html"
}
```

### Root Cause
The server expects frontend build files in `client/dist/`, but they're either:
1. Missing entirely
2. Stored in `client/dist.zip` (compressed)
3. Not built yet

### Solution

#### Option 1: Use the Setup Script (Recommended)
```bash
npm run setup
```
This script will:
- Install all dependencies
- Extract `client/dist.zip` if it exists
- Build the frontend if no zip file is found
- Create necessary directories

#### Option 2: Manual Fix
```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Extract existing build
cd client
unzip dist.zip
cd ..

# Start server
npm start
```

#### Option 3: Fresh Build
```bash
# Install dependencies
npm install
cd client && npm install && cd ..

# Build frontend
npm run build:client

# Start server
npm start
```

## 🚀 Production Deployment

### Railway Deployment
1. Connect your repository to Railway
2. Railway will automatically run the build process
3. The `Railway.toml` file configures the deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build

# Or build manually
docker build -t urban-realty .
docker run -p 5000:5000 urban-realty
```

### Manual Server Deployment

#### Step 1: Prepare the Application
```bash
# Clone and setup
git clone <repository-url>
cd urban-realty
npm run setup
```

#### Step 2: Configure Environment
Create `.env` files:

**Root `.env`:**
```env
NODE_ENV=production
PORT=5000
```

**Server `.env`:**
```env
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
# Add other production environment variables
```

#### Step 3: Start the Server
```bash
# Production start
npm start

# Or with PM2 (recommended for production)
npm install -g pm2
pm2 start server/server.js --name "urban-realty"
pm2 startup
pm2 save
```

## 🔧 Server Configuration

### Port Configuration
The server runs on port 5000 by default. To change it:

1. Set the `PORT` environment variable:
   ```bash
   export PORT=3000
   npm start
   ```

2. Or modify `server/server.js`:
   ```javascript
   const PORT = process.env.PORT || 3000;
   ```

### Static File Serving
The server is configured to serve static files from `client/dist/`:

```javascript
// In server/server.js
app.use(express.static(clientDistDir));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistDir, 'index.html'));
});
```

## 🛠️ Troubleshooting

### Server Won't Start
1. **Check dependencies**: `npm install`
2. **Check Node.js version**: `node --version` (should be >= 18.0.0)
3. **Check port availability**: `lsof -i :5000`
4. **Check environment variables**: Ensure `.env` files exist

### Frontend Still Not Loading
1. **Verify dist directory**: `ls -la client/dist/`
2. **Check index.html**: `cat client/dist/index.html`
3. **Rebuild frontend**: `npm run build:client`
4. **Check server logs**: Look for file path errors

### Database Connection Issues
1. **Check MongoDB URI**: Verify connection string in `.env`
2. **Test connection**: Use MongoDB Compass or CLI
3. **Check network**: Ensure database is accessible

### Performance Issues
1. **Enable compression**: Add `compression` middleware
2. **Use PM2**: For process management and auto-restart
3. **Monitor logs**: Check for memory leaks or slow queries

## 📊 Monitoring

### Health Checks
The server provides health check endpoints:
- `GET /api/v1/health` - Basic health status
- `GET /api/v1/test` - API functionality test

### Logging
- Server logs are written to console
- Consider using Winston for production logging
- Monitor for errors and performance issues

## 🔒 Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **HTTPS**: Use SSL/TLS in production
3. **Rate Limiting**: Already implemented in the server
4. **CORS**: Configure for your domain
5. **Input Validation**: All endpoints validate input

## 📝 Deployment Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Frontend built (`npm run setup`)
- [ ] Environment variables configured
- [ ] Database connected and accessible
- [ ] Port available and configured
- [ ] SSL certificate (if using HTTPS)
- [ ] Monitoring and logging configured
- [ ] Backup strategy in place
- [ ] Health checks passing
- [ ] Performance tested