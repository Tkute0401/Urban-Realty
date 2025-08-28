require('dotenv').config({ path: `${__dirname}/.env` });
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { migrateExistingUsers } = require('./utils/migrateExistingUsers');

const app = express();

// Connect to database
connectDB();

// Migrate existing users to ensure subscription status
setTimeout(async () => {
  try {
    await migrateExistingUsers();
  } catch (error) {
    console.error('Migration failed:', error);
  }
}, 5000); // Wait 5 seconds for DB connection to stabilize

// Configure paths
const uploadsDir = path.join(__dirname, 'uploads');
const clientDistDir = path.join(__dirname, '..', 'client', 'dist'); // Use relative path

// Create directories
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
  origin: true,
  credentials: true // If you're using cookies/sessions
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(clientDistDir)); // Serve React build

// API Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/properties', require('./routes/propertyRoutes'));
app.use('/api/v1/contacts', require('./routes/contactRoutes'));
app.use('/api/v1/admin', require('./routes/adminRoutes'));
app.use('/api/v1/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/media', require('./routes/mediaRoutes'));
app.use('/api/v1/developers', require('./routes/developerRoutes'))

// Health endpoints
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy',
    staticFilesPath: clientDistDir,
    uploadsPath: uploadsDir
  });
});

app.get('/api/v1/test', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'API is working',
    staticFiles: fs.existsSync(path.join(clientDistDir, 'index.html')) 
      ? 'Found' 
      : 'Not found'
  });
});

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

// Error handling
app.use(errorHandler);
app.use((req, res) => res.status(404).json({ success: false, error: 'Not found' }));

// Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`Serving static files from: ${clientDistDir}`);
  console.log(`Uploads directory: ${uploadsDir}`);
  
  // Verify frontend files
  console.log('Frontend files:', fs.readdirSync(clientDistDir));
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = server;