require('dotenv').config({ path: `${__dirname}/.env` });
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to database
connectDB();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created successfully');
  }
} catch (err) {
  console.error('Error creating uploads directory:', err);
  process.exit(1);
}

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(uploadsDir));

// Route files
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);

// Test route
app.get('/api/v1/test', (req, res) => {
  res.json({ 
    status: 'success',
    message: "API is working!",
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    database: 'connected',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

// Handle 404
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Uploads directory: ${uploadsDir}`);
});

module.exports = server;