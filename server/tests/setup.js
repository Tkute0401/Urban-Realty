// Test setup and teardown
// Note: Database connection tests will be added in Phase 2

// Global test utilities
global.testUtils = {
  // Helper to create test data
  createTestUser: (userData = {}) => {
    return {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
      ...userData
    };
  },
  
  // Helper to create test property
  createTestProperty: (propertyData = {}) => {
    return {
      title: 'Test Property',
      description: 'Test Description',
      price: 100000,
      location: 'Test Location',
      propertyType: 'house',
      ...propertyData
    };
  }
};
