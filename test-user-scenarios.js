const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api/v1';

// Test scenarios for different user types
const testScenarios = {
  // Test user data for different roles
  testUsers: [
    {
      name: 'John Buyer',
      email: 'john.buyer@test.com',
      password: '123456',
      role: 'buyer',
      mobile: '+1234567890',
      occupation: 'Software Engineer'
    },
    {
      name: 'Jane Seller',
      email: 'jane.seller@test.com',
      password: '123456',
      role: 'individual_seller',
      mobile: '+1234567891',
      occupation: 'Business Owner'
    },
    {
      name: 'Mike Agent',
      email: 'mike.agent@test.com',
      password: '123456',
      role: 'agent',
      mobile: '+1234567892',
      reraId: 'RERA123456',
      professionalInfo: {
        licenseNumber: 'LIC12345',
        yearsOfExperience: 5,
        specializations: ['Residential', 'Commercial'],
        certifications: ['Licensed Real Estate Agent'],
        businessName: 'Mike\'s Realty',
        businessAddress: '123 Main St, City',
        businessPhone: '+1234567893',
        businessWebsite: 'https://mikesrealty.com'
      }
    },
    {
      name: 'Sarah Developer',
      email: 'sarah.developer@test.com',
      password: '123456',
      role: 'developer',
      mobile: '+1234567894',
      reraId: 'RERA789012',
      professionalInfo: {
        licenseNumber: 'DEV12345',
        yearsOfExperience: 10,
        specializations: ['Luxury Housing', 'Commercial Complex'],
        certifications: ['Licensed Developer'],
        businessName: 'Sarah Constructions',
        businessAddress: '456 Builder St, City',
        businessPhone: '+1234567895',
        businessWebsite: 'https://sarahconstructions.com'
      }
    },
    {
      name: 'Admin User',
      email: 'admin@test.com',
      password: '123456',
      role: 'admin',
      mobile: '+1234567896'
    }
  ]
};

class UserTester {
  constructor() {
    this.tokens = {};
  }

  async registerUser(userData) {
    try {
      console.log(`📝 Registering user: ${userData.name} (${userData.role})`);
      
      const response = await axios.post(`${BASE_URL}/auth/register`, userData);
      
      if (response.data.success) {
        console.log(`✅ Registration successful for ${userData.name}`);
        console.log(`📧 Email: ${userData.email}`);
        this.tokens[userData.email] = response.data.token;
        return { success: true, token: response.data.token, user: response.data.data };
      } else {
        console.log(`❌ Registration failed: ${response.data.error}`);
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      console.log(`❌ Registration error for ${userData.name}:`, error.response?.data?.error || error.message);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async loginUser(email, password) {
    try {
      console.log(`🔐 Logging in user: ${email}`);
      
      const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
      
      if (response.data.success) {
        console.log(`✅ Login successful for ${email}`);
        this.tokens[email] = response.data.token;
        return { success: true, token: response.data.token, user: response.data.data };
      } else {
        console.log(`❌ Login failed: ${response.data.error}`);
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      console.log(`❌ Login error for ${email}:`, error.response?.data?.error || error.message);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async getSubscriptionPlans() {
    try {
      console.log('💳 Getting subscription plans...');
      
      const response = await axios.get(`${BASE_URL}/subscriptions/`);
      
      if (response.data.success) {
        console.log(`✅ Found ${response.data.count} subscription plans`);
        response.data.data.forEach(plan => {
          console.log(`  📋 ${plan.name}: ₹${plan.price}/${plan.billingCycle}`);
        });
        return { success: true, plans: response.data.data };
      } else {
        console.log('❌ Failed to get subscription plans');
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      console.log('❌ Error getting subscription plans:', error.response?.data?.error || error.message);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async createRazorpayOrder(email, subscriptionId, billingCycle = 'monthly') {
    try {
      console.log(`💰 Creating Razorpay order for ${email}`);
      
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
        return { success: true, order: response.data };
      } else {
        console.log('❌ Failed to create Razorpay order');
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      console.log('❌ Error creating Razorpay order:', error.response?.data?.error || error.message);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async getUserSubscription(email) {
    try {
      console.log(`📊 Getting subscription for ${email}`);
      
      const token = this.tokens[email];
      if (!token) {
        console.log('❌ No token found for user');
        return { success: false, error: 'User not logged in' };
      }

      const response = await axios.get(`${BASE_URL}/subscriptions/my-subscription`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        console.log(`✅ Current subscription: ${response.data.data.status}`);
        return { success: true, subscription: response.data.data };
      } else {
        console.log('❌ Failed to get user subscription');
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      console.log('❌ Error getting user subscription:', error.response?.data?.error || error.message);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async getRazorpayKey() {
    try {
      console.log('🔑 Getting Razorpay public key...');
      
      // Try with any user token (since this should be accessible to authenticated users)
      const anyToken = Object.values(this.tokens)[0];
      const response = await axios.get(`${BASE_URL}/subscriptions/razorpay/key`, 
        { headers: { Authorization: `Bearer ${anyToken}` } }
      );
      
      if (response.data.success) {
        console.log(`✅ Razorpay key: ${response.data.key}`);
        return { success: true, key: response.data.key };
      } else {
        console.log('❌ Failed to get Razorpay key');
        return { success: false, error: response.data.error };
      }
    } catch (error) {
      console.log('❌ Error getting Razorpay key:', error.response?.data?.error || error.message);
      return { success: false, error: error.response?.data?.error || error.message };
    }
  }

  async runFullTest() {
    console.log('🚀 Starting comprehensive user testing...\n');
    
    // Test 1: Get subscription plans (public endpoint)
    console.log('=== TEST 1: Public Subscription Plans ===');
    await this.getSubscriptionPlans();
    console.log('\n');
    
    // Test 2: Register all user types
    console.log('=== TEST 2: User Registration ===');
    const registrationResults = [];
    for (const user of testScenarios.testUsers) {
      const result = await this.registerUser(user);
      registrationResults.push({ user, result });
    }
    console.log('\n');
    
    // Test 3: Login all users
    console.log('=== TEST 3: User Login ===');
    const loginResults = [];
    for (const user of testScenarios.testUsers) {
      const result = await this.loginUser(user.email, user.password);
      loginResults.push({ user, result });
    }
    console.log('\n');
    
    // Test 4: Get Razorpay key
    console.log('=== TEST 4: Razorpay Integration ===');
    await this.getRazorpayKey();
    console.log('\n');
    
    // Test 5: Check user subscriptions
    console.log('=== TEST 5: User Subscriptions ===');
    for (const user of testScenarios.testUsers.slice(0, 3)) { // Test first 3 users
      await this.getUserSubscription(user.email);
    }
    console.log('\n');
    
    // Test 6: Create payment orders for different users
    console.log('=== TEST 6: Payment Order Creation ===');
    const subscriptionPlans = await this.getSubscriptionPlans();
    if (subscriptionPlans.success && subscriptionPlans.plans.length > 1) {
      // Test with Basic plan (index 1)
      const basicPlan = subscriptionPlans.plans[1];
      console.log(`Testing payment with: ${basicPlan.name}`);
      
      // Test with different user types
      await this.createRazorpayOrder(testScenarios.testUsers[0].email, basicPlan._id, 'monthly');
      await this.createRazorpayOrder(testScenarios.testUsers[2].email, basicPlan._id, 'yearly');
    }
    console.log('\n');
    
    console.log('🎉 Comprehensive testing completed!');
  }
}

// Run the tests
const tester = new UserTester();
tester.runFullTest().catch(console.error);