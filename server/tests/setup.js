<<<<<<< HEAD
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
=======
const mongoose = require('mongoose');
const config = require('../config');

// Set test environment
process.env.NODE_ENV = 'test';

// Global test setup
beforeAll(async () => {
  // Connect to test database
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(config.getDatabaseUri(), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
});

// Clean up after each test
afterEach(async () => {
  // Clear all collections
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Global test teardown
afterAll(async () => {
  // Close database connection
  await mongoose.connection.close();
});

// Global test utilities
global.testUtils = {
  // Create test user data
  createTestUser: (overrides = {}) => ({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    userType: 'buyer',
    ...overrides
  }),
  
  // Create test property data
  createTestProperty: (overrides = {}) => ({
    title: 'Test Property',
    description: 'Test property description',
    price: 100000,
    location: 'Test Location',
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    area: 1000,
    ...overrides
  }),
  
  // Wait for async operations
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Generate random email
  randomEmail: () => `test-${Date.now()}@example.com`,
  
  // Generate random string
  randomString: (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};

// Mock console methods in tests to reduce noise
const originalConsole = { ...console };
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Restore console after tests
afterAll(() => {
  global.console = originalConsole;
});
>>>>>>> 8996dbf766572af12f78cd9ad6ab9fbd165f3ace
