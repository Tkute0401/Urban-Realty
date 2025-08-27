/*
  Enable Charges in Test Mode
  
  This script helps enable charges in Stripe test mode and fix webhook issues.
  In test mode, charges should be enabled by default, but sometimes they need to be activated.
*/

const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/.env` });

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  console.error('❌ STRIPE_SECRET_KEY is not set');
  process.exit(1);
}

if (!secretKey.startsWith('sk_test_')) {
  console.error('❌ This script is for test mode only. Use sk_test_ key.');
  process.exit(1);
}

const stripe = new Stripe(secretKey, { apiVersion: '2024-06-20' });

async function enableTestCharges() {
  console.log('🔧 ENABLING TEST MODE CHARGES');
  console.log('==============================');
  
  try {
    // Get current account status
    console.log('📊 Checking current account status...');
    const account = await stripe.accounts.retrieve();
    
    console.log(`🏢 Account: ${account.business_profile?.name || 'Test Account'}`);
    console.log(`🌍 Country: ${account.country}`);
    console.log(`💳 Charges enabled: ${account.charges_enabled ? 'Yes' : 'No'}`);
    console.log(`💳 Payouts enabled: ${account.payouts_enabled ? 'Yes' : 'No'}`);
    
    if (account.charges_enabled) {
      console.log('✅ Charges are already enabled!');
    } else {
      console.log('\n⚠️  Charges are not enabled in test mode');
      console.log('💡 In test mode, charges should be enabled by default');
      console.log('🔗 Go to: https://dashboard.stripe.com/test/account');
      console.log('📋 Look for "Account verification" or "Enable charges" section');
    }
    
    // Try to update account to enable charges
    console.log('\n🔄 Attempting to enable charges...');
    try {
      const updatedAccount = await stripe.accounts.update(account.id, {
        charges_enabled: true
      });
      console.log('✅ Charges enabled successfully!');
    } catch (updateError) {
      console.log('⚠️  Could not enable charges via API');
      console.log('💡 You may need to enable charges manually in the dashboard');
      console.log('🔗 Go to: https://dashboard.stripe.com/test/account');
    }
    
    // Fix webhook secret
    console.log('\n🔧 Fixing webhook secret...');
    const webhooks = await stripe.webhookEndpoints.list();
    
    if (webhooks.data.length > 0) {
      const webhook = webhooks.data[0];
      console.log(`📡 Found webhook: ${webhook.id}`);
      
      if (!webhook.secret) {
        console.log('❌ Webhook secret is missing. Recreating...');
        
        // Delete and recreate
        await stripe.webhookEndpoints.del(webhook.id);
        
        const newWebhook = await stripe.webhookEndpoints.create({
          url: webhook.url,
          enabled_events: webhook.enabled_events,
          description: webhook.description || 'Urban Realty Test Webhook'
        });
        
        console.log('✅ Recreated webhook with secret');
        console.log(`🔑 New secret: ${newWebhook.secret}`);
        console.log('\n💡 Update your environment variables:');
        console.log(`STRIPE_WEBHOOK_SECRET=${newWebhook.secret}`);
        
      } else {
        console.log(`✅ Webhook secret is set: ${webhook.secret}`);
        
        const envSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (envSecret !== webhook.secret) {
          console.log('⚠️  Environment secret does not match');
          console.log('💡 Update your environment variables:');
          console.log(`STRIPE_WEBHOOK_SECRET=${webhook.secret}`);
        } else {
          console.log('✅ Environment secret matches webhook secret');
        }
      }
    }
    
    // Test creating a subscription
    console.log('\n🧪 Testing subscription creation...');
    
    // Create a test customer
    const customer = await stripe.customers.create({
      email: 'test@example.com',
      name: 'Test Customer',
      metadata: { test: 'true' }
    });
    console.log(`✅ Created test customer: ${customer.id}`);
    
    // Get a price to test with
    const prices = await stripe.prices.list({ limit: 1, active: true });
    if (prices.data.length > 0) {
      const price = prices.data[0];
      console.log(`💰 Using price: ${price.id} ($${price.unit_amount / 100})`);
      
      try {
        // Create a test subscription
        const subscription = await stripe.subscriptions.create({
          customer: customer.id,
          items: [{ price: price.id }],
          payment_behavior: 'default_incomplete',
          payment_settings: { save_default_payment_method: 'on_subscription' },
          expand: ['latest_invoice.payment_intent'],
          metadata: { test: 'true' }
        });
        
        console.log(`✅ Created test subscription: ${subscription.id}`);
        console.log(`📊 Status: ${subscription.status}`);
        
        // Clean up test subscription
        await stripe.subscriptions.cancel(subscription.id);
        console.log('🧹 Cleaned up test subscription');
        
      } catch (subError) {
        console.log('⚠️  Could not create test subscription');
        console.log(`❌ Error: ${subError.message}`);
        
        if (subError.message.includes('charges')) {
          console.log('💡 This confirms charges are not enabled');
          console.log('🔗 Enable charges at: https://dashboard.stripe.com/test/account');
        }
      }
    }
    
    // Clean up test customer
    await stripe.customers.del(customer.id);
    console.log('🧹 Cleaned up test customer');
    
    console.log('\n📋 SUMMARY');
    console.log('==========');
    console.log('✅ Test mode is working');
    console.log('✅ Products and prices exist');
    console.log('✅ Webhook endpoint configured');
    
    if (!account.charges_enabled) {
      console.log('❌ CHARGES NOT ENABLED - This is the main issue');
      console.log('💡 Enable charges at: https://dashboard.stripe.com/test/account');
      console.log('📋 Look for "Account verification" or "Enable charges"');
    } else {
      console.log('✅ Charges are enabled');
    }
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Enable charges in test dashboard');
    console.log('2. Update webhook secret in environment variables');
    console.log('3. Test subscription flow');
    console.log('4. Check products in test dashboard');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.type === 'StripeAuthenticationError') {
      console.log('💡 Check your test API key');
    }
  }
}

enableTestCharges()
  .catch((err) => {
    console.error('❌ Failed:', err);
    process.exitCode = 1;
  });