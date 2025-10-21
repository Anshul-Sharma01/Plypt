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
                if (!user.avatar?.secure_url) {
                    const defaultAvatar = 'https://www.shutterstock.com/image-vector/purple-user-icon-circle-shadow-260nw-1285676917.jpg';
                    user.avatar = { 
                        secure_url: profile.photos[0]?.value || defaultAvatar
                    };
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

                const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkMSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6IzNCODJGNjtzdG9wLW9wYWNpdHk6MSIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM4QjVDRjY7c3RvcC1vcGFjaXR5OjEiIC8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9InVybCgjZ3JhZDEpIi8+PGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iMTUiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjkiLz48cGF0aCBkPSJNMjAgNzUgUTIwIDYwIDM1IDYwIEw2NSA2MCBRODA2MCA4MCA3NSBMODAgODUgUTgwIDkwIDc1IDkwIEwyNSA5MCBRIDA5MCAyMCA4NSBaIiBmaWxsPSJ3aGl0ZSIgb3BhY2l0eT0iMC45Ii8+PC9zdmc+';
                
                user = await User.create({
                    googleId: profile.id,
                    name: profile.displayName || username,
                    email,
                    avatar: {
                        secure_url: profile?.photos[0]?.value || defaultAvatar,
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