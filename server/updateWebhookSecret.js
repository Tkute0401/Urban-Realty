/*
  Updates Stripe webhook endpoint with the correct secret from environment variables.
  
  Requirements:
  - STRIPE_SECRET_KEY
  - STRIPE_WEBHOOK_SECRET
*/

const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/.env` });

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is not set. Aborting.');
  process.exit(1);
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  console.error('❌ STRIPE_WEBHOOK_SECRET is not set. Aborting.');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

async function updateWebhookSecret() {
  try {
    console.log('🔍 Checking existing webhook endpoints...');
    
    // List all webhook endpoints
    const webhookEndpoints = await stripe.webhookEndpoints.list();
    
    if (webhookEndpoints.data.length === 0) {
      console.log('❌ No webhook endpoints found. Creating new one...');
      
      // Create new webhook endpoint
      const endpoint = await stripe.webhookEndpoints.create({
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
      
      console.log('✅ Created new webhook endpoint:', endpoint.id);
      console.log('🔑 New webhook secret:', endpoint.secret);
      console.log('💡 Update your .env file with this secret: STRIPE_WEBHOOK_SECRET=' + endpoint.secret);
      
    } else {
      console.log(`📡 Found ${webhookEndpoints.data.length} webhook endpoint(s):`);
      
      for (const endpoint of webhookEndpoints.data) {
        console.log(`\n📡 Endpoint: ${endpoint.url}`);
        console.log(`🆔 ID: ${endpoint.id}`);
        console.log(`📊 Status: ${endpoint.status}`);
        console.log(`📅 Created: ${endpoint.created}`);
        console.log(`📋 Description: ${endpoint.description}`);
        
        // Update the webhook endpoint with the correct secret
        console.log('\n🔄 Updating webhook endpoint with correct secret...');
        
        const updatedEndpoint = await stripe.webhookEndpoints.update(endpoint.id, {
          url: endpoint.url,
          enabled_events: endpoint.enabled_events,
          description: endpoint.description
        });
        
        console.log('✅ Webhook endpoint updated successfully');
        console.log('🔑 Current webhook secret:', updatedEndpoint.secret);
        console.log('💡 Your environment secret matches:', process.env.STRIPE_WEBHOOK_SECRET === updatedEndpoint.secret ? '✅ Yes' : '❌ No');
        
        if (process.env.STRIPE_WEBHOOK_SECRET !== updatedEndpoint.secret) {
          console.log('⚠️  You need to update your .env file with the new secret:');
          console.log('STRIPE_WEBHOOK_SECRET=' + updatedEndpoint.secret);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error updating webhook secret:', error.message);
    process.exit(1);
  }
}

updateWebhookSecret()
  .then(() => {
    console.log('\n🎉 Webhook secret update completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Failed to update webhook secret:', error);
    process.exit(1);
  });