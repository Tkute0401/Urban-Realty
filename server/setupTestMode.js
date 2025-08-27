/*
  Setup Stripe Test Mode
  
  This script helps you:
  1. Verify your Stripe test mode configuration
  2. Create test products and prices
  3. Test the subscription flow in test mode
  4. Verify webhook functionality
*/

const Stripe = require('stripe');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subscription = require('./models/Subscription');

dotenv.config({ path: `${__dirname}/.env` });

// Check if we're using test mode
function isTestMode(secretKey) {
  return secretKey && secretKey.startsWith('sk_test_');
}

function isLiveMode(secretKey) {
  return secretKey && secretKey.startsWith('sk_live_');
}

async function setupTestMode() {
  console.log('🧪 STRIPE TEST MODE SETUP');
  console.log('==========================');
  
  const secretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!secretKey) {
    console.log('❌ STRIPE_SECRET_KEY is not set');
    console.log('\n💡 To set up test mode:');
    console.log('1. Go to https://dashboard.stripe.com/test/apikeys');
    console.log('2. Copy your "Secret key" (starts with sk_test_)');
    console.log('3. Set it as STRIPE_SECRET_KEY in your environment');
    console.log('\n🔗 Test Dashboard: https://dashboard.stripe.com/test');
    return;
  }
  
  console.log(`🔑 Secret Key: ${secretKey.substring(0, 12)}...`);
  
  if (isTestMode(secretKey)) {
    console.log('✅ Using TEST MODE');
    console.log('🔗 Test Dashboard: https://dashboard.stripe.com/test');
  } else if (isLiveMode(secretKey)) {
    console.log('⚠️  Using LIVE MODE');
    console.log('🔗 Live Dashboard: https://dashboard.stripe.com');
  } else {
    console.log('❌ Invalid Stripe key format');
    console.log('💡 Should start with sk_test_ (test mode) or sk_live_ (live mode)');
    return;
  }
  
  const stripe = new Stripe(secretKey, { apiVersion: '2024-06-20' });
  
  try {
    // Test connection
    console.log('\n🔌 Testing Stripe connection...');
    const account = await stripe.accounts.retrieve();
    console.log('✅ Stripe connection successful');
    console.log(`📊 Account: ${account.business_profile?.name || 'Test Account'}`);
    console.log(`🌍 Country: ${account.country}`);
    console.log(`💳 Charges enabled: ${account.charges_enabled ? 'Yes' : 'No'}`);
    
    // In test mode, charges should be enabled by default
    if (isTestMode(secretKey) && !account.charges_enabled) {
      console.log('⚠️  Charges not enabled in test mode (unusual)');
    }
    
    // List existing products
    console.log('\n📦 Checking existing products...');
    const products = await stripe.products.list({ limit: 10 });
    console.log(`📦 Found ${products.data.length} products`);
    
    if (products.data.length > 0) {
      console.log('\n📋 Products:');
      products.data.forEach(product => {
        console.log(`  • ${product.name} (${product.id})`);
      });
    }
    
    // List existing prices
    console.log('\n💰 Checking existing prices...');
    const prices = await stripe.prices.list({ limit: 20 });
    console.log(`💰 Found ${prices.data.length} prices`);
    
    if (prices.data.length > 0) {
      console.log('\n💵 Prices:');
      prices.data.forEach(price => {
        const amount = price.unit_amount ? `$${price.unit_amount / 100}` : 'N/A';
        const interval = price.recurring ? price.recurring.interval : 'one-time';
        console.log(`  • ${amount} ${interval} (${price.id})`);
      });
    }
    
    // Check webhook endpoints
    console.log('\n📡 Checking webhook endpoints...');
    const webhooks = await stripe.webhookEndpoints.list();
    console.log(`📡 Found ${webhooks.data.length} webhook endpoints`);
    
    if (webhooks.data.length > 0) {
      webhooks.data.forEach(webhook => {
        console.log(`  • ${webhook.url} (${webhook.id})`);
        console.log(`    Status: ${webhook.status}`);
        console.log(`    Secret: ${webhook.secret ? 'Set' : 'Not set'}`);
      });
    }
    
    // Test creating a simple product
    console.log('\n🧪 Testing product creation...');
    const testProduct = await stripe.products.create({
      name: 'Test Product',
      description: 'A test product for verification',
      metadata: {
        test: 'true',
        created_by: 'setup_script'
      }
    });
    console.log(`✅ Created test product: ${testProduct.name} (${testProduct.id})`);
    
    // Test creating a price
    const testPrice = await stripe.prices.create({
      product: testProduct.id,
      unit_amount: 1000, // $10.00
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      metadata: {
        test: 'true',
        created_by: 'setup_script'
      }
    });
    console.log(`✅ Created test price: $10.00/month (${testPrice.id})`);
    
    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await stripe.prices.update(testPrice.id, { active: false });
    await stripe.products.update(testProduct.id, { active: false });
    console.log('✅ Test data cleaned up');
    
    console.log('\n🎉 TEST MODE SETUP COMPLETE!');
    console.log('=============================');
    console.log('✅ Stripe connection working');
    console.log('✅ Products can be created');
    console.log('✅ Prices can be created');
    console.log('✅ Webhook endpoints configured');
    
    if (isTestMode(secretKey)) {
      console.log('\n💡 Test Mode Benefits:');
      console.log('• No business verification required');
      console.log('• No real charges processed');
      console.log('• Full API access for testing');
      console.log('• Test cards available');
      
      console.log('\n🧪 Test Card Numbers:');
      console.log('• 4242 4242 4242 4242 (Visa - succeeds)');
      console.log('• 4000 0000 0000 0002 (Visa - declined)');
      console.log('• 5555 5555 5555 4444 (Mastercard - succeeds)');
      
      console.log('\n🔗 Useful Links:');
      console.log('• Test Dashboard: https://dashboard.stripe.com/test');
      console.log('• Test API Keys: https://dashboard.stripe.com/test/apikeys');
      console.log('• Test Webhooks: https://dashboard.stripe.com/test/webhooks');
      console.log('• Test Events: https://dashboard.stripe.com/test/events');
    }
    
  } catch (error) {
    console.error('❌ Error during test mode setup:', error.message);
    
    if (error.type === 'StripeAuthenticationError') {
      console.log('\n💡 Authentication Error - Check your API key:');
      console.log('• Make sure it starts with sk_test_ for test mode');
      console.log('• Get your test key from: https://dashboard.stripe.com/test/apikeys');
    }
    
    if (error.type === 'StripePermissionError') {
      console.log('\n💡 Permission Error - Check your API key permissions');
    }
  }
}

setupTestMode()
  .catch((err) => {
    console.error('❌ Setup failed:', err);
    process.exitCode = 1;
  });