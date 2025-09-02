const mongoose = require('mongoose');
const config = require('./index');

const connectDB = async () => {
  try {
    const options = {
      ...config.database.options,
      // Add connection event listeners
      bufferCommands: false,
      bufferMaxEntries: 0
    };

    await mongoose.connect(config.getDatabaseUri(), options);
    
    console.log(`✅ MongoDB Connected: ${config.env} environment`);
    
    // Connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('✅ MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('❌ Error closing MongoDB connection:', err);
        process.exit(1);
      }
    });

  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    if (config.isProduction) {
      process.exit(1);
    } else {
      console.warn('⚠️  Continuing without database connection in non-production environment');
    }
  }
};

module.exports = connectDB;