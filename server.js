#!/usr/bin/env node

/**
 * Unified server for Urban Realty
 * This server combines Express API and Next.js frontend
 */

require('dotenv').config();
const express = require('express');
const next = require('next');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Check for required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`   - ${envVar}`);
  });
  console.error('\n📝 Please set these environment variables in Railway:');
  console.error('   - MONGODB_URI: Your MongoDB connection string');
  console.error('   - JWT_SECRET: A secure secret key (minimum 32 characters)');
  console.error('\n💡 You can set them in Railway dashboard under Variables tab');
  
  // In production, exit with error
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  } else {
    console.warn('⚠️  Running in development mode with missing environment variables');
  }
}

// Log environment configuration (without sensitive data)
console.log('🔧 Environment Configuration:');
console.log(`   - NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`   - PORT: ${process.env.PORT || 3000}`);
console.log(`   - MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Set' : '❌ Missing'}`);
console.log(`   - JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Missing'}`);
console.log(`   - CORS_ORIGIN: ${process.env.CORS_ORIGIN || 'Not set (using defaults)'}`);
console.log(`   - FRONTEND_URL: ${process.env.FRONTEND_URL || 'Not set'}`);

const connectDB = require('./server/src/config/db');
const errorHandler = require('./server/src/api/middleware/errorHandler');
const { migrateExistingUsers } = require('./server/utils/migrateExistingUsers');
const config = require('./server/config/environment');
const { HTTP_STATUS, ERROR_MESSAGES } = require('./server/constants');

// Analytics middleware
const {
  trackUserAction,
  trackApiUsage,
  trackPropertyView,
  trackSearch,
  trackAuthEvents,
  trackErrors,
  trackPerformance
} = require('./server/src/middleware/analytics');

// Initialize Next.js app
const dev = process.env.NODE_ENV !== 'production';
let nextApp;
let nextHandler = null;

try {
  // Try to load Next.js config if it exists
  let nextConfig = null;
  try {
    nextConfig = require('./new-nextjs-app/next.config.js');
  } catch (configError) {
    console.log('⚠️  Next.js config file not found or invalid, using defaults');
  }

  nextApp = next({ 
    dev, 
    dir: './new-nextjs-app',
    ...(nextConfig && { conf: nextConfig })
  });
} catch (nextInitError) {
  console.error('❌ Failed to initialize Next.js:', nextInitError.message);
  console.log('⚠️  Continuing without Next.js (some features may not work)');
  nextApp = null;
}

// Initialize Express app
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
}, 3000); // Wait 3 seconds for DB connection to stabilize

// Configure paths
const uploadsDir = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
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
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // In production, allow Railway domain and any configured origins
    const allowedOrigins = [
      'https://urban-realty-production.up.railway.app',
      'https://www.squarefooot.com',
      'https://squarefooot.com',
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // For development, allow all origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(cookieParser());
app.use(express.json({ limit: config.upload.maxFileSize }));
app.use(express.urlencoded({ extended: true, limit: config.upload.maxFileSize }));

// Analytics middleware
app.use(trackUserAction);
app.use(trackApiUsage);
app.use(trackPropertyView);
app.use(trackSearch);
app.use(trackAuthEvents);
app.use(trackPerformance);

// Static files - enhanced with proper headers
const fileUploadService = require('./server/services/fileUploadService');
fileUploadService.serveStaticFiles(app);

// API Routes
app.use('/api/v1/auth', require('./server/src/api/routes/authRoutes'));
app.use('/api/v1/properties', require('./server/src/api/routes/propertyRoutes'));
app.use('/api/v1/contacts', require('./server/src/api/routes/contactRoutes'));
app.use('/api/v1/admin', require('./server/src/api/routes/adminRoutes'));
app.use('/api/v1/subscriptions', require('./server/src/api/routes/subscriptionRoutes'));
app.use('/api/v1/analytics', require('./server/src/api/routes/analyticsRoutes'));
app.use('/api/v1/agent', require('./server/src/api/routes/agentRoutes'));
app.use('/media', require('./server/src/api/routes/mediaRoutes'));
app.use('/api/v1/projects', require('./server/routes/projectRoutes'));
app.use('/api/v1/developers', require('./server/src/api/routes/developerRoutes'));

// Health endpoints
app.get('/api/v1/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({ 
    status: 'healthy',
    environment: config.env,
    uploadsPath: uploadsDir,
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    nodeVersion: process.version,
    memory: process.memoryUsage()
  });
});

