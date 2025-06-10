import { Router } from 'express';
import passport from '../config/googlePassport.js';
import jwt from 'jsonwebtoken';

const router = Router();

// Start Google OAuth
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    session: false
  })
);

// Handle Google OAuth callback
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: process.env.FRONTEND_URL + '/login',
    session: false
  }),
  async (req, res) => {
    try {
      const user = req.user;
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
      }
      
      // Generate access and refresh tokens
      const accessToken = jwt.sign(
        {
          _id: user._id,
          email: user.email,
          username: user.username,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d' }
      );
      const refreshToken = jwt.sign(
        {
          _id: user._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
      );

      // Save refreshToken to user in DB
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      // Redirect to frontend with both tokens
      const redirectUrl = `${process.env.FRONTEND_URL}/google-auth-success?token=${accessToken}&refreshToken=${refreshToken}`;
      res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google auth error:', error);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
    }
  }
);

export default router;