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

// Create directories
const uploadsDir = path.join(__dirname, 'uploads');
const clientDistDir = path.join(__dirname, '../../client/dist');

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

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(clientDistDir)); // Serve React build

// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/properties', require('./routes/propertyRoutes'));

// Health checks
app.get('/api/v1/health', (req, res) => res.status(200).json({ status: 'healthy' }));
app.get('/api/v1/test', (req, res) => res.json({ status: 'success' }));

// SPA Fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistDir, 'index.html'));
});

// Error handling
app.use(errorHandler);
app.use((req, res) => res.status(404).json({ success: false, error: 'Not found' }));

// Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Serving static files from: ${clientDistDir}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = server;