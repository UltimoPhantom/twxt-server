import { connect, clearDatabase, closeDatabase } from './setup.js';
import { createText, getAllTexts, archiveText, deleteText } from '../controllers/textController.js';
import Text from '../models/Text.js';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';

// Mock request and response objects
const mockRequest = () => {
  const req = {};
  req.body = {};
  req.params = {};
  return req;
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Text Controller Tests', () => {
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

  describe('createText', () => {
    it('should create a new text successfully', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      req.body = { text_content: 'Test text content' };
      
      await createText(req, res);
      
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
      
      const jsonArg = res.json.mock.calls[0][0];
      expect(jsonArg.text_content).toBe('Test text content');
      
      // Verify the text was actually saved to the database
      const savedText = await Text.findById(jsonArg._id);
      expect(savedText).toBeTruthy();
      expect(savedText.text_content).toBe('Test text content');
    });
    
    it('should return 500 status on error', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      // Force an error by not providing required field
      req.body = {};
      
      await createText(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0].error).toBeDefined();
    });
  });

  describe('getAllTexts', () => {
    it('should retrieve all active texts', async () => {
      // Add some test data
      await new Text({ text_content: 'Test text 1' }).save();
      await new Text({ text_content: 'Test text 2' }).save();
      await new Text({ text_content: 'Archived text', status: 'archive' }).save();
      
      const req = mockRequest();
      const res = mockResponse();
      
      await getAllTexts(req, res);
      
      expect(res.json).toHaveBeenCalled();
      
      // Should only return active texts
      const texts = res.json.mock.calls[0][0];
      expect(texts.length).toBe(2);
      expect(texts[0].status).toBe('active');
      expect(texts[1].status).toBe('active');
    });
    
    it('should return 500 status on error', async () => {
      const req = mockRequest();
      const res = mockResponse();
        // Force an error by mocking Text.find to throw an error
      jest.spyOn(Text, 'find').mockImplementationOnce(() => {
        throw new Error('Database error');
      });
      
      await getAllTexts(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalled();
      expect(res.json.mock.calls[0][0].error).toBeDefined();
      
      // Mocks are automatically restored after each test
    });
  });
  
  describe('archiveText', () => {
    it('should archive a text successfully', async () => {
      // Create a text to archive
      const text = await new Text({ text_content: 'Text to archive' }).save();
      
      const req = mockRequest();
      const res = mockResponse();
      
      req.params = { uuid: text.uuid };
      
      await archiveText(req, res);
      
      expect(res.json).toHaveBeenCalled();
      
      // Check that the text was archived
      const updatedText = res.json.mock.calls[0][0];
      expect(updatedText.status).toBe('archive');
      
      // Verify in the database
      const archivedText = await Text.findById(text._id);
      expect(archivedText.status).toBe('archive');
    });
    
    it('should return 404 if text not found', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      req.params = { uuid: 'non-existent-uuid' };
      
      await archiveText(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Text not found' });
    });
  });
  
  describe('deleteText', () => {
    it('should delete a text successfully', async () => {
      // Create a text to delete
      const text = await new Text({ text_content: 'Text to delete' }).save();
      
      const req = mockRequest();
      const res = mockResponse();
      
      req.params = { id: text._id.toString() };
      
      await deleteText(req, res);
      
      expect(res.json).toHaveBeenCalled();
      
      // Check that response indicates successful deletion
      const response = res.json.mock.calls[0][0];
      expect(response.message).toBe('Text deleted successfully');
      
      // Verify deletion in the database
      const deletedText = await Text.findById(text._id);
      expect(deletedText).toBeNull();
    });
    
    it('should return 404 if text not found', async () => {
      const req = mockRequest();
      const res = mockResponse();
      
      req.params = { id: new mongoose.Types.ObjectId().toString() };
      
      await deleteText(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Text not found' });
    });
  });
});
