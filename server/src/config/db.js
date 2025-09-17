const mongoose = require('mongoose');
const config = require('../../config/environment');

const connectDB = async () => {
  try {
    // Log URI host (masked for security) 
    const uriHost = config.database.uri.includes('@') 
      ? config.database.uri.split('@')[1].split('/')[0]
      : 'localhost';
    console.log(`Attempting MongoDB connection to: ${uriHost}`);
    
    const conn = await mongoose.connect(config.database.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.error('URI host:', config.database.uri.includes('@') ? config.database.uri.split('@')[1].split('/')[0] : 'localhost');
    
    if (config.env === 'development') {
      console.warn('⚠️  Running in development mode without database. Some features may not work.');
      return; // Allow server to continue without database in development
    }
    process.exit(1);
  }
};

module.exports = connectDB;
