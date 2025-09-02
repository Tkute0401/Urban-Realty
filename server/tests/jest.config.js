module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s'],
  transform: {},
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/../**/*.js',
    '!<rootDir>/../public/**',
    '!<rootDir>/**'
  ],
  coverageDirectory: '<rootDir>/coverage'
};
