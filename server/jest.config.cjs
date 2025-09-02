module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s'],
  transform: {},
  moduleFileExtensions: ['js', 'json'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js}', '!src/**/index.js'],
  coverageDirectory: 'coverage',
};
