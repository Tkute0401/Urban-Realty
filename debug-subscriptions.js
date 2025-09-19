const mongoose = require('mongoose');
require('dotenv').config();

async function debugSubscriptions() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');
    
    const Subscription = require('./server/models/Subscription');
    
    console.log('\n🔍 All subscriptions:');
    const allSubs = await Subscription.find({});
    console.log(`Found ${allSubs.length} total subscriptions:`);
    allSubs.forEach(sub => {
      console.log(`  📋 ${sub.name} (ID: ${sub._id}), Active: ${sub.isActive}`);
    });
    
    console.log('\n🔍 Active subscriptions only:');
    const activeSubs = await Subscription.find({ isActive: true });
    console.log(`Found ${activeSubs.length} active subscriptions:`);
    activeSubs.forEach(sub => {
      console.log(`  📋 ${sub.name} (ID: ${sub._id}), Active: ${sub.isActive}`);
    });
    
    console.log('\n🔍 Subscriptions with no isActive filter:');
    const noFilterSubs = await Subscription.find();
    console.log(`Found ${noFilterSubs.length} subscriptions without filter:`);
    noFilterSubs.forEach(sub => {
      console.log(`  📋 ${sub.name} (ID: ${sub._id}), Active: ${sub.isActive}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

debugSubscriptions();