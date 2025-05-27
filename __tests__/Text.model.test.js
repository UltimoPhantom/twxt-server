import { connect, clearDatabase, closeDatabase } from './setup.js';
import Text from '../models/Text.js';
import mongoose from 'mongoose';

describe('Text Model Test', () => {
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

  it('should create and save a text successfully', async () => {
    const textData = { text_content: 'Test content' };
    const validText = new Text(textData);
    const savedText = await validText.save();
    
    // Object Id should be defined when successfully saved
    expect(savedText._id).toBeDefined();
    expect(savedText.uuid).toBeDefined();
    expect(savedText.text_content).toBe(textData.text_content);
    expect(savedText.status).toBe('active');
    expect(savedText.added_date).toBeDefined();
  });

  it('should fail to save a text without required field (text_content)', async () => {
    const textWithoutRequiredField = new Text({ });
    let err;
    
    try {
      await textWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.text_content).toBeDefined();
  });

  it('should generate a uuid automatically', async () => {
    const text1 = await new Text({ text_content: 'Test content 1' }).save();
    const text2 = await new Text({ text_content: 'Test content 2' }).save();
    
    expect(text1.uuid).toBeDefined();
    expect(text2.uuid).toBeDefined();
    expect(text1.uuid).not.toBe(text2.uuid);
  });
  it('should have correct default status of active', async () => {
    const text = await new Text({ text_content: 'Test content' }).save();
    expect(text.status).toBe('active');
  });
  
  it('should accept valid status values', async () => {
    const text = new Text({ 
      text_content: 'Test archive status',
      status: 'archive'
    });
    const savedText = await text.save();
    
    expect(savedText.status).toBe('archive');
  });
  
  it('should reject invalid status values', async () => {
    const textWithInvalidStatus = new Text({ 
      text_content: 'Invalid status',
      status: 'invalid-status'
    });
    
    let err;
    try {
      await textWithInvalidStatus.save();
    } catch (error) {
      err = error;
    }
    
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.status).toBeDefined();
  });
  
  it('should set added_date automatically', async () => {
    const beforeSave = new Date();
    const text = new Text({ text_content: 'Test added_date' });
    const savedText = await text.save();
    const afterSave = new Date();
    
    expect(savedText.added_date).toBeInstanceOf(Date);
    expect(savedText.added_date.getTime()).toBeGreaterThanOrEqual(beforeSave.getTime() - 100); // Allow small tolerance
    expect(savedText.added_date.getTime()).toBeLessThanOrEqual(afterSave.getTime() + 100);
  });
});
