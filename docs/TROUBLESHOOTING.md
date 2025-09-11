# Urban Realty Troubleshooting Guide

## Common Issues and Solutions

This guide covers the most common issues developers and users encounter with the Urban Realty application and their solutions.

## Server Issues

### 1. Server Won't Start

#### Error: "Cannot find module"
```bash
Error: Cannot find module './src/config/db'
```

**Solution:**
```bash
# Check if all dependencies are installed
npm install

# Check file paths and imports
# Ensure all required files exist
ls -la server/src/config/
```

#### Error: "Port 5000 already in use"
```bash
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Find and kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run server
```

#### Error: "MongoDB connection failed"
```bash
MongoServerError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**
```bash
# Start MongoDB service
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Check MongoDB URI in .env file
echo $MONGODB_URI
```

### 2. Database Connection Issues

#### Error: "Authentication failed"
```bash
MongoServerError: Authentication failed
```

**Solution:**
- Check MongoDB credentials in `.env`
- Ensure user has proper permissions
- Verify database name is correct

#### Error: "Database not found"
```bash
MongoServerError: database urban-realty not found
```

**Solution:**
- Database will be created automatically on first connection
- Check MongoDB URI format
- Ensure MongoDB service is running

### 3. Environment Variable Issues

#### Error: "JWT_SECRET is required"
```bash
Config validation error: "JWT_SECRET" is required
```

**Solution:**
```bash
# Check .env file exists and has required variables
cat server/.env

# Ensure no spaces around =
JWT_SECRET=your-secret-key-here

# Restart server after changes
npm run server
```

## Client Issues

### 1. Build Failures

#### Error: "Module not found"
```bash
Module not found: Error: Can't resolve '@/components/Button'
```

**Solution:**
```bash
# Check import paths
# Use relative paths or configure path aliases
import Button from '../components/ui/Button';

# Or configure Vite aliases in vite.config.js
```

#### Error: "Vite build failed"
```bash
Build failed with 1 error
```

**Solution:**
```bash
# Clear cache and rebuild
cd client
rm -rf node_modules/.vite
npm run build

# Check for TypeScript errors
npm run type-check
```

### 2. Runtime Errors

#### Error: "Cannot read property of undefined"
```javascript
TypeError: Cannot read property 'map' of undefined
```

**Solution:**
```javascript
// Add null checks
const properties = data?.properties || [];

// Use optional chaining
properties?.map(property => ...)
```

#### Error: "Network request failed"
```javascript
Error: Network request failed
```

**Solution:**
- Check API base URL in `.env`
- Verify server is running
- Check CORS configuration
- Verify network connectivity

### 3. Styling Issues

#### Error: "CSS not loading"
```bash
Failed to load resource: the server responded with a status of 404
```

**Solution:**
```bash
# Check CSS file paths
# Ensure CSS files are in public directory
# Check import statements
```

#### Error: "Tailwind classes not working"
```html
<div class="bg-blue-500"> <!-- Not styled -->
```

**Solution:**
```bash
# Check Tailwind configuration
cat client/tailwind.config.js

# Rebuild CSS
cd client
npm run build
```

## Mobile App Issues

### 1. Flutter Build Issues

#### Error: "Flutter SDK not found"
```bash
Flutter SDK not found
```

**Solution:**
```bash
# Install Flutter
# Follow: https://flutter.dev/docs/get-started/install

# Check Flutter installation
flutter doctor

# Add Flutter to PATH
export PATH="$PATH:/path/to/flutter/bin"
```

#### Error: "Dependencies not found"
```bash
Error: Could not find package:flutter
```

**Solution:**
```bash
cd mobile
flutter pub get
flutter clean
flutter pub get
```

### 2. Android Build Issues

#### Error: "Android SDK not found"
```bash
Android SDK not found
```

**Solution:**
```bash
# Install Android Studio
# Set ANDROID_HOME environment variable
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

#### Error: "Gradle build failed"
```bash
Gradle build failed
```

**Solution:**
```bash
cd mobile/android
./gradlew clean
cd ..
flutter build apk
```

### 3. iOS Build Issues

#### Error: "iOS simulator not found"
```bash
No iOS simulators are available
```

**Solution:**
```bash
# Install Xcode
# Open Xcode and install simulators
# List available simulators
flutter emulators
```

## Deployment Issues

### 1. Railway Deployment

#### Error: "Build failed"
```bash
Build failed: npm run build
```

**Solution:**
- Check build script in package.json
- Ensure all dependencies are in dependencies, not devDependencies
- Check for build errors locally first

#### Error: "Environment variables not set"
```bash
Config validation error: "JWT_SECRET" is required
```

**Solution:**
- Set environment variables in Railway dashboard
- Check variable names match exactly
- Restart deployment after changes

### 2. Docker Issues

