/*
  Recreates Stripe webhook endpoint with a new secret.
  
  Requirements:
  - STRIPE_SECRET_KEY
*/

const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/.env` });

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is not set. Aborting.');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

async function recreateWebhook() {
  try {
    console.log('🔍 Checking existing webhook endpoints...');
    
    // List all webhook endpoints
    const webhookEndpoints = await stripe.webhookEndpoints.list();
    
    if (webhookEndpoints.data.length > 0) {
      console.log(`🗑️  Deleting ${webhookEndpoints.data.length} existing webhook endpoint(s)...`);
      
      for (const endpoint of webhookEndpoints.data) {
        console.log(`🗑️  Deleting webhook: ${endpoint.id} (${endpoint.url})`);
        await stripe.webhookEndpoints.del(endpoint.id);
        console.log(`✅ Deleted webhook: ${endpoint.id}`);
      }
    }
    
    console.log('\n🆕 Creating new webhook endpoint...');
    
    // Create new webhook endpoint
    const newEndpoint = await stripe.webhookEndpoints.create({
      url: 'https://urban-realty-production.up.railway.app/api/v1/payments/webhook',
      enabled_events: [
        'checkout.session.completed',
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',
        'invoice.paid',
        'invoice.payment_failed',
        'payment_intent.succeeded',
        'payment_intent.payment_failed'
      ],
      description: 'Urban Realty Production Webhook'
    });
    
    console.log('✅ Created new webhook endpoint successfully!');
    console.log(`🆔 ID: ${newEndpoint.id}`);
    console.log(`📡 URL: ${newEndpoint.url}`);
    console.log(`📊 Status: ${newEndpoint.status}`);
    console.log(`🔑 Secret: ${newEndpoint.secret}`);
    console.log(`📅 Created: ${new Date(newEndpoint.created * 1000).toISOString()}`);
    
    console.log('\n💡 IMPORTANT: Update your .env file with this webhook secret:');
    console.log(`STRIPE_WEBHOOK_SECRET=${newEndpoint.secret}`);
    
    console.log('\n📋 Enabled events:');
    newEndpoint.enabled_events.forEach(event => {
      console.log(`  • ${event}`);
    });
    
  } catch (error) {
    console.error('❌ Error recreating webhook:', error.message);
    process.exit(1);
  }
}

recreateWebhook()
  .then(() => {
    console.log('\n🎉 Webhook recreation completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed to recreate webhook:', error);
    process.exit(1);
  });