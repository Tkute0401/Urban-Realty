# Railway Deployment Setup

## Overview

This guide provides step-by-step instructions for deploying the Squarefooot application to Railway.

## Prerequisites

- Railway account
- GitHub repository connected to Railway
- Environment variables configured

## Step 1: Connect Repository

1. Go to [Railway](https://railway.app/)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your Squarefooot repository
5. Select the main branch

## Step 2: Configure Environment Variables

Set the following environment variables in Railway dashboard:

### Required Variables

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/urban-realty

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Email Configuration
EMAIL_FROM=noreply@yourdomain.com
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
FRONTEND_URL=https://your-app.up.railway.app

# CORS - Add your domain and any development URLs
CORS_ORIGIN=https://your-app.up.railway.app,https://www.squarefooot.com,http://localhost:3000,http://localhost:5000

# Security
SESSION_SECRET=your-session-secret-key-minimum-32-characters
BCRYPT_ROUNDS=12

# Optional
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
SENTRY_DSN=your-sentry-dsn
```

### Client Build Variables

```env
VITE_API_BASE_URL=https://your-app.up.railway.app/api/v1
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
```

## Step 3: Configure Railway Settings

### Build Settings

1. Go to your project settings
2. Set the following build settings:

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

### Domain Settings

1. Go to Settings > Domains
2. Add your custom domain (optional)
3. Configure SSL certificate

## Step 4: Deploy

1. Railway will automatically deploy when you push to the main branch
2. Monitor the deployment logs
3. Check the health endpoint: `https://your-app.up.railway.app/api/v1/health`

## Step 5: Post-Deployment

### Verify Deployment

```bash
# Check health endpoint
curl https://your-app.up.railway.app/api/v1/health

# Check API endpoints
curl https://your-app.up.railway.app/api/v1/properties

# Check frontend
curl https://your-app.up.railway.app/
```

### Database Setup

1. Connect to your MongoDB instance
2. Create the database: `urban-realty`
3. Run any necessary migrations

### SSL Configuration

Railway automatically provides SSL certificates. For custom domains:

1. Add your domain in Railway dashboard
2. Update DNS records
3. Wait for SSL certificate provisioning

## Monitoring

### Logs

- View logs in Railway dashboard
- Set up log aggregation if needed
- Monitor error rates and performance

### Metrics

- CPU and memory usage
- Request count and response times
- Error rates and status codes

### Alerts

Set up alerts for:
- High error rates
- High memory usage
- Service downtime

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs
   - Verify all dependencies are in package.json
   - Ensure build scripts are correct

2. **Environment Variables**
   - Verify all required variables are set
   - Check variable names and values
   - Restart service after changes

3. **Database Connection**
   - Verify MongoDB URI format
   - Check network connectivity
   - Ensure database exists

4. **CORS Issues**
   - Update CORS_ORIGIN environment variable in Railway dashboard
   - Add all domains that need to access the API (separated by commas)
   - For www.squarefooot.com: CORS_ORIGIN=https://your-app.up.railway.app,https://www.squarefooot.com
   - Restart the service after updating environment variables
   - Check frontend URL configuration

### Debug Commands

```bash
# Check service status
railway status

# View logs
railway logs

# Connect to service
railway connect

# Check environment variables
railway variables
```

## Scaling

### Horizontal Scaling

1. Go to Settings > Scaling
2. Increase instance count
3. Configure load balancing

### Vertical Scaling

1. Go to Settings > Scaling
2. Increase memory and CPU
3. Monitor performance

## Backup and Recovery

### Database Backup

```bash
# Backup MongoDB
mongodump --uri="your-mongodb-uri" --out=backup/

# Restore MongoDB
mongorestore --uri="your-mongodb-uri" backup/urban-realty/
```

### File Backup

- Railway handles file system backups
- For persistent storage, use external services
- Backup uploads directory regularly

## Security

### Environment Variables

- Never commit sensitive data
- Use Railway's secure environment variables
- Rotate secrets regularly

### Network Security

- Use HTTPS only
- Configure proper CORS
- Implement rate limiting

### Application Security

- Keep dependencies updated
- Run security audits
- Monitor for vulnerabilities

## Cost Optimization

### Resource Management

- Monitor resource usage
- Scale down during low traffic
- Use appropriate instance sizes

### Database Optimization

- Optimize queries
- Use indexes effectively
- Monitor database performance

## Support

- Railway Documentation: https://docs.railway.app/
- Community Support: https://discord.gg/railway
- Status Page: https://status.railway.app/