require('dotenv').config({ path: `${__dirname}/.env` });
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const errorHandler = require('./src/api/middleware/errorHandler');
const { migrateExistingUsers } = require('./utils/migrateExistingUsers');
const config = require('./config/environment');
const { HTTP_STATUS, ERROR_MESSAGES } = require('./constants');
const {
  trackUserAction,
  trackApiUsage,
  trackPropertyView,
  trackSearch,
  trackAuthEvents,
  trackErrors,
  trackPerformance
} = require('./src/middleware/analytics');

const app = express();

// Connect to database
connectDB();

// Migrate existing users to ensure subscription status (only if DB connected)
setTimeout(async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      await migrateExistingUsers();
    } else {
      console.log('⚠️  Skipping user migration - no database connection');
    }
  } catch (error) {
    console.error('Migration failed:', error);
  }
}, 5000); // Wait 5 seconds for DB connection to stabilize

// Configure paths
const uploadsDir = path.join(__dirname, 'uploads');
// Prefer env override; fall back to repo-relative client dist. Avoid absolute container path.
const clientDistDir = process.env.CLIENT_DIST_DIR
  ? process.env.CLIENT_DIST_DIR
  : path.join(__dirname, '..', 'client', 'dist');

// Ensure uploads directory exists (do not attempt to create client dist)
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Directory created: ${uploadsDir}`);
  }
} catch (err) {
  console.error(`Error creating uploads directory ${uploadsDir}:`, err);
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: true // If you're using cookies/sessions
}));
app.use(express.json({ limit: config.upload.maxFileSize }));
app.use(express.urlencoded({ extended: true, limit: config.upload.maxFileSize }));

// Analytics middleware
app.use(trackUserAction);
app.use(trackApiUsage);
app.use(trackPropertyView);
app.use(trackSearch);
app.use(trackAuthEvents);
app.use(trackPerformance);

// Static files
app.use('/uploads', express.static(uploadsDir));
if (fs.existsSync(clientDistDir)) {
  app.use(express.static(clientDistDir)); // Serve React build
} else {
  console.warn(`Client dist directory not found, skipping static serve: ${clientDistDir}`);
}

// API Routes
app.use('/api/v1/auth', require('./src/api/routes/authRoutes'));
app.use('/api/v1/properties', require('./src/api/routes/propertyRoutes'));
app.use('/api/v1/contacts', require('./src/api/routes/contactRoutes'));
app.use('/api/v1/admin', require('./src/api/routes/adminRoutes'));
app.use('/api/v1/subscriptions', require('./src/api/routes/subscriptionRoutes'));
app.use('/api/v1/analytics', require('./src/api/routes/analyticsRoutes'));
app.use('/api/v1/agent', require('./src/api/routes/agentRoutes'));
app.use('/media', require('./src/api/routes/mediaRoutes'));
app.use('/api/v1/developers', require('./src/api/routes/developerRoutes'))

// Health endpoints
app.get('/api/v1/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({ 
    status: 'healthy',
    environment: config.env,
    staticFilesPath: clientDistDir,
    uploadsPath: uploadsDir,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/test', (req, res) => {
  res.status(HTTP_STATUS.OK).json({ 
    status: 'success',
    message: 'API is working',
    environment: config.env,
    staticFiles: fs.existsSync(path.join(clientDistDir, 'index.html')) 
      ? 'Found' 
      : 'Not found'
  });
});

// SPA Fallback - Only in production (Next.js handles dev frontend)
if (config.env === 'production') {
  app.get('*', (req, res) => {
    const indexPath = path.join(clientDistDir, 'index.html');
    
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(HTTP_STATUS.NOT_FOUND).json({ 
        success: false,
        error: 'Frontend build not found. Please run npm run build.'
      });
    }
  });
}

// Error handling
app.use(trackErrors);
app.use(errorHandler);
app.use((req, res) => res.status(HTTP_STATUS.NOT_FOUND).json({ 
  success: false, 
  error: ERROR_MESSAGES.NOT_FOUND 
}));

// Server
const PORT = config.port;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${config.env} mode on port ${PORT}`);
  console.log(`Serving static files from: ${clientDistDir}`);
  console.log(`Uploads directory: ${uploadsDir}`);
  
  // Verify frontend files
  if (fs.existsSync(clientDistDir)) {
    console.log('Frontend files:', fs.readdirSync(clientDistDir));
  } else {
    console.log('Frontend files: client dist directory not found');
  }
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = server;