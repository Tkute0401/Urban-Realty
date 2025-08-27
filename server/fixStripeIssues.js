/*
  Fix Stripe Integration Issues
  
  This script helps identify and fix common Stripe integration issues:
  1. Enable charges on Stripe account
  2. Update webhook secret
  3. Verify account status
*/

const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/.env` });

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is not set. Aborting.');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

async function checkAccountStatus() {
  console.log('🔍 Checking Stripe account status...');
  
  try {
    const account = await stripe.accounts.retrieve();
    
    console.log('\n📊 ACCOUNT STATUS');
    console.log('==================');
    console.log(`🏢 Business Name: ${account.business_profile?.name || 'Not set'}`);
    console.log(`🌍 Country: ${account.country}`);
    console.log(`💳 Charges Enabled: ${account.charges_enabled ? '✅ Yes' : '❌ No'}`);
    console.log(`💳 Payouts Enabled: ${account.payouts_enabled ? '✅ Yes' : '❌ No'}`);
    console.log(`📧 Email: ${account.email || 'Not set'}`);
    console.log(`📱 Phone: ${account.business_profile?.phone || 'Not set'}`);
    
    if (!account.charges_enabled) {
      console.log('\n⚠️  CHARGES NOT ENABLED');
      console.log('======================');
      console.log('❌ Your Stripe account cannot process payments because charges are not enabled.');
      console.log('💡 To enable charges, you need to complete the Stripe account verification process:');
      console.log('');
      console.log('1. Go to https://dashboard.stripe.com/account');
      console.log('2. Complete the "Account verification" section');
      console.log('3. Provide required business information:');
      console.log('   • Business details (name, address, phone)');
      console.log('   • Bank account for payouts');
      console.log('   • Identity verification');
      console.log('4. Wait for Stripe to review and approve your account');
      console.log('');
      console.log('🔗 Direct link: https://dashboard.stripe.com/account/onboarding');
    }
    
    if (!account.payouts_enabled) {
      console.log('\n⚠️  PAYOUTS NOT ENABLED');
      console.log('======================');
      console.log('❌ Your Stripe account cannot receive payouts.');
      console.log('💡 Complete the payout setup in your Stripe dashboard.');
    }
    
    return account;
  } catch (error) {
    console.error('❌ Error checking account status:', error.message);
    return null;
  }
}

async function fixWebhookSecret() {
  console.log('\n🔧 FIXING WEBHOOK SECRET');
  console.log('========================');
  
  try {
    const webhookEndpoints = await stripe.webhookEndpoints.list();
    
    if (webhookEndpoints.data.length === 0) {
      console.log('❌ No webhook endpoints found. Creating new one...');
      
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
      
      console.log('✅ Created new webhook endpoint');
      console.log(`🆔 ID: ${endpoint.id}`);
      console.log(`🔑 Secret: ${endpoint.secret}`);
      
      console.log('\n💡 IMPORTANT: Update your environment variables with:');
      console.log(`STRIPE_WEBHOOK_SECRET=${endpoint.secret}`);
      
    } else {
      const endpoint = webhookEndpoints.data[0];
      console.log(`📡 Found webhook endpoint: ${endpoint.id}`);
      
      if (!endpoint.secret) {
        console.log('❌ Webhook secret is missing. Recreating endpoint...');
        
        // Delete and recreate the endpoint
        await stripe.webhookEndpoints.del(endpoint.id);
        
        const newEndpoint = await stripe.webhookEndpoints.create({
          url: endpoint.url,
          enabled_events: endpoint.enabled_events,
          description: endpoint.description
        });
        
        console.log('✅ Recreated webhook endpoint');
        console.log(`🆔 ID: ${newEndpoint.id}`);
        console.log(`🔑 Secret: ${newEndpoint.secret}`);
        
        console.log('\n💡 IMPORTANT: Update your environment variables with:');
        console.log(`STRIPE_WEBHOOK_SECRET=${newEndpoint.secret}`);
        
      } else {
        console.log(`✅ Webhook secret is set: ${endpoint.secret}`);
        
        const envSecret = process.env.STRIPE_WEBHOOK_SECRET;
        if (envSecret !== endpoint.secret) {
          console.log('⚠️  Environment secret does not match webhook secret');
          console.log('💡 Update your environment variables with:');
          console.log(`STRIPE_WEBHOOK_SECRET=${endpoint.secret}`);
        } else {
          console.log('✅ Environment secret matches webhook secret');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error fixing webhook secret:', error.message);
  }
}

async function listProductsAndPrices() {
  console.log('\n📦 CURRENT PRODUCTS AND PRICES');
  console.log('==============================');
  
  try {
    const products = await stripe.products.list({ limit: 10 });
    const prices = await stripe.prices.list({ limit: 20 });
    
    console.log(`📦 Products: ${products.data.length}`);
    console.log(`💰 Prices: ${prices.data.length}`);
    
    if (products.data.length > 0) {
      console.log('\n📋 Products:');
      products.data.forEach(product => {
        console.log(`  • ${product.name} (${product.id})`);
      });
    }
    
    if (prices.data.length > 0) {
      console.log('\n💰 Prices:');
      prices.data.forEach(price => {
        const amount = price.unit_amount ? `$${price.unit_amount / 100}` : 'N/A';
        const interval = price.recurring ? price.recurring.interval : 'one-time';
        console.log(`  • ${amount} ${interval} (${price.id})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error listing products and prices:', error.message);
  }
}

async function runFix() {
  console.log('🔧 STRIPE INTEGRATION FIX');
  console.log('==========================');
  
  const account = await checkAccountStatus();
  await fixWebhookSecret();
  await listProductsAndPrices();
  
  console.log('\n📋 SUMMARY');
  console.log('==========');
  
  if (account) {
    if (!account.charges_enabled) {
      console.log('❌ CHARGES NOT ENABLED - This is the main issue!');
      console.log('💡 You must complete Stripe account verification to enable charges.');
      console.log('🔗 Go to: https://dashboard.stripe.com/account/onboarding');
    } else {
      console.log('✅ Charges are enabled');
    }
    
    if (!account.payouts_enabled) {
      console.log('⚠️  PAYOUTS NOT ENABLED - Complete payout setup');
    } else {
      console.log('✅ Payouts are enabled');
    }
  }
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('1. Complete Stripe account verification (if charges not enabled)');
  console.log('2. Update your environment variables with the webhook secret');
  console.log('3. Test the subscription flow again');
  console.log('4. Check Stripe dashboard for products and subscriptions');
}

runFix()
  .catch((err) => {
    console.error('❌ Fix failed:', err);
    process.exitCode = 1;
  });