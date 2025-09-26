const axios = require('axios');

async function testAgentAPI() {
  const apiURL = 'http://localhost:3001';
  
  try {
    // First, login with provided credentials
    console.log('🔐 Testing login...');
    const loginResponse = await axios.post(`${apiURL}/api/v1/auth/login`, {
      email: 'gaurav@gmail.com',
      password: '123456'
    });
    
    if (loginResponse.data.success) {
      console.log('✅ Login successful');
      console.log(`User: ${loginResponse.data.user.name} (${loginResponse.data.user.role})`);
      
      const token = loginResponse.data.token;
      const userId = loginResponse.data.user.id;
      
      // Test agent endpoints
      const endpoints = [
        { name: 'Dashboard', path: '/api/v1/agent/dashboard' },
        { name: 'Analytics', path: '/api/v1/agent/analytics' },
        { name: 'Leads', path: '/api/v1/agent/leads' },
        { name: 'Properties', path: '/api/v1/agent/properties' }
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`\n📊 Testing ${endpoint.name} endpoint...`);
          const response = await axios.get(`${apiURL}${endpoint.path}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.data.success) {
            console.log(`✅ ${endpoint.name} endpoint working`);
            console.log(`Response keys: ${Object.keys(response.data.data || {}).join(', ')}`);
          } else {
            console.log(`❌ ${endpoint.name} endpoint returned success=false`);
            console.log(`Error: ${response.data.error || 'Unknown error'}`);
          }
        } catch (error) {
          console.log(`❌ ${endpoint.name} endpoint failed`);
          console.log(`Status: ${error.response?.status || 'Unknown'}`);
          console.log(`Error: ${error.response?.data?.error || error.message}`);
        }
      }
      
    } else {
      console.log('❌ Login failed');
      console.log(`Error: ${loginResponse.data.error || 'Unknown error'}`);
    }
    
  } catch (error) {
    console.log('❌ Request failed');
    console.log(`Error: ${error.message}`);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
  }
}

// Check if servers are running
async function checkServers() {
  try {
    const response = await axios.get('http://localhost:3001/api/v1/properties');
    console.log('✅ Backend server is running');
    return true;
  } catch (error) {
    console.log('❌ Backend server is not responding');
    return false;
  }
}

// Run the test
checkServers().then(serverOk => {
  if (serverOk) {
    testAgentAPI();
  } else {
    console.log('Please make sure the backend server is running on port 3001');
  }
});