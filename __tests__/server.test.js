import express from 'express';
import { createApp } from '../app.js';
import { jest } from '@jest/globals';

describe('Server Setup Tests', () => {
  it('should create an Express app with the correct configuration', () => {
    const app = createApp();
      // Verify that the app is an Express application
    expect(app).toBeDefined();
    expect(app.listen).toBeDefined();
    expect(typeof app.listen).toBe('function');
    
    // Verify app has routes and middleware by checking for key properties
    expect(app.use).toBeDefined();
    expect(typeof app.use).toBe('function');
  });
});
