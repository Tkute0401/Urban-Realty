module.exports = {
<<<<<<< HEAD
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
=======
  // Test environment
  testEnvironment: 'node',
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
>>>>>>> 8996dbf766572af12f78cd9ad6ab9fbd165f3ace
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/coverage/**',
    '!**/jest.config.js',
    '!**/server.js',
    '!**/app.js'
  ],
<<<<<<< HEAD
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
=======
  
  // Coverage thresholds
>>>>>>> 8996dbf766572af12f78cd9ad6ab9fbd165f3ace
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
<<<<<<< HEAD
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000,
  verbose: true
};
=======
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Test timeout
  testTimeout: 10000,
  
  // Clear mocks between tests
  clearMocks: true,
  
  // Restore mocks between tests
  restoreMocks: true,
  
  // Verbose output
  verbose: true,
  
  // Module paths
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  
  // Transform files
  transform: {},
  
  // Global variables
  globals: {
    'process.env.NODE_ENV': 'test'
  }
};
>>>>>>> 8996dbf766572af12f78cd9ad6ab9fbd165f3ace
