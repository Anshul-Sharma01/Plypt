import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const socketAuthMiddleware = async (socket, next) => {
    try {
        console.log('🔐 Socket authentication middleware called for socket:', socket.id);
        
        // Get token from socket auth payload (sent from frontend)
        const token = socket.handshake.auth.token;
        
        console.log('Token exists:', !!token);
        
        if (!token) {
            console.log('❌ No token provided');
            return next(new Error("Authentication token required"));
        }

        // Verify the JWT token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log('✅ Token verified for user ID:', decodedToken._id);
        
        // Find user by ID
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        
        if (!user) {
            console.log('❌ User not found in database for ID:', decodedToken._id);
            return next(new Error("User not found"));
        }

        console.log('✅ User authenticated:', user.username);

        // Attach user to socket for use in event handlers
        socket.user = user;
        
        next();
    } catch (error) {
        console.error('❌ Socket authentication error:', error.message);
        
        if (error.name === "TokenExpiredError") {
            return next(new Error("Access token expired"));
        }
        
        return next(new Error("Authentication failed"));
    }
}; 