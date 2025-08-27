const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config({ path: './server/.env' });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

async function checkWebhookSecret() {
  try {
    console.log('🔍 Checking webhook endpoint details...');
    
    // List all webhook endpoints
    const webhookEndpoints = await stripe.webhookEndpoints.list();
    
    if (webhookEndpoints.data.length === 0) {
      console.log('❌ No webhook endpoints found');
      return;
    }
    
    console.log(`📡 Found ${webhookEndpoints.data.length} webhook endpoint(s):`);
    
    for (const endpoint of webhookEndpoints.data) {
      console.log(`\n📡 Endpoint: ${endpoint.url}`);
      console.log(`🆔 ID: ${endpoint.id}`);
      console.log(`📊 Status: ${endpoint.status}`);
      console.log(`🔑 Secret: ${endpoint.secret}`);
      console.log(`📅 Created: ${new Date(endpoint.created * 1000).toISOString()}`);
      
      // Get the webhook endpoint details
      const endpointDetails = await stripe.webhookEndpoints.retrieve(endpoint.id);
      console.log(`📋 Description: ${endpointDetails.description || 'No description'}`);
      
      // List enabled events
      console.log(`🎯 Enabled events (${endpoint.enabled_events.length}):`);
      endpoint.enabled_events.forEach(event => {
        console.log(`  - ${event}`);
      });
    }
    
    // Check if the secret in .env matches
    const envSecret = process.env.STRIPE_WEBHOOK_SECRET;
    console.log(`\n📝 Environment secret: ${envSecret}`);
    
    if (webhookEndpoints.data.length > 0) {
      const stripeSecret = webhookEndpoints.data[0].secret;
      console.log(`🔑 Stripe secret: ${stripeSecret}`);
      
      if (envSecret === stripeSecret) {
        console.log('✅ Secrets match!');
      } else {
        console.log('❌ Secrets do not match!');
        console.log('💡 You need to update your .env file with the correct secret.');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkWebhookSecret();