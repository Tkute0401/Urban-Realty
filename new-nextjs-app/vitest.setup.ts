import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Global test setup
beforeAll(() => {
  // Any global setup before all tests
});

afterEach(() => {
  // Cleanup after each test
  vi.clearAllMocks();
});

afterAll(() => {
  // Any global cleanup after all tests
});

// Make Vitest globals available
declare global {
  var describe: typeof import('vitest').describe;
  var it: typeof import('vitest').it;
  var test: typeof import('vitest').test;
  var expect: typeof import('vitest').expect;
  var beforeAll: typeof import('vitest').beforeAll;
  var afterAll: typeof import('vitest').afterAll;
  var beforeEach: typeof import('vitest').beforeEach;
  var afterEach: typeof import('vitest').afterEach;
  var vi: typeof import('vitest').vi;
}