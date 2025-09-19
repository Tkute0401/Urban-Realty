const axios = require('axios');

axios.get('http://localhost:3001/api/v1/subscriptions/')
  .then(response => {
    console.log('Response:', JSON.stringify(response.data, null, 2));
  })
  .catch(error => {
    console.error('Error:', error.response?.data || error.message);
  });