#### Error: "Docker build failed"
```bash
Docker build failed: COPY failed
```

**Solution:**
```bash
# Check Dockerfile syntax
# Ensure all files exist
# Check .dockerignore file
```

#### Error: "Container won't start"
```bash
Container exited with code 1
```

**Solution:**
```bash
# Check container logs
docker logs container-name

# Check environment variables
docker exec -it container-name env
```

## API Issues

### 1. Authentication Issues

#### Error: "Invalid token"
```json
{
  "success": false,
  "error": "Invalid token"
}
```

**Solution:**
- Check JWT token format
- Verify token hasn't expired
- Ensure Authorization header is correct: `Bearer <token>`

#### Error: "Access denied"
```json
{
  "success": false,
  "error": "Access denied. Authentication required."
}
```

**Solution:**
- Login to get valid token
- Include token in request headers
- Check user permissions

### 2. Validation Issues

#### Error: "Validation failed"
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": {
    "email": "Email is required"
  }
}
```

**Solution:**
- Check request body format
- Ensure all required fields are provided
- Validate data types and formats

### 3. File Upload Issues

#### Error: "File too large"
```json
{
  "success": false,
  "error": "File size exceeds maximum limit"
}
```

**Solution:**
- Check file size limits
- Compress images before upload
- Update MAX_FILE_SIZE in configuration

#### Error: "Invalid file type"
```json
{
  "success": false,
  "error": "Invalid file type"
}
```

**Solution:**
- Check allowed file types
- Convert file to supported format
- Update ALLOWED_FILE_TYPES in configuration

## Performance Issues

### 1. Slow Loading

#### Issue: "Page loads slowly"
**Solutions:**
- Enable code splitting
- Optimize images
- Use lazy loading
- Implement caching

#### Issue: "API responses are slow"
**Solutions:**
- Add database indexes
- Implement caching
- Optimize queries
- Use pagination

### 2. Memory Issues

#### Error: "Out of memory"
```bash
FATAL ERROR: Ineffective mark-compacts near heap limit
```

**Solution:**
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 server.js

# Or set in package.json
"scripts": {
  "start": "node --max-old-space-size=4096 server.js"
}
```

## Browser Issues

### 1. CORS Issues

#### Error: "CORS policy blocked"
```bash
Access to fetch at 'http://localhost:5000' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
```javascript
// Check CORS configuration in server
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

### 2. Local Storage Issues

#### Error: "localStorage is not defined"
```bash
ReferenceError: localStorage is not defined
```

**Solution:**
```javascript
// Check if running in browser
if (typeof window !== 'undefined') {
  localStorage.setItem('key', 'value');
}
```

## Debugging Tips

### 1. Enable Debug Logging

```bash
# Server debug logging
DEBUG=* npm run server

# Specific modules
DEBUG=urban-realty:* npm run server
```

### 2. Check Logs

```bash
# Application logs
npm run logs

# Docker logs
docker logs container-name

# Railway logs
railway logs
```

### 3. Network Debugging

```bash
# Check API endpoints
curl http://localhost:5000/api/v1/health

# Check with authentication
curl -H "Authorization: Bearer <token>" http://localhost:5000/api/v1/properties
```

### 4. Database Debugging

```bash
# Connect to MongoDB
mongosh

# Check collections
use urban-realty
show collections

# Query data
db.users.find()
db.properties.find().limit(5)
```

## Getting Help

### 1. Check Documentation
- Read the relevant documentation first
- Check API documentation for endpoint details
- Review component documentation for usage

### 2. Search Issues
- Search existing GitHub issues
- Check Stack Overflow for similar problems
- Look for solutions in community forums

### 3. Create Issue
When creating a new issue, include:
- Error message (exact text)
- Steps to reproduce
- Environment details (OS, Node version, etc.)
- Screenshots if applicable
- Logs if available

### 4. Contact Support
- Use GitHub Discussions for questions
- Create GitHub Issues for bugs
- Contact development team for urgent issues

## Prevention Tips

### 1. Regular Maintenance
- Keep dependencies updated
- Monitor application logs
- Regular database maintenance
- Backup important data

### 2. Testing
- Write comprehensive tests
- Test in different environments
- Use staging environment for testing
- Perform regular security audits

### 3. Monitoring
- Set up error tracking (Sentry)
- Monitor performance metrics
- Set up alerts for critical issues
- Regular health checks

## Emergency Procedures

### 1. Application Down
1. Check server status
2. Review recent deployments
3. Check error logs
4. Rollback if necessary
5. Notify users

### 2. Database Issues
1. Check database connectivity
2. Review database logs
3. Check disk space
4. Restore from backup if needed

### 3. Security Issues
1. Assess the impact
2. Take immediate action
3. Notify stakeholders
4. Document the incident
5. Implement fixes
6. Review security measures