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
console.log('🔌 Connecting to database...');
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
// Ensure clientDistDir is properly defined with fallback
let clientDistDir;
try {
  clientDistDir = path.join(__dirname, '..', 'new-nextjs-app', 'public');
  // Validate the path exists or use a fallback
  if (!fs.existsSync(clientDistDir)) {
    console.log(`Warning: Default clientDistDir not found: ${clientDistDir}`);
    // Try alternative paths for Docker environment
    const alternativePaths = [
      path.join(__dirname, '..', 'new-nextjs-app', 'public'),
      path.join(process.cwd(), 'new-nextjs-app', 'public'),
      path.join('/', 'app', 'new-nextjs-app', 'public')
    ];
    
    for (const altPath of alternativePaths) {
      if (fs.existsSync(altPath)) {
        clientDistDir = altPath;
        console.log(`Using alternative clientDistDir: ${clientDistDir}`);
        break;
      }
    }
  }
} catch (error) {
  console.error('Error setting up clientDistDir:', error);
  clientDistDir = path.join(__dirname, '..', 'new-nextjs-app', 'public');
}
// Next.js server configuration
const NEXTJS_PORT = process.env.NEXTJS_PORT || 3001;
const NEXTJS_URL = `http://localhost:${NEXTJS_PORT}`;

// Check if we're in production and should serve Next.js statically
const isProduction = config.env === 'production';
const nextAppPath = path.join(__dirname, '..', 'new-nextjs-app');
const nextBuildPath = path.join(nextAppPath, '.next');
const shouldServeNextJS = isProduction && fs.existsSync(nextBuildPath);

console.log('🔧 Server Configuration:', {
  isProduction,
  nextAppPath,
  nextBuildPath,
  nextBuildExists: fs.existsSync(nextBuildPath),
  shouldServeNextJS
});

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

// Request logging middleware
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Analytics middleware
app.use(trackUserAction);
app.use(trackApiUsage);
app.use(trackPropertyView);
app.use(trackSearch);
app.use(trackAuthEvents);
app.use(trackPerformance);

// Static files
app.use('/uploads', express.static(uploadsDir));

