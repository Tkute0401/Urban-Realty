const mongoose = require('mongoose');
const config = require('../../config/environment');

const connectDB = async () => {
  try {
    // Log URI host (masked for security) 
    const uriHost = config.database.uri.includes('@') 
      ? config.database.uri.split('@')[1].split('/')[0]
      : 'localhost';
    console.log(`🔌 Attempting MongoDB connection to: ${uriHost}`);
    console.log(`🔧 Environment: ${config.env}`);
    console.log(`🔧 MongoDB URI length: ${config.database.uri.length}`);
    
    const conn = await mongoose.connect(config.database.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database state: ${mongoose.connection.readyState}`);
    console.log(`📊 Database name: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('🔧 URI host:', config.database.uri.includes('@') ? config.database.uri.split('@')[1].split('/')[0] : 'localhost');
    console.error('🔧 Error details:', {
      name: error.name,
      code: error.code,
      message: error.message
    });
    
    if (config.env === 'development') {
      console.warn('⚠️  Running in development mode without database. Some features may not work.');
      return; // Allow server to continue without database in development
    }
    console.error('💥 Exiting due to database connection failure in production');
    process.exit(1);
  }
};

module.exports = connectDB;
