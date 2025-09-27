#!/usr/bin/env node

/**
 * Unified server for Urban Realty
 * This server combines Express API and Next.js frontend
 */

require('dotenv').config();
const express = require('express');
const next = require('next');
const cors = require('cors');
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
  process.exit(1);
}

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
const nextApp = next({ 
  dev, 
  dir: './new-nextjs-app',
  conf: require('./new-nextjs-app/next.config.js')
});
const nextHandler = nextApp.getRequestHandler();

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
  origin: config.cors.origin,
  credentials: true
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

// API Routes
app.use('/api/v1/auth', require('./server/src/api/routes/authRoutes'));
app.use('/api/v1/properties', require('./server/src/api/routes/propertyRoutes'));
app.use('/api/v1/contacts', require('./server/src/api/routes/contactRoutes'));
app.use('/api/v1/admin', require('./server/src/api/routes/adminRoutes'));
app.use('/api/v1/subscriptions', require('./server/src/api/routes/subscriptionRoutes'));
app.use('/api/v1/analytics', require('./server/src/api/routes/analyticsRoutes'));
app.use('/api/v1/agent', require('./server/src/api/routes/agentRoutes'));
app.use('/media', require('./server/src/api/routes/mediaRoutes'));
app.use('/api/v1/developers', require('./server/src/api/routes/developerRoutes'));

// Health endpoints
app.get('/api/v1/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({ 
    status: 'healthy',
    environment: config.env,
    uploadsPath: uploadsDir,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/v1/test', (req, res) => {
  res.status(HTTP_STATUS.OK).json({ 
    status: 'success',
    message: 'API is working',
    environment: config.env
  });
});

// Error handling
app.use(trackErrors);
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Prepare Next.js
    await nextApp.prepare();
    console.log('✅ Next.js app prepared');

    // Handle all other routes with Next.js
    app.get('*', (req, res) => {
      return nextHandler(req, res);
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
  process.exit(1);
});

// Start the server with a small delay to ensure DB connection
setTimeout(() => {
  startServer();
}, 2000); // Wait 2 seconds for DB connection to establish