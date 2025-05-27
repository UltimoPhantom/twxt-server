import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Start MongoDB Memory Server
let mongoServer;

// Connect to the database before tests
export const connect = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  await mongoose.connect(uri);
};

// Clear all data between tests
export const clearDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
};

// Disconnect and close connection
export const closeDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  
  if (mongoServer) {
    await mongoServer.stop();
  }
};

// Add a dummy test to prevent the "Your test suite must contain at least one test" error
describe('Setup tests', () => {
  it('should set up mongo memory server', async () => {
    expect(true).toBe(true);
  });
});
