require('dotenv').config({ path: `${__dirname}/.env` });
const express = require('express');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const app = require('./app'); // Import the configured app

// Connect to database
connectDB();

// Configure paths
const uploadsDir = path.join(__dirname, 'uploads');
const clientDistDir = path.join(__dirname, 'client', 'dist');

// Create directories if they don't exist
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

// Serve static files
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(clientDistDir));

// SPA Fallback - MUST BE LAST ROUTE
app.get('*', (req, res) => {
  const indexPath = path.join(clientDistDir, 'index.html');
  if (fs.existsSync(indexPath)) {
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

// Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Serving static files from: ${clientDistDir}`);
  console.log(`Uploads directory: ${uploadsDir}`);
  
  // Verify frontend files
  if (fs.existsSync(clientDistDir)) {
    console.log('Frontend files available');
  } else {
    console.warn('Frontend build not found');
  }
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = server;