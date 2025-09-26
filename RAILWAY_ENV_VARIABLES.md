# Railway Environment Variables for Squarefooot Deployment

## 🚂 Required Railway Environment Variables

### Core Application Settings
```bash
NODE_ENV=production
PORT=3000
```

### Database Configuration
```bash
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/squarefooot?retryWrites=true&w=majority
```

### JWT Configuration
```bash
JWT_SECRET=your-super-secure-jwt-secret-for-production
JWT_EXPIRE=30d
```

### Next.js Frontend Configuration
```bash
NEXT_PUBLIC_BASE_URL=https://your-railway-domain.railway.app
NEXT_PUBLIC_API_URL=https://your-railway-domain.railway.app/api/v1
NEXT_PUBLIC_SITE_NAME=Squarefooot
NEXT_PUBLIC_SITE_DESCRIPTION=Premier real estate platform for buying, selling, and renting properties
```

### CORS Configuration
```bash
CORS_ORIGIN=https://your-railway-domain.railway.app
```

### Business Information (for SEO)
```bash
BUSINESS_NAME=Squarefooot
BUSINESS_EMAIL=contact@squarefooot.com
BUSINESS_PHONE=+1-XXX-XXX-XXXX
BUSINESS_ADDRESS_CITY=Your City
BUSINESS_ADDRESS_STATE=Your State
BUSINESS_ADDRESS_COUNTRY=US
```

## 🔧 Optional Environment Variables

### Google Services
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
GOOGLE_SITE_VERIFICATION=your-google-site-verification
```

### Social Media (for SEO structured data)
```bash
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/squarefooot
NEXT_PUBLIC_TWITTER_HANDLE=@squarefooot
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/company/squarefooot
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/squarefooot
```

### Payment Gateway
```bash
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret-key
```

### Image Optimization
```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
```

### Email Service
```bash
EMAIL_FROM=noreply@squarefooot.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

## 🎯 Railway-Specific Variables

Railway automatically provides these:
```bash
RAILWAY_ENVIRONMENT=production
RAILWAY_PROJECT_ID=automatically-set
RAILWAY_SERVICE_ID=automatically-set
```

## 📝 How to Set Variables in Railway

### Method 1: Railway Dashboard
1. Go to your Railway project dashboard
2. Select your service
3. Go to "Variables" tab
4. Add each variable with its value

### Method 2: Railway CLI
```bash
railway variables set NODE_ENV=production
railway variables set MONGO_URI="mongodb+srv://..."
railway variables set JWT_SECRET="your-secret"
# ... repeat for all variables
```

### Method 3: Environment File Upload
Create a `.env.production` file and upload via Railway dashboard:
```bash
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret
# ... all other variables
```

## ⚠️ Important Notes

1. **Replace Placeholder Values**: Update all `your-*` placeholders with actual values
2. **Secure Secrets**: Use strong passwords and secrets for production
3. **Domain Updates**: Replace `your-railway-domain.railway.app` with your actual Railway domain
4. **Database Setup**: Ensure your MongoDB database allows connections from Railway IPs
5. **API Keys**: Obtain real API keys for Google Maps, Razorpay, etc.

## 🔍 Validation

After setting environment variables, you can validate the deployment:

```bash
# Check if all required variables are set
railway run node validate-deployment.js

# Test the deployment
railway run npm start
```

## 🚀 Deployment Steps

1. **Set Environment Variables** (using methods above)
2. **Push Code to Railway**:
   ```bash
   git add .
   git commit -m "Deploy Squarefooot with Next.js + Express"
   git push origin main
   ```
3. **Railway Auto-Deploy**: Railway will automatically build and deploy
4. **Verify Deployment**: Check the provided Railway URL

## 📊 Minimal Required Set (for basic functionality)

If you want to start with minimal configuration:
```bash
NODE_ENV=production
PORT=3000
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_BASE_URL=https://your-domain.railway.app
NEXT_PUBLIC_API_URL=https://your-domain.railway.app/api/v1
CORS_ORIGIN=https://your-domain.railway.app
BUSINESS_NAME=Squarefooot
```

This minimal set will get your application running. Add other variables as needed for additional features.