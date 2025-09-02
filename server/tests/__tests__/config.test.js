const config = require('../../config');

describe('Configuration', () => {
  test('should load configuration successfully', () => {
    expect(config).toBeDefined();
    expect(config.env).toBe('test');
  });

  test('should have required database configuration', () => {
    expect(config.database).toBeDefined();
    expect(config.database.uri).toBeDefined();
    expect(config.database.uri).toContain('urban-realty-test');
  });

  test('should have JWT configuration', () => {
    expect(config.jwt).toBeDefined();
    expect(config.jwt.secret).toBeDefined();
    expect(config.jwt.expire).toBeDefined();
  });

  test('should have email configuration', () => {
    expect(config.email).toBeDefined();
    expect(config.email.host).toBeDefined();
    expect(config.email.user).toBeDefined();
  });

  test('should have utility functions', () => {
    expect(typeof config.getDatabaseUri).toBe('function');
    expect(typeof config.getJwtSecret).toBe('function');
    expect(typeof config.isFeatureEnabled).toBe('function');
  });

  test('should return correct database URI', () => {
    const uri = config.getDatabaseUri();
    expect(uri).toBe(config.database.uri);
  });

  test('should return correct JWT secret', () => {
    const secret = config.getJwtSecret();
    expect(secret).toBe(config.jwt.secret);
  });

  test('should check feature flags correctly', () => {
    expect(config.isFeatureEnabled('swagger')).toBe(false);
    expect(config.isFeatureEnabled('metrics')).toBe(false);
  });

  test('should have test environment settings', () => {
    expect(config.isTest).toBe(true);
    expect(config.isDevelopment).toBe(false);
    expect(config.isProduction).toBe(false);
  });
});