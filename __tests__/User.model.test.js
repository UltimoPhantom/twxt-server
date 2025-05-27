import { connect, clearDatabase, closeDatabase } from './setup.js';
import User from '../models/userModel.js';
import { jest } from '@jest/globals';
import mongoose from 'mongoose';

describe('User Model Test', () => {
  // Connect to the database before all tests
  beforeAll(async () => {
    await connect();
  });

  // Clear data after each test
  afterEach(async () => {
    await clearDatabase();
  });

  // Disconnect after all tests
  afterAll(async () => {
    await closeDatabase();
  });

  it('should create and save a user successfully', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!'
    };
    
    const validUser = new User(userData);
    const savedUser = await validUser.save();
    
    // Object Id should be defined when successfully saved to MongoDB
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
    // Password should be hashed and not match the original
    expect(savedUser.password).not.toBe(userData.password);
    expect(savedUser.createdAt).toBeDefined();
  });

  it('should fail to save a user without required fields', async () => {
    const userWithoutRequiredField = new User({ username: 'incomplete' });
    
    let err;
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  it('should not save duplicate email addresses', async () => {
    // Create and save a user
    const firstUser = new User({
      username: 'user1',
      email: 'duplicate@example.com',
      password: 'Password123!'
    });
    await firstUser.save();
    
    // Create a second user with same email
    const secondUser = new User({
      username: 'user2',
      email: 'duplicate@example.com',
      password: 'AnotherPass456!'
    });
    
    let err;
    try {
      await secondUser.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeDefined();
    expect(err.name).toBe('MongoServerError');
    expect(err.code).toBe(11000); // MongoDB duplicate key error code
  });
});
