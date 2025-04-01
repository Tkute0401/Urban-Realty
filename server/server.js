require('dotenv').config({ path: `${__dirname}/.env` });
const express = require('express');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const app = require('./app'); // Import the configured Express app
const http = require('http');
const socketio = require('socket.io');
const errorHandler = require('./middleware/errorHandler');
const configureSocket = require('./config/socket'); // Optional for real-time features

// Connect to MongoDB
connectDB();

// Configure paths
const uploadsDir = path.join(__dirname, 'uploads');
const clientDistDir = path.join(__dirname, '..', 'client', 'dist'); // Adjusted path for typical React/Vue structure

// Create required directories
const createDirectories = () => {
  [uploadsDir, clientDistDir].forEach(dir => {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Directory created: ${dir}`);
      }
    } catch (err) {
      console.error(`Error creating ${dir}:`, err);
      process.exit(1);
    }
  });
};

createDirectories();

// Create HTTP server
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ["GET", "POST"]
  }
});

// Configure Socket.io (optional)
configureSocket(io);

// Serve static files
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(clientDistDir));

// Enhanced SPA Fallback with cache control
app.get('*', (req, res) => {
  const indexPath = path.join(clientDistDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.setHeader('Cache-Control', 'no-store');
    res.sendFile(indexPath);
  } else {
    console.error(`Frontend file not found at: ${indexPath}`);
    res.status(500).json({ 
      success: false,
      error: 'Frontend assets not found',
      path: indexPath
    });
  }
});

// Error handling (should be after all other middleware/routes)
app.use(errorHandler);

// Server startup
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
  =====================================================
  🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
  🔗 Base URL: http://localhost:${PORT}
  📁 Uploads directory: ${uploadsDir}
  🖥️  Serving client from: ${clientDistDir}
  🗄️  Database: ${process.env.MONGO_URI.split('@')[1] || 'Not configured'}
  =====================================================
  `);
  
  // Verify critical directories
  console.log('\n📂 Directory Verification:');
  [uploadsDir, clientDistDir].forEach(dir => {
    console.log(`  ${fs.existsSync(dir) ? '✅' : '❌'} ${dir}`);
  });
});

// Enhanced process error handling
process.on('unhandledRejection', (err) => {
  console.error(`💥 Unhandled Rejection: ${err.stack || err.message}`);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('🔴 Server terminated');
    process.exit(0);
  });
});

module.exports = server;