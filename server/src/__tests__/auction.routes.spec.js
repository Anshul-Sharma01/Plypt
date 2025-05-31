import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import { User } from '../models/user.model.js';

describe('Auction API Integration', () => {
  let mongoServer;
  let token;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    // Register and login user
    const userRes = await request(app)
      .post('/api/v1/user/register')
      .field('name', 'Auction User')
      .field('username', 'auctionuser')
      .field('email', 'auctionuser@example.com')
      .field('password', 'password123')
      .field('bio', 'Auction bio');
    token = userRes.headers['set-cookie'];
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('should require auth to end auction', async () => {
    const res = await request(app)
      .post('/api/v1/auction/end/fakepromptid');
    expect(res.statusCode).toBe(401);
  });

  // Add more tests for end auction when promptId is available
}); 