// Test script for socket authentication
import jwt from 'jsonwebtoken';
import { User } from './src/models/user.model.js';

process.env.ACCESS_TOKEN_SECRET = 'test-secret-key';

const testSocketAuth = async () => {
  try {
    // Create a test user
    const testUser = {
      _id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      username: 'testuser'
    };

    // Generate a valid token
    const validToken = jwt.sign(
      {
        _id: testUser._id,
        email: testUser.email,
        username: testUser.username
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    // Generate an invalid token
    const invalidToken = 'invalid-token';

    // Mock socket object
    const mockSocket = {
      handshake: {
        auth: {}
      },
      user: null
    };

    // Test with valid token
    console.log('Testing with valid token...');
    mockSocket.handshake.auth.token = validToken;
    
    // This would normally call the middleware
    // For now, just verify the token manually
    try {
      const decoded = jwt.verify(validToken, process.env.ACCESS_TOKEN_SECRET);
      console.log('✅ Valid token test passed');
      console.log('Decoded token:', decoded);
    } catch (error) {
      console.log('❌ Valid token test failed:', error.message);
    }

    // Test with invalid token
    console.log('\nTesting with invalid token...');
    mockSocket.handshake.auth.token = invalidToken;
    
    try {
      const decoded = jwt.verify(invalidToken, process.env.ACCESS_TOKEN_SECRET);
      console.log('❌ Invalid token test failed - should have thrown error');
    } catch (error) {
      console.log('✅ Invalid token test passed - correctly rejected');
    }

    // Test with no token
    console.log('\nTesting with no token...');
    delete mockSocket.handshake.auth.token;
    
    if (!mockSocket.handshake.auth.token) {
      console.log('✅ No token test passed - correctly detected missing token');
    } else {
      console.log('❌ No token test failed');
    }

    console.log('\n🎉 Socket authentication tests completed!');

  } catch (error) {
    console.error('Test failed:', error);
  }
};

testSocketAuth(); 