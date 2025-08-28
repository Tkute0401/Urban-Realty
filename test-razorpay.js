const { razorpay, validateRazorpayConfig } = require('./server/config/razorpay');

// Test Razorpay configuration
console.log('🧪 Testing Razorpay Integration...\n');

// Test 1: Configuration validation
console.log('1. Testing configuration validation...');
const isConfigValid = validateRazorpayConfig();
console.log(`   Configuration valid: ${isConfigValid ? '✅' : '❌'}`);

if (!isConfigValid) {
  console.log('   ⚠️  Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables');
  console.log('   💡 Copy from server/config/env.example and update with your actual values');
}

// Test 2: Razorpay instance
console.log('\n2. Testing Razorpay instance...');
try {
  if (razorpay && typeof razorpay.orders === 'object') {
    console.log('   ✅ Razorpay instance created successfully');
  } else {
    console.log('   ❌ Razorpay instance not properly initialized');
  }
} catch (error) {
  console.log(`   ❌ Error creating Razorpay instance: ${error.message}`);
}

// Test 3: Environment variables check
console.log('\n3. Checking environment variables...');
const requiredVars = ['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_WEBHOOK_SECRET'];
let missingVars = 0;

requiredVars.forEach(varName => {
  if (process.env[varName]) {
    console.log(`   ✅ ${varName}: Set`);
  } else {
    console.log(`   ❌ ${varName}: Not set`);
    missingVars++;
  }
});

// Summary
console.log('\n📋 Summary:');
if (isConfigValid && missingVars === 0) {
  console.log('   🎉 Razorpay integration is ready to use!');
  console.log('   📖 Check RAZORPAY_INTEGRATION_README.md for usage instructions');
} else {
  console.log('   ⚠️  Some configuration is missing');
  console.log('   📖 Check RAZORPAY_INTEGRATION_README.md for setup instructions');
}

console.log('\n🔧 Next steps:');
console.log('   1. Set up your Razorpay account and get API keys');
console.log('   2. Configure environment variables');
console.log('   3. Test the payment flow with test credentials');
console.log('   4. Configure webhooks in Razorpay dashboard');
console.log('   5. Integrate frontend payment UI');

console.log('\n📚 Documentation:');
console.log('   - Razorpay Docs: https://razorpay.com/docs/');
console.log('   - Integration Guide: RAZORPAY_INTEGRATION_README.md');
console.log('   - API Reference: Check server/controllers/paymentController.js');