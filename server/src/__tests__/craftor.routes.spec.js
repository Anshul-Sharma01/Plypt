import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import { User } from '../models/user.model.js';

describe('Craftor API Integration', () => {
  let mongoServer;
  let token;
  let slug;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    // Register and login user
    const userRes = await request(app)
      .post('/api/v1/user/register')
      .field('name', 'Craftor User')
      .field('username', 'craftoruser')
      .field('email', 'craftoruser@example.com')
      .field('password', 'password123')
      .field('bio', 'Craftor bio');
    token = userRes.headers['set-cookie'];
    // Activate craftor
    const activateRes = await request(app)
      .post('/api/v1/craftor/activate')
      .set('Cookie', token)
      .send({ userPaymentDetails: { razorpayId: 'test_razorpay' } });
    slug = activateRes.body.data.slug;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await mongoose.connection.db.dropDatabase();
  });

  it('should get craftor profile', async () => {
    const res = await request(app)
      .get(`/api/v1/craftor/get-profile/${slug}`)
      .set('Cookie', token);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('slug', slug);
  });

  it('should update payment details', async () => {
    const res = await request(app)
      .patch(`/api/v1/craftor/update-payment/${slug}`)
      .set('Cookie', token)
      .send({ paymentDetails: { razorpayId: 'updated_razorpay' } });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.paymentDetails.razorpayId).toBe('updated_razorpay');
  });

  it('should require auth for craftor endpoints', async () => {
    const res = await request(app)
      .post('/api/v1/craftor/activate')
      .send({ userPaymentDetails: { razorpayId: 'test_razorpay' } });
    expect(res.statusCode).toBe(401);
  });
}); 