/*
  Comprehensive Stripe Integration Test
  
  This script tests:
  1. Stripe connection
  2. Products and prices creation
  3. Webhook endpoint verification
  4. Subscription creation flow
*/

const Stripe = require('stripe');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Subscription = require('./models/Subscription');
const User = require('./models/User');

dotenv.config({ path: `${__dirname}/.env` });

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is not set. Aborting.');
  process.exit(1);
}

if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not set. Aborting.');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

async function connectMongo() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🗄️  MongoDB Connected');
}

async function testStripeConnection() {
  console.log('\n🔌 Testing Stripe connection...');
  
  try {
    const account = await stripe.accounts.retrieve();
    console.log('✅ Stripe connection successful');
    console.log(`📊 Account: ${account.business_profile?.name || 'Unknown'}`);
    console.log(`🌍 Country: ${account.country}`);
    console.log(`💳 Charges enabled: ${account.charges_enabled ? 'Yes' : 'No'}`);
    console.log(`💳 Payouts enabled: ${account.payouts_enabled ? 'Yes' : 'No'}`);
    
    if (!account.charges_enabled) {
      console.log('⚠️  WARNING: Charges are not enabled on this account');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Stripe connection failed:', error.message);
    return false;
  }
}

async function testProductsAndPrices() {
  console.log('\n📦 Testing Products and Prices...');
  
  try {
    // List all products
    const products = await stripe.products.list({ limit: 10 });
    console.log(`📦 Found ${products.data.length} products in Stripe`);
    
    if (products.data.length === 0) {
      console.log('❌ No products found in Stripe');
      return false;
    }
    
    // List all prices
    const prices = await stripe.prices.list({ limit: 20 });
    console.log(`💰 Found ${prices.data.length} prices in Stripe`);
    
    // Check our subscription plans
    const plans = await Subscription.find({ isActive: true }).sort({ price: 1 });
    console.log(`📋 Found ${plans.length} subscription plans in database`);
    
    for (const plan of plans) {
      console.log(`\n📋 Plan: ${plan.name} (${plan.type})`);
      console.log(`   💰 Price: $${plan.price}`);
      
      if (plan.stripeProductId) {
        try {
          const product = await stripe.products.retrieve(plan.stripeProductId);
          console.log(`   ✅ Stripe Product: ${product.name} (${product.id})`);
        } catch (error) {
          console.log(`   ❌ Stripe Product not found: ${plan.stripeProductId}`);
        }
      } else {
        console.log(`   ❌ No Stripe Product ID`);
      }
      
      if (plan.stripePriceIdMonthly) {
        try {
          const price = await stripe.prices.retrieve(plan.stripePriceIdMonthly);
          console.log(`   ✅ Monthly Price: $${price.unit_amount / 100} (${price.id})`);
        } catch (error) {
          console.log(`   ❌ Monthly Price not found: ${plan.stripePriceIdMonthly}`);
        }
      } else {
        console.log(`   ❌ No Monthly Price ID`);
      }
      
      if (plan.stripePriceIdYearly) {
        try {
          const price = await stripe.prices.retrieve(plan.stripePriceIdYearly);
          console.log(`   ✅ Yearly Price: $${price.unit_amount / 100} (${price.id})`);
        } catch (error) {
          console.log(`   ❌ Yearly Price not found: ${plan.stripePriceIdYearly}`);
        }
      } else {
        console.log(`   ❌ No Yearly Price ID`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error testing products and prices:', error.message);
    return false;
  }
}

async function testWebhookEndpoint() {
  console.log('\n📡 Testing Webhook Endpoint...');
  
  try {
    const webhookEndpoints = await stripe.webhookEndpoints.list();
    
    if (webhookEndpoints.data.length === 0) {
      console.log('❌ No webhook endpoints found');
      return false;
    }
    
    console.log(`📡 Found ${webhookEndpoints.data.length} webhook endpoint(s):`);
    
    for (const endpoint of webhookEndpoints.data) {
      console.log(`\n📡 Endpoint: ${endpoint.url}`);
      console.log(`🆔 ID: ${endpoint.id}`);
      console.log(`📊 Status: ${endpoint.status}`);
      console.log(`🔑 Secret: ${endpoint.secret ? '✅ Set' : '❌ Not set'}`);
      console.log(`📅 Created: ${new Date(endpoint.created * 1000).toISOString()}`);
      
      if (endpoint.secret) {
        const envSecret = process.env.STRIPE_WEBHOOK_SECRET;
        const secretMatches = envSecret === endpoint.secret;
        console.log(`💡 Environment secret matches: ${secretMatches ? '✅ Yes' : '❌ No'}`);
        
        if (!secretMatches) {
          console.log('⚠️  Update your .env file with:');
          console.log(`STRIPE_WEBHOOK_SECRET=${endpoint.secret}`);
        }
      }
      
      console.log('📋 Enabled events:');
      endpoint.enabled_events.forEach(event => {
        console.log(`  • ${event}`);
      });
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error testing webhook endpoint:', error.message);
    return false;
  }
}

async function testSubscriptionFlow() {
  console.log('\n🔄 Testing Subscription Flow...');
  
  try {
    // Get a test user
    const testUser = await User.findOne({ email: { $regex: /test/i } }).limit(1);
    if (!testUser) {
      console.log('⚠️  No test user found, skipping subscription flow test');
      return true;
    }
    
    console.log(`👤 Test user: ${testUser.email} (${testUser._id})`);
    
    // Get a paid subscription plan
    const paidPlan = await Subscription.findOne({ 
      price: { $gt: 0 }, 
      isActive: true 
    });
    
    if (!paidPlan) {
      console.log('⚠️  No paid subscription plan found, skipping subscription flow test');
      return true;
    }
    
    console.log(`📋 Test plan: ${paidPlan.name} ($${paidPlan.price})`);
    
    // Check if user has Stripe customer ID
    if (!testUser.stripeCustomerId) {
      console.log('🆕 Creating Stripe customer for test user...');
      const customer = await stripe.customers.create({
        email: testUser.email,
        name: testUser.name,
        metadata: { userId: testUser._id.toString() }
      });
      
      testUser.stripeCustomerId = customer.id;
      await testUser.save();
      console.log(`✅ Created Stripe customer: ${customer.id}`);
    } else {
      console.log(`✅ User already has Stripe customer: ${testUser.stripeCustomerId}`);
    }
    
    // Test creating a checkout session
    if (paidPlan.stripePriceIdMonthly) {
      console.log('🛒 Testing checkout session creation...');
      
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer: testUser.stripeCustomerId,
        line_items: [
          { price: paidPlan.stripePriceIdMonthly, quantity: 1 }
        ],
        success_url: `${process.env.FRONTEND_URL || 'https://www.squarefooot.com'}/billing-dashboard?success=true`,
        cancel_url: `${process.env.FRONTEND_URL || 'https://www.squarefooot.com'}/subscriptions?canceled=true`,
        metadata: {
          userId: testUser._id.toString(),
          subscriptionId: paidPlan._id.toString(),
          billingCycle: 'monthly'
        }
      });
      
      console.log(`✅ Checkout session created: ${session.id}`);
      console.log(`🔗 Checkout URL: ${session.url}`);
      
      // Clean up the session (cancel it)
      await stripe.checkout.sessions.expire(session.id);
      console.log('🧹 Cleaned up test checkout session');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error testing subscription flow:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 STRIPE INTEGRATION TEST SUITE');
  console.log('=====================================');
  
  await connectMongo();
  
  const tests = [
    { name: 'Stripe Connection', fn: testStripeConnection },
    { name: 'Products and Prices', fn: testProductsAndPrices },
    { name: 'Webhook Endpoint', fn: testWebhookEndpoint },
    { name: 'Subscription Flow', fn: testSubscriptionFlow }
  ];
  
  const results = [];
  
  for (const test of tests) {
    console.log(`\n🧪 Running: ${test.name}`);
    const result = await test.fn();
    results.push({ name: test.name, passed: result });
  }
  
  console.log('\n📊 TEST RESULTS');
  console.log('================');
  
  let passed = 0;
  for (const result of results) {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${result.name}`);
    if (result.passed) passed++;
  }
  
  console.log(`\n📈 Summary: ${passed}/${results.length} tests passed`);
  
  if (passed === results.length) {
    console.log('🎉 All tests passed! Stripe integration is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the issues above.');
  }
}

runTests()
  .catch((err) => {
    console.error('❌ Test suite failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    try { await mongoose.connection.close(); } catch (_) {}
  });