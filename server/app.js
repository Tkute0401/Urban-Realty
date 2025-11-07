const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
// Replace the current app.use(cors()) with:
// app.use(cors({
//   origin: [
//     'https://urban-realty-production.up.railway.app',
//     'http://localhost:5173',
//     'https://www.squarefooot.com',
//     'https://www.squarefooot.online'
//   ],
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true // If you're using cookies/sessions
// }));
app.use(cors({
  origin: true,
  credentials: true // If you're using cookies/sessions
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const blogRoutes = require('./routes/blogRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/blogs', blogRoutes);
console.log('✅ Blog routes mounted at /api/blogs');

// Mount v1 routes for API versioning
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/contacts', contactRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use('/api/v1/blogs', blogRoutes);
console.log('✅ Blog routes mounted at /api/v1/blogs');

// Health check routes
app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState
    },
    version: process.env.npm_package_version || '1.0.0'
  });
});

app.get('/api/v1/health', (req, res) => {
  const mongoose = require('mongoose');
  
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: {
      connected: mongoose.connection.readyState === 1,
      readyState: mongoose.connection.readyState
    },
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Squarefooot API is working!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

module.exports = app;
