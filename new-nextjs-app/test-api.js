// Simple API test script
const testAPI = async () => {
  try {
    console.log('Testing API endpoints...');
    
    // Test properties list
    const propertiesResponse = await fetch('http://localhost:3000/api/v1/properties');
    console.log('Properties API Status:', propertiesResponse.status);
    const propertiesData = await propertiesResponse.json();
    console.log('Properties Data:', propertiesData);
    
    // Test individual property
    const propertyResponse = await fetch('http://localhost:3000/api/v1/properties/68566b6b9b0fdb60e5cbcea4');
    console.log('Property API Status:', propertyResponse.status);
    const propertyData = await propertyResponse.json();
    console.log('Property Data:', propertyData);
    
  } catch (error) {
    console.error('API Test Error:', error);
  }
};

testAPI();
