const axios = require('axios');

async function checkSubscriptions() {
  try {
    const response = await axios.get('http://localhost:3001/api/v1/subscriptions/');
    console.log('Available Subscription Plans:');
    response.data.data.forEach(plan => {
      console.log(`ID: ${plan._id}, Name: ${plan.name}, Price: Rs.${plan.price}`);
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkSubscriptions();