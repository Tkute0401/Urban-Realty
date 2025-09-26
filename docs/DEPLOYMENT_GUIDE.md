# Squarefooot Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Squarefooot application across different environments and platforms.

## Architecture

The Squarefooot application consists of three main components:

- **Server**: Node.js/Express API server
- **Client**: React web application
- **Mobile**: Flutter mobile application

## Prerequisites

### Required Software
- Node.js 18+ 
- npm or yarn
- MongoDB (local or cloud)
- Git
- Docker (optional)

### Required Services
- Cloudinary (for image storage)
- Razorpay (for payments)
- Email service (SMTP)
- Railway/Heroku (for hosting)

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-username/urban-realty.git
cd urban-realty
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies (if separate)
cd server && npm install && cd ..
```

### 3. Environment Variables

Create environment files for each component:

#### Server (.env)
```env
# Database
MONGODB_URI=mongodb://localhost:27017/urban-realty
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/urban-realty

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Email
EMAIL_FROM=noreply@urbanrealty.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Frontend
FRONTEND_URL=http://localhost:3000

# CORS
CORS_ORIGIN=http://localhost:3000

# Security
SESSION_SECRET=your-session-secret-key
BCRYPT_ROUNDS=12

# Optional
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
SENTRY_DSN=your-sentry-dsn
```

#### Client (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
```

## Local Development

### 1. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or using local installation
mongod
```

### 2. Start Server

```bash
# Development mode
npm run server

# Or directly
cd server && npm run dev
```

### 3. Start Client

```bash
# Development mode
npm run client

# Or directly
cd client && npm run dev
```

### 4. Access Application

- **Client**: http://localhost:3000
- **Server**: http://localhost:5000
- **API Health**: http://localhost:5000/api/v1/health

## Production Deployment

### Railway Deployment (Recommended)

#### 1. Prepare for Railway

```bash
# Build client
cd client && npm run build && cd ..

# Test production build locally
npm start
```

#### 2. Deploy to Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push to main branch

#### 3. Railway Configuration

Create `Railway.toml`:
```toml
[build]
builder = "docker"

[deploy]
startCommand = "npm start"
healthcheckPath = "/api/v1/health"
healthcheckTimeout = 100

[environments]
NODE_ENV = "production"
CLIENT_DIST_DIR = "/app/client/dist"
```

### Docker Deployment

#### 1. Build Docker Image

```bash
# Build image
docker build -t urban-realty .

# Run container
docker run -p 5000:5000 --env-file .env urban-realty
```

#### 2. Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/urban-realty
    depends_on:
      - mongo
    volumes:
      - ./uploads:/app/uploads

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

Deploy:
```bash
docker-compose up -d
```

### Heroku Deployment

#### 1. Prepare for Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create urban-realty-app
```

#### 2. Configure Heroku

```bash
# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
# ... set all other environment variables

# Add MongoDB addon
heroku addons:create mongolab:sandbox
```

#### 3. Deploy

```bash
# Deploy to Heroku
git push heroku main

# Open app
heroku open
```

## Mobile App Deployment

### Flutter App Deployment

#### 1. Android (Google Play Store)

```bash
cd mobile

# Build release APK
flutter build apk --release

# Build App Bundle (recommended)
flutter build appbundle --release

# Upload to Google Play Console
```

#### 2. iOS (App Store)

```bash
cd mobile

# Build for iOS
flutter build ios --release

# Archive and upload via Xcode
```

## Environment-Specific Configurations

### Development
- Hot reloading enabled
- Detailed error messages
- Local database
- Debug logging

### Staging
- Production-like environment
- Test database
- Limited error details
- Performance monitoring

### Production
- Optimized builds
- Production database
- Error tracking
- Performance monitoring
- SSL/HTTPS enabled

## Database Setup

### MongoDB Atlas (Cloud)

1. Create MongoDB Atlas account
2. Create cluster
3. Get connection string
4. Set `MONGODB_URI` environment variable

### Local MongoDB

```bash
# Install MongoDB
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb

# Start MongoDB
sudo systemctl start mongod
# or
mongod
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Nginx)

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Monitoring and Logging

### Application Monitoring

```bash
# Install monitoring tools
npm install --save @sentry/node
npm install --save morgan

# Configure Sentry
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

### Health Checks

```bash
# Check server health
curl https://yourdomain.com/api/v1/health

# Expected response
{
  "status": "healthy",
  "environment": "production",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Backup and Recovery

### Database Backup

```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/urban-realty" --out=backup/

# Restore
mongorestore --uri="mongodb://localhost:27017/urban-realty" backup/urban-realty/
```

### File Backup

```bash
# Backup uploads directory
tar -czf uploads-backup.tar.gz uploads/

# Restore
tar -xzf uploads-backup.tar.gz
```

## Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 2. Database Connection Issues
- Check MongoDB URI format
- Verify network connectivity
- Check firewall settings

#### 3. Environment Variable Issues
- Verify all required variables are set
- Check variable names and values
- Restart application after changes

#### 4. CORS Issues
- Update CORS_ORIGIN environment variable
- Check frontend URL configuration

### Logs and Debugging

```bash
# View application logs
npm run logs

# Docker logs
docker logs container-name

# Railway logs
railway logs

# Heroku logs
heroku logs --tail
```

## Performance Optimization

### Server Optimization

```bash
# Enable compression
npm install compression

# Enable caching
npm install redis

# Database indexing
# Add indexes in MongoDB for frequently queried fields
```

### Client Optimization

```bash
# Build analysis
npm run build -- --analyze

# Bundle optimization
# Code splitting, lazy loading, tree shaking
```

## Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Secure headers configured
- [ ] Regular security updates

## Maintenance

### Regular Tasks

1. **Weekly**
   - Monitor application performance
   - Check error logs
   - Review security alerts

2. **Monthly**
   - Update dependencies
   - Database maintenance
   - Backup verification

3. **Quarterly**
   - Security audit
   - Performance review
   - Disaster recovery testing

## Support

For deployment issues:
1. Check logs for error messages
2. Verify environment configuration
3. Test locally first
4. Contact development team

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Heroku Documentation](https://devcenter.heroku.com/)
- [Docker Documentation](https://docs.docker.com/)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Flutter Deployment Guide](https://flutter.dev/docs/deployment)