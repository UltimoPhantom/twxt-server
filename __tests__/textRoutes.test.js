import request from 'supertest';
import { connect, clearDatabase, closeDatabase } from './setup.js';
import { createApp } from '../app.js';
import Text from '../models/Text.js';

// Create test server
const app = createApp();

describe('Text Routes Integration Tests', () => {
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

  describe('POST /api/texts', () => {
    it('should create a new text', async () => {
      const res = await request(app)
        .post('/api/texts')
        .send({ text_content: 'Test text via route' })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.text_content).toBe('Test text via route');
      expect(res.body.status).toBe('active');
      
      // Verify in database
      const savedText = await Text.findById(res.body._id);
      expect(savedText).toBeTruthy();
      expect(savedText.text_content).toBe('Test text via route');
    });
    
    it('should return 500 if text_content is missing', async () => {
      const res = await request(app)
        .post('/api/texts')
        .send({})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');
      
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });
  
  describe('GET /api/texts', () => {
    it('should retrieve all active texts', async () => {
      // Create test texts
      await new Text({ text_content: 'Active text 1' }).save();
      await new Text({ text_content: 'Active text 2' }).save();
      await new Text({ text_content: 'Archived text', status: 'archive' }).save();
      
      const res = await request(app)
        .get('/api/texts')
        .set('Accept', 'application/json');
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
      expect(res.body.length).toBe(2); // Only active texts
      expect(res.body[0].text_content).toMatch(/Active text/);
      expect(res.body[1].text_content).toMatch(/Active text/);
    });
  });
  
  describe('PATCH /api/texts/archive/:uuid', () => {
    it('should archive a text by uuid', async () => {
      // Create a text to archive
      const text = await new Text({ text_content: 'Text to archive via route' }).save();
      
      const res = await request(app)
        .patch(`/api/texts/archive/${text.uuid}`)
        .set('Accept', 'application/json');
      
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('archive');
      
      // Verify in database
      const archivedText = await Text.findById(text._id);
      expect(archivedText.status).toBe('archive');
    });
    
    it('should return 404 if text with uuid not found', async () => {
      const res = await request(app)
        .patch('/api/texts/archive/non-existent-uuid')
        .set('Accept', 'application/json');
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Text not found');
    });
  });
  
  describe('DELETE /api/texts/:id', () => {
    it('should delete a text by id', async () => {
      // Create a text to delete
      const text = await new Text({ text_content: 'Text to delete via route' }).save();
      
      const res = await request(app)
        .delete(`/api/texts/${text._id}`)
        .set('Accept', 'application/json');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Text deleted successfully');
      
      // Verify deletion in database
      const deletedText = await Text.findById(text._id);
      expect(deletedText).toBeNull();
    });
    
    it('should return 404 if text with id not found', async () => {
      // Generate a valid but non-existent ObjectId
      const fakeId = '5f7d5b3d9d3e7c2d2c5e5d5d';
      
      const res = await request(app)
        .delete(`/api/texts/${fakeId}`)
        .set('Accept', 'application/json');
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Text not found');
    });
  });
});
