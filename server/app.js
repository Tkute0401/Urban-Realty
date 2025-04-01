const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// API Routes
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/contacts', contactRoutes);
app.use('/api/v1/admin', adminRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Test endpoint
app.get('/api/v1/test', (req, res) => {
  res.json({ message: 'Urban Realty API is working!' });
});

// Error handling middleware
app.use(errorHandler);
app.use((req, res) => res.status(404).json({ success: false, error: 'Not found' }));

module.exports = app;