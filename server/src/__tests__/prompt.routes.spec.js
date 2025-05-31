import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import { User } from '../models/user.model.js';
import { Craftor } from '../models/craftor.model.js';

describe('Prompt API Integration', () => {
  let mongoServer;
  let token;
  let craftorId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    // Create and login a user, activate craftor
    const userRes = await request(app)
      .post('/api/v1/user/register')
      .field('name', 'Prompt User')
      .field('username', 'promptuser')
      .field('email', 'promptuser@example.com')
      .field('password', 'password123')
      .field('bio', 'Prompt bio');
    const user = await User.findOne({ username: 'promptuser' });
    // Simulate login to get token (if your app uses JWT in cookies, adjust as needed)
    // Activate craftor profile
    await request(app)
      .post('/api/v1/craftor/activate')
      .set('Cookie', userRes.headers['set-cookie'])
      .send({ userPaymentDetails: { razorpayId: 'test_razorpay' } });
    // Save token/cookie for auth
    token = userRes.headers['set-cookie'];
    craftorId = user._id;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Clean up prompts, users, craftors
    await mongoose.connection.db.dropDatabase();
  });

  it('should not create a prompt without images', async () => {
    const res = await request(app)
      .post('/api/v1/prompt')
      .set('Cookie', token)
      .field('title', 'Test Prompt')
      .field('description', 'Test description')
      .field('content', 'Prompt content')
      .field('price', 10)
      .field('category', 'General')
      .field('model', 'gpt-4')
      .field('tags', JSON.stringify(['tag1', 'tag2']));
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('message');
  });


}); 