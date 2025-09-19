const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1';

class PaymentTester {
  constructor() {
    this.tokens = {};
  }

  async loginUser(email, password) {
    try {
      console.log(`🔐 Logging in: ${email}`);
      
      const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
      
      if (response.data.success) {
        console.log(`✅ Login successful`);
        this.tokens[email] = response.data.token;
        return { success: true, token: response.data.token, user: response.data.data };
      } else {
        console.log(`❌ Login failed: ${response.data.error}`);
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      console.log(`❌ Login error: ${error.response?.data?.error || error.message}`);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async createRazorpayOrder(email, subscriptionId, billingCycle = 'monthly') {
    try {
      console.log(`💰 Creating Razorpay order for ${email}`);
      console.log(`📋 Plan ID: ${subscriptionId}, Billing: ${billingCycle}`);
      
      const token = this.tokens[email];
      if (!token) {
        console.log('❌ No token found for user');
        return { success: false, error: 'User not logged in' };
      }

      const response = await axios.post(`${BASE_URL}/subscriptions/razorpay/order`, 
        { subscriptionId, billingCycle }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        console.log('✅ Razorpay order created successfully');
        console.log(`  📄 Order ID: ${response.data.orderId}`);
        console.log(`  💲 Amount: ₹${response.data.amount / 100}`);
        console.log(`  💱 Currency: ${response.data.currency}`);
        return { success: true, order: response.data };
      } else {
        console.log(`❌ Failed to create Razorpay order: ${response.data.error}`);
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      console.log(`❌ Error creating Razorpay order: ${error.response?.data?.error || error.message}`);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async testPaymentWithAllPlans(email) {
    console.log(`\n=== Testing Payment Orders for ${email} ===`);
    
    // Test with all subscription plans
    const plans = ['2', '3', '4']; // Basic, Premium, Enterprise
    const planNames = ['Basic Plan', 'Premium Plan', 'Enterprise Plan'];
    
    for (let i = 0; i < plans.length; i++) {
      console.log(`\n--- Testing ${planNames[i]} (ID: ${plans[i]}) ---`);
      
      // Test monthly billing
      await this.createRazorpayOrder(email, plans[i], 'monthly');
      
      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Test yearly billing
      await this.createRazorpayOrder(email, plans[i], 'yearly');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async runPaymentTests() {
    console.log('🚀 Starting Payment Flow Testing...\n');
    
    // Login test users
    const testEmails = [
      'john.buyer@test.com',
      'mike.agent@test.com',
      'sarah.developer@test.com'
    ];
    
    for (const email of testEmails) {
      const loginResult = await this.loginUser(email, '123456');
      if (!loginResult.success) {
        console.log(`⚠️ Skipping payment tests for ${email} - login failed`);
        continue;
      }
      
      await this.testPaymentWithAllPlans(email);
    }
    
    console.log('\n🎉 Payment flow testing completed!');
  }
}

// Run the payment tests
const tester = new PaymentTester();
tester.runPaymentTests().catch(console.error);