import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import { User } from '../models/user.model.js';
import { Prompt } from '../models/prompt.model.js';

describe('Comment API Integration', () => {
  let mongoServer;
  let token;
  let promptId;
  let commentId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    // Register and login user
    const userRes = await request(app)
      .post('/api/v1/user/register')
      .field('name', 'Comment User')
      .field('username', 'commentuser')
      .field('email', 'commentuser@example.com')
      .field('password', 'password123')
      .field('bio', 'Comment bio');
    token = userRes.headers['set-cookie'];
    // Create prompt (simulate craftor activation if needed)
    // ... (for brevity, assume promptId is set after prompt creation)
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('should require auth to add comment', async () => {
    const res = await request(app)
      .post('/api/v1/comment/add')
      .send({ promptId: 'fakeid', content: 'Test comment' });
    expect(res.statusCode).toBe(401);
  });

  // Add more tests for add, delete, fetch when promptId is available
}); 