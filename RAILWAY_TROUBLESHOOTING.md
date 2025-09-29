# Railway Deployment Troubleshooting Guide

## Common Issues and Solutions

### 1. Authentication Issues (401 Unauthorized)

**Symptoms:**
- Login works locally but fails on Railway
- `/api/v1/auth/me` returns 401 Unauthorized
- User gets logged out immediately after login

**Solutions:**

1. **Check JWT_SECRET Environment Variable:**
   ```bash
   # In Railway dashboard, ensure JWT_SECRET is set and is at least 32 characters long
   JWT_SECRET=your_very_long_and_secure_secret_key_here_minimum_32_chars
   ```

2. **Verify CORS Configuration:**
   - Ensure `CORS_ORIGIN` includes your Railway domain
   - Check that `credentials: true` is set in CORS config

3. **Check Token Storage:**
   - Verify tokens are being sent in Authorization header
   - Check if cookies are being used for token storage

### 2. Internal Server Error on Property Details

**Symptoms:**
- Property listing works but individual property pages show 500 error
- Console shows "Internal Server Error"

**Solutions:**

1. **Check MongoDB Connection:**
   ```bash
   # Verify MONGODB_URI is correctly set
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   ```

2. **Verify Database Access:**
   - Ensure MongoDB Atlas allows connections from Railway IPs
   - Check if database user has proper permissions

3. **Check Property ID Format:**
   - Ensure property IDs are valid MongoDB ObjectIds
   - Add proper validation in the controller

### 3. CORS Issues

**Symptoms:**
- Frontend can't communicate with backend
- CORS errors in browser console
- Preflight requests failing

**Solutions:**

1. **Update CORS Configuration:**
   ```javascript
   // In server.js
   app.use(cors({
     origin: function (origin, callback) {
       const allowedOrigins = [
         'https://your-railway-app.up.railway.app',
         'http://localhost:3000'
       ];
       if (!origin || allowedOrigins.includes(origin)) {
         callback(null, true);
       } else {
         callback(new Error('Not allowed by CORS'));
       }
     },
     credentials: true
   }));
   ```

2. **Set Environment Variables:**
   ```bash
   CORS_ORIGIN=https://your-railway-app.up.railway.app
   FRONTEND_URL=https://your-railway-app.up.railway.app
   ```

### 4. Database Connection Issues

**Symptoms:**
- Server starts but can't connect to database
- Database queries fail
- User registration/login fails

**Solutions:**

1. **Check MongoDB URI:**
   ```bash
   # Ensure MONGODB_URI is properly formatted
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
   ```

2. **Verify Network Access:**
   - Add Railway IPs to MongoDB Atlas whitelist
   - Or set IP whitelist to 0.0.0.0/0 (less secure but works)

3. **Check Database User Permissions:**
   - Ensure user has read/write access to the database
   - Verify database name is correct

### 5. Build and Deployment Issues

**Symptoms:**
- Build fails on Railway
- Application doesn't start
- Missing dependencies

**Solutions:**

1. **Check Package.json Scripts:**
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "build": "cd new-nextjs-app && npm install && npm run build"
     }
   }
   ```

2. **Verify Node Version:**
   ```json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

3. **Check Railway Configuration:**
   - Ensure `railway.json` is properly configured
   - Verify start command is correct

## Environment Variables Checklist

### Required Variables:
- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI` (MongoDB connection string)
- [ ] `JWT_SECRET` (minimum 32 characters)

### Recommended Variables:
- [ ] `FRONTEND_URL` (your Railway app URL)
- [ ] `CORS_ORIGIN` (allowed origins)
- [ ] `PORT=3000`
- [ ] `HOSTNAME=0.0.0.0`

### Optional Variables:
- [ ] `CLOUDINARY_*` (for image uploads)
- [ ] `RAZORPAY_*` (for payments)
- [ ] `EMAIL_*` (for email notifications)
- [ ] `GOOGLE_MAPS_API_KEY` (for maps)

## Debugging Steps

1. **Check Railway Logs:**
   ```bash
   railway logs
   ```

2. **Test API Endpoints:**
   ```bash
   curl https://your-app.up.railway.app/api/v1/health
   curl https://your-app.up.railway.app/api/v1/test
   ```

3. **Verify Environment Variables:**
   ```bash
   railway variables
   ```

4. **Check Database Connection:**
   - Look for MongoDB connection logs
   - Verify database queries are working

## Quick Fixes

### Reset and Redeploy:
1. Clear Railway cache
2. Redeploy from GitHub
3. Check logs for errors

### Common Commands:
```bash
# Deploy to Railway
railway up

# Check logs
railway logs

# View variables
railway variables

# Connect to database
railway connect
```

## Still Having Issues?

1. Check Railway status page for outages
2. Verify your MongoDB Atlas cluster is running
3. Check if your Railway plan has sufficient resources
4. Review the application logs for specific error messages
5. Test the API endpoints individually to isolate the issue