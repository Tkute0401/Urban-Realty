require('dotenv').config({ path: `${__dirname}/.env` });
const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Configure paths
const uploadsDir = path.join(__dirname, 'uploads');
const clientDistDir = path.join(__dirname, '..', 'client', 'dist'); // Adjust based on your frontend location

// Create required directories
const createDirectories = () => {
  const directories = [uploadsDir];
  
  // Only try to create client directory if serving frontend
  if (process.env.SERVE_FRONTEND === 'true') {
    directories.push(clientDistDir);
  }

  directories.forEach(dir => {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`✓ Created directory: ${dir}`);
      }
    } catch (err) {
      console.error(`✗ Failed to create ${dir}:`, err);
      process.exit(1);
    }
  });
};

createDirectories();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(uploadsDir));

// Only serve frontend if configured to do so
if (process.env.SERVE_FRONTEND === 'true') {
  app.use(express.static(clientDistDir));
  
  // SPA Fallback Route (must be last)
  app.get('*', (req, res) => {
    const indexPath = path.join(clientDistDir, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      console.error('Frontend build not found at:', indexPath);
      res.status(500).json({
        success: false,
        error: 'Frontend assets not found'
      });
    }
  });
}

// Error handling middleware
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
  ==============================================
  🏡 Urban Realty Server
  ==============================================
  Environment: ${process.env.NODE_ENV || 'development'}
  Listening on: http://localhost:${PORT}
  Database: ${process.env.MONGO_URI ? 'Connected' : 'Not configured'}
  Uploads directory: ${uploadsDir}
  Serving frontend: ${process.env.SERVE_FRONTEND === 'true' ? 'Yes' : 'No'}
  ==============================================
  `);

  // Verify critical paths
  console.log('\n🔍 Path Verification:');
  console.log(`  ${fs.existsSync(uploadsDir) ? '✓' : '✗'} Uploads directory`);
  if (process.env.SERVE_FRONTEND === 'true') {
    console.log(`  ${fs.existsSync(clientDistDir) ? '✓' : '✗'} Client build`);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🔴 Received SIGTERM. Shutting down gracefully...');
  server.close(() => {
    console.log('🛑 Server terminated');
    process.exit(0);
  });
});

process.on('unhandledRejection', (err) => {
  console.error('⚠️ Unhandled rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = server;