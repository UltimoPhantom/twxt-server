import { createApp } from '../app.js';

export function setupTestServer() {
  return createApp();
}

// Add a dummy test to prevent the "Your test suite must contain at least one test" error
describe('Test server', () => {
  it('should set up the test server', () => {
    const app = setupTestServer();
    expect(app).toBeDefined();
  });
});
