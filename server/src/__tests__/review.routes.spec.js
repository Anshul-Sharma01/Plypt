import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import { User } from '../models/user.model.js';

describe('Review API Integration', () => {
  let mongoServer;
  let token;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    // Register and login user
    const userRes = await request(app)
      .post('/api/v1/user/register')
      .field('name', 'Review User')
      .field('username', 'reviewuser')
      .field('email', 'reviewuser@example.com')
      .field('password', 'password123')
      .field('bio', 'Review bio');
    token = userRes.headers['set-cookie'];
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('should require auth to add review', async () => {
    const res = await request(app)
      .post('/api/v1/review/add/fakecraftorid/fakepromptid')
      .send({ comment: 'Nice', rating: 5 });
    expect(res.statusCode).toBe(401);
  });


}); 