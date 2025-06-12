import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model.js';
import { config } from 'dotenv';

config({ path: "./.env" });

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ['profile', 'email'],
    passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails[0]?.value;
        // console.log("Profile : ", profile);
        if (!email) {
            return done(null, false, { message: 'No email provided by Google' });
        }

        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            // Try to find user by email
            user = await User.findOne({ email });
            if (user) {
                // Link Google account to existing user
                user.googleId = profile.id;
                if (!user.avatar?.secure_url && profile.photos[0]?.value) {
                    user.avatar = { secure_url: profile.photos[0]?.value };
                }
                await user.save({ validateBeforeSave: false });
            } else {
                const username = email.split('@')[0];
                const existingUser = await User.findOne({ username });
                
                if (existingUser) {
                    // If username exists, try appending numbers
                    let newUsername = username;
                    let counter = 1;
                    while (await User.findOne({ username: newUsername })) {
                        newUsername = `${username}${counter++}`;
                    }
                    username = newUsername;
                }

                user = await User.create({
                    googleId: profile.id,
                    name: profile.displayName || username,
                    email,
                    avatar: {
                        secure_url: profile?.photos[0]?.value,
                    },
                    username,
                    bio: 'Google user',
                });
            }
        }
        
        done(null, user);
    } catch (err) {
        console.error('Google auth error:', err);
        done(err, null);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport; 