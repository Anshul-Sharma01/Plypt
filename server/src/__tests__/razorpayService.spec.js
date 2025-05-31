import razorpayService from '../utils/razorpayService.js';
import crypto from 'crypto';

describe('razorpayService.verifySignature', () => {
  it('should return true for a valid signature', () => {
    const body = JSON.stringify({ order_id: 'order_123', payment_id: 'pay_456' });
    const secret = process.env.RAZORPAY_KEY_SECRET || 'test_secret';
    const signature = crypto.createHmac('sha256', secret).update(body).digest('hex');
    expect(razorpayService.verifySignature(body, signature)).toBe(true);
  });

  it('should return false for an invalid signature', () => {
    const body = JSON.stringify({ order_id: 'order_123', payment_id: 'pay_456' });
    const signature = 'invalidsignature';
    expect(razorpayService.verifySignature(body, signature)).toBe(false);
  });
});