// API Routes
console.log('🔧 Registering API routes...');
app.use('/api/v1/auth', require('./src/api/routes/authRoutes'));
app.use('/api/v1/properties', require('./src/api/routes/propertyRoutes'));
app.use('/api/v1/contacts', require('./src/api/routes/contactRoutes'));
app.use('/api/v1/admin', require('./src/api/routes/adminRoutes'));
app.use('/api/v1/subscriptions', require('./src/api/routes/subscriptionRoutes'));
app.use('/api/v1/analytics', require('./src/api/routes/analyticsRoutes'));
app.use('/api/v1/agent', require('./src/api/routes/agentRoutes'));
app.use('/media', require('./src/api/routes/mediaRoutes'));
app.use('/api/v1/developers', require('./src/api/routes/developerRoutes'));
app.use('/api/v1/projects', require('./routes/projectRoutes'));
let blogRoutes;
try {
  blogRoutes = require('./routes/blogRoutes');
  console.log('✅ Blog routes file loaded successfully');
} catch (error) {
  console.error('❌ Error loading blog routes:', error);
  blogRoutes = express.Router(); // Fallback empty router
}
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', require('./src/api/routes/authRoutes'));
app.use('/api/properties', require('./src/api/routes/propertyRoutes'));
app.use('/api/contacts', require('./src/api/routes/contactRoutes'));
app.use('/api/admin', require('./src/api/routes/adminRoutes'));
app.use('/api/subscriptions', require('./src/api/routes/subscriptionRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/developers', require('./src/api/routes/developerRoutes'));
console.log('✅ API routes registered');

// Handle Next.js routes
if (shouldServeNextJS) {
  try {
    // In production, serve Next.js static files
    const nextApp = require('next')({ 
      dev: false, 
      dir: path.join(__dirname, '..', 'new-nextjs-app') 
    });
    const nextHandler = nextApp.getRequestHandler();
    
    // Handle Next.js routes
    app.get('*', (req, res) => {
      return nextHandler(req, res);
    });
    
    console.log('✅ Next.js integration enabled');
  } catch (error) {
    console.error('❌ Failed to initialize Next.js:', error.message);
    console.log('⚠️  Falling back to basic routing');
    
    // Fallback: serve basic HTML for non-API routes
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
        return res.status(404).json({ error: 'Not found' });
      }
      
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Urban Realty</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body>
            <h1>Urban Realty</h1>
            <p>Server is running. Next.js frontend is not available.</p>
            <p>API is available at <a href="/api/v1/health">/api/v1/health</a></p>
          </body>
        </html>
      `);
    });
  }
} else {
  // In development, proxy to Next.js server
  const { createProxyMiddleware } = require('http-proxy-middleware');
  
  // Proxy all non-API routes to Next.js server
  app.use('*', (req, res, next) => {
    // Proxy to Next.js server
    const proxy = createProxyMiddleware({
      target: NEXTJS_URL,
      changeOrigin: true,
      ws: true,
      logLevel: 'debug'
    });
    
    proxy(req, res, next);
  });
  
  console.log('🔧 Development mode: proxying to Next.js server');
}

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
      : 'Not found',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    nextJS: shouldServeNextJS ? 'Enabled' : 'Disabled'
  });
});

// Test property endpoint
app.get('/api/v1/test-property', async (req, res) => {
  try {
    const Property = require('./models/Property');
    const count = await Property.countDocuments();
    res.status(200).json({
      status: 'success',
      message: 'Property model test',
      propertyCount: count,
      database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Property model test failed',
      error: error.message,
      database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
  }
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
console.log('🔧 Registering error handlers...');
app.use(trackErrors);
app.use(errorHandler);
console.log('✅ Error handlers registered');
app.use((req, res) => res.status(HTTP_STATUS.NOT_FOUND).json({ 
  success: false, 
  error: ERROR_MESSAGES.NOT_FOUND 
}));

// Server
const PORT = config.port;
const HOST = process.env.HOSTNAME || '0.0.0.0';
const server = app.listen(PORT, HOST, () => {
  console.log(`🚀 Server running in ${config.env} mode on port ${PORT}`);
  console.log(`📁 Serving static files from: ${clientDistDir}`);
  console.log(`📁 Uploads directory: ${uploadsDir}`);
  console.log(`🔧 Next.js integration: ${shouldServeNextJS ? 'Enabled' : 'Disabled'}`);
  console.log(`🔌 Database state: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  console.log(`🔧 Environment variables:`, {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ? 'Set' : 'Not set'
  });
  
  // Verify frontend files
  if (fs.existsSync(clientDistDir)) {
    console.log('📁 Frontend files:', fs.readdirSync(clientDistDir));
  } else {
    console.log('⚠️  Frontend files: client dist directory not found');
  }
  
  // Test endpoints
  console.log('🔧 Test endpoints available:');
  console.log('  - /api/v1/health');
  console.log('  - /api/v1/test');
  console.log('  - /api/v1/test-property');
  
  // Test database connection
  console.log('🔧 Testing database connection...');
  if (mongoose.connection.readyState === 1) {
    console.log('✅ Database is connected');
    console.log('🔧 Database details:', {
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      readyState: mongoose.connection.readyState
    });
  } else {
    console.log('❌ Database is not connected');
    console.log('🔧 Database state:', mongoose.connection.readyState);
  }
});

process.on('unhandledRejection', (err) => {
  console.error(`💥 Unhandled Rejection: ${err.message}`);
  console.error(`💥 Stack: ${err.stack}`);
  console.error(`💥 Error details:`, {
    name: err.name,
    code: err.code,
    message: err.message,
    stack: err.stack
  });
  server.close(() => process.exit(1));
});

process.on('uncaughtException', (err) => {
  console.error(`💥 Uncaught Exception: ${err.message}`);
  console.error(`💥 Stack: ${err.stack}`);
  console.error(`💥 Error details:`, {
    name: err.name,
    code: err.code,
    message: err.message,
    stack: err.stack
  });
  server.close(() => process.exit(1));
});

module.exports = server;