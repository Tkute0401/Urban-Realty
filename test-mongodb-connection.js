const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('🔌 Testing MongoDB connection...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connected');
    console.log('📊 Connection state:', mongoose.connection.readyState);
    console.log('🖥️  Host:', mongoose.connection.host);
    console.log('📁 Database:', mongoose.connection.name);
    
    // Test subscription query
    const Subscription = require('./server/models/Subscription');
    
    console.log('\n🔍 Querying subscriptions...');
    const subscriptions = await Subscription.find({ isActive: true });
    
    console.log(`✅ Found ${subscriptions.length} subscriptions:`);
    subscriptions.forEach(sub => {
      console.log(`  📋 ${sub.name} (ID: ${sub._id}, Type: ${sub.type}): ₹${sub.price}/${sub.billingCycle}`);
    });
    
    // Test the exact same query used in the controller
    console.log('\n⏱️ Testing with timeout like in controller...');
    const subWithTimeout = await Subscription.find({ isActive: true }).timeout(3000);
    console.log(`✅ Query with timeout found ${subWithTimeout.length} subscriptions`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    console.log('\n🔚 Closing connection...');
    mongoose.connection.close();
    process.exit(0);
  }
}

testConnection();