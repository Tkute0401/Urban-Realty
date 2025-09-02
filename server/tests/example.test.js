// Example test file to verify testing framework
const { testUtils } = global;

describe('Test Framework Setup', () => {
  test('should have test utilities available', () => {
    expect(testUtils).toBeDefined();
    expect(testUtils.createTestUser).toBeDefined();
    expect(testUtils.createTestProperty).toBeDefined();
  });

  test('should create test user with default values', () => {
    const user = testUtils.createTestUser();
    expect(user.name).toBe('Test User');
    expect(user.email).toBe('test@example.com');
    expect(user.role).toBe('user');
  });

  test('should create test property with default values', () => {
    const property = testUtils.createTestProperty();
    expect(property.title).toBe('Test Property');
    expect(property.price).toBe(100000);
    expect(property.propertyType).toBe('house');
  });

  test('should override default values when provided', () => {
    const user = testUtils.createTestUser({ name: 'Custom User', role: 'admin' });
    expect(user.name).toBe('Custom User');
    expect(user.role).toBe('admin');
    expect(user.email).toBe('test@example.com'); // Default value
  });
});
