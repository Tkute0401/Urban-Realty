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

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/admin', adminRoutes);

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Urban Realty API is working!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

module.exports = app;