app.get('/api/v1/test', (req, res) => {
  res.status(HTTP_STATUS.OK).json({ 
    status: 'success',
    message: 'API is working',
    environment: config.env,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Debug endpoint to check environment variables
app.get('/api/v1/debug', (req, res) => {
  res.status(200).json({
    status: 'debug',
    environment: config.env,
    database: {
      connected: mongoose.connection.readyState === 1,
      state: mongoose.connection.readyState,
      name: mongoose.connection.name
    },
    envVars: {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
      JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
      RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT || 'Not set'
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use(trackErrors);
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Prepare Next.js if available
    if (nextApp) {
      try {
        await nextApp.prepare();
        nextHandler = nextApp.getRequestHandler();
        console.log('✅ Next.js app prepared');
      } catch (nextError) {
        console.error('❌ Failed to build Next.js:', nextError.message);
        console.log('⚠️  Continuing with server startup (some features may not work)');
        nextHandler = null;
      }
    } else {
      console.log('⚠️  Next.js not initialized, serving API only');
    }

    // Handle all other routes with Next.js (but not API routes)
    app.all('*', (req, res) => {
      // Skip API routes - they should be handled by Express
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ 
          success: false, 
          error: 'API endpoint not found',
          path: req.path 
        });
      }
      
      // If Next.js is not available, serve a basic response
      if (!nextHandler || !nextApp) {
        return res.status(200).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Urban Realty</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
            </head>
            <body>
              <h1>Urban Realty</h1>
              <p>Server is running. API is available at <a href="/api/v1/health">/api/v1/health</a></p>
              <p>Next.js frontend is not available at this time.</p>
            </body>
          </html>
        `);
      }
      
      // Safely call nextHandler
      try {
        return nextHandler(req, res);
      } catch (handlerError) {
        console.error('❌ Error in Next.js request handler:', handlerError.message);
        return res.status(500).send(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Urban Realty - Error</title>
              <meta charset="utf-8">
            </head>
            <body>
              <h1>Urban Realty</h1>
              <p>Frontend error occurred. API is available at <a href="/api/v1/health">/api/v1/health</a></p>
            </body>
          </html>
        `);
      }
    });

    const PORT = process.env.PORT || 3000;
    const HOST = process.env.HOSTNAME || '0.0.0.0';
    
    // Create server with better error handling
    const server = app.listen(PORT, HOST, () => {
      console.log(`🚀 Server running in ${config.env} mode on port ${PORT}`);
      console.log(`📁 Uploads directory: ${uploadsDir}`);
      console.log(`🌐 Application ready at http://${HOST}:${PORT}`);
      
      // Signal PM2 that the app is ready
      if (process.send) {
        process.send('ready');
      }
    });

    // Enhanced error handling for Railway
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

    // Graceful shutdown with Railway compatibility
    const gracefulShutdown = (signal) => {
      console.log(`${signal} received, shutting down gracefully`);
      server.close((err) => {
        if (err) {
          console.error('Error during shutdown:', err);
          process.exit(1);
        }
        console.log('Process terminated');
        process.exit(0);
      });
      
      // Force exit after 10 seconds
      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  
  // Don't exit immediately in production - log and continue
  // This prevents the server from crashing on Next.js errors
  if (err.message && err.message.includes('requestHandler')) {
    console.error('⚠️  Next.js requestHandler error - this is likely a Next.js initialization issue');
    console.error('⚠️  Server will continue running but Next.js routes may not work');
    return; // Don't exit, let the server continue
  }
  
  // For other critical errors, exit after a delay
  if (process.env.NODE_ENV === 'production') {
    console.error('⚠️  Critical error in production, exiting in 5 seconds...');
    setTimeout(() => process.exit(1), 5000);
  } else {
    process.exit(1);
  }
});

// Start the server with a small delay to ensure DB connection
setTimeout(() => {
  startServer();
}, 2000); // Wait 2 seconds for DB connection to establish