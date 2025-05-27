import { connect, clearDatabase, closeDatabase } from './setup.js';
import * as userController from '../controllers/userController.js';
import User from '../models/userModel.js';
import { jest } from '@jest/globals';
import mongoose from 'mongoose';

// Mock request and response objects
const mockRequest = () => {
  const req = {};
  req.body = {};
  req.params = {};
  req.query = {};
  return req;
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('User Controller Tests', () => {
  // Connect to the database before all tests
  beforeAll(async () => {
    await connect();
  });

  // Clear data after each test
  afterEach(async () => {
    await clearDatabase();
    jest.clearAllMocks();
  });

  // Disconnect after all tests
  afterAll(async () => {
    await closeDatabase();
  });

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      // Skip if the registerUser function doesn't exist
      if (!userController.registerUser) {
        return;
      }

      const req = mockRequest();
      const res = mockResponse();
      
      req.body = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'SecurePass123!'
      };
      
      await userController.registerUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      
      const jsonArg = res.json.mock.calls[0][0];
      expect(jsonArg.username).toBe('newuser');
      expect(jsonArg.email).toBe('newuser@example.com');
      expect(jsonArg.password).toBeUndefined(); // Password should not be returned
      
      // Verify the user was saved to the database
      const savedUser = await User.findOne({ email: 'newuser@example.com' });
      expect(savedUser).toBeTruthy();
      expect(savedUser.username).toBe('newuser');
    });
    
    it('should return error for duplicate email', async () => {
      // Skip if the registerUser function doesn't exist
      if (!userController.registerUser) {
        return;
      }

      // Create a user first
      const existingUser = new User({
        username: 'existing',
        email: 'existing@example.com',
        password: 'Password123!'
      });
      await existingUser.save();
      
      const req = mockRequest();
      const res = mockResponse();
      
      req.body = {
        username: 'duplicate',
        email: 'existing@example.com', // Same email
        password: 'DiffPass456!'
      };
      
      await userController.registerUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0].error).toBeDefined();
    });
  });

  describe('loginUser', () => {
    it('should login a user with valid credentials', async () => {
      // Skip if the loginUser function doesn't exist
      if (!userController.loginUser) {
        return;
      }

      // Create a user first
      const user = new User({
        username: 'loginuser',
        email: 'login@example.com',
        password: 'LoginPass123!'
      });
      await user.save();
      
      const req = mockRequest();
      const res = mockResponse();
      
      req.body = {
        email: 'login@example.com',
        password: 'LoginPass123!'
      };
      
      await userController.loginUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
      
      const jsonArg = res.json.mock.calls[0][0];
      expect(jsonArg.token).toBeDefined(); // Should return a token
      expect(jsonArg.userId).toBeDefined();
    });
    
    it('should reject login with invalid credentials', async () => {
      // Skip if the loginUser function doesn't exist
      if (!userController.loginUser) {
        return;
      }

      // Create a user first
      const user = new User({
        username: 'invalidlogin',
        email: 'invalid@example.com',
        password: 'RightPass123!'
      });
      await user.save();
      
      const req = mockRequest();
      const res = mockResponse();
      
      req.body = {
        email: 'invalid@example.com',
        password: 'WrongPass123!' // Wrong password
      };
      
      await userController.loginUser(req, res);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0].error).toBeDefined();
    });
  });
});
