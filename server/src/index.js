import app from "./app.js";
import http from "http";
import { connectDB } from "./config/db.js";
import { Server } from "socket.io";
import { registerBidHandlers } from "./socket/bidSocket.js";
import { registerChatHandlers } from "./socket/chatSocket.js";
import { socketAuthMiddleware } from "./middlewares/socketAuth.middleware.js";
import redisClient from "./config/redisClient.js";
import { Prompt } from "./models/prompt.model.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

console.log('🚀 Setting up Socket.io server...');
console.log('CORS origin:', process.env.FRONTEND_URL || "http://localhost:5173");

export const io = new Server(server, {
    cors : {
        origin : process.env.FRONTEND_URL || "http://localhost:5173",
        methods : ["GET", "POST"],
        credentials: true
    }
});

console.log('✅ Socket.io server created');

// Apply socket authentication middleware
io.use(socketAuthMiddleware);

console.log('✅ Authentication middleware applied');

const subscriber = redisClient.duplicate();
await subscriber.connect();

// Function to check for expired auctions on server startup
const checkExpiredAuctions = async () => {
    try {
        console.log('🔍 Checking for expired auctions on startup...');
        
        // Get all active auctions from Redis
        const keys = await redisClient.keys('auctionStart:*');
        
        for (const key of keys) {
            const promptId = key.split(':')[1];
            const startTime = await redisClient.get(key);
            
            if (startTime) {
                const startDate = new Date(startTime);
                const endTime = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // 2 hours
                const now = new Date();
                
                if (now >= endTime) {
                    console.log(`Auction for prompt ${promptId} should have ended, ending now...`);
                    const { handleAuctionEnd } = await import('./socket/bidSocket.js');
                    await handleAuctionEnd(io, promptId);
                }
            }
        }
        
        console.log('✅ Expired auctions check completed');
    } catch (error) {
        console.error('❌ Error checking expired auctions:', error);
    }
};

// Periodic check for expired auctions (every 5 minutes)
const startPeriodicAuctionCheck = () => {
    setInterval(async () => {
        try {
            const keys = await redisClient.keys('auctionStart:*');
            
            for (const key of keys) {
                const promptId = key.split(':')[1];
                const startTime = await redisClient.get(key);
                const auctionEnded = await redisClient.get(`auctionEnded:${promptId}`);
                
                if (startTime && !auctionEnded) {
                    const startDate = new Date(startTime);
                    const endTime = new Date(startDate.getTime() + (2 * 60 * 60 * 1000));
                    const now = new Date();
                    
                    if (now >= endTime) {
                        console.log(`Periodic check: Auction for prompt ${promptId} should have ended, ending now...`);
                        const { handleAuctionEnd } = await import('./socket/bidSocket.js');
                        await handleAuctionEnd(io, promptId);
                    }
                }
            }
        } catch (error) {
            console.error('Error in periodic auction check:', error);
        }
    }, 5 * 60 * 1000); // Check every 5 minutes
};

io.on("connection", (socket) => {
    console.log("✅ New Client connected : " + socket.id);
    console.log("👤 Authenticated user:", socket.user?.username || "Unknown");

    registerBidHandlers(io, socket);
    registerChatHandlers(io, socket);

    socket.on("disconnect", () => {
        console.log("❌ Client Disconnected : " + socket.id);
    })
    
});

// Handle authentication errors
io.on("connect_error", (error) => {
    console.log("❌ Socket authentication error:", error.message);
});

console.log('✅ Socket event handlers registered');

await subscriber.pSubscribe("chat:*", ( message, channel ) => {
    const roomId = channel.split(":")[1];
    const msgObj = JSON.parse(message);
    io.to(roomId).emit("newMessage", msgObj);
})

connectDB().then(async () => {
    // Check for expired auctions on startup
    await checkExpiredAuctions();
    
    // Start periodic auction check
    startPeriodicAuctionCheck();
    
    server.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
        console.log('📡 Socket.io server is ready for connections');
        console.log('⏰ Periodic auction check started');
    })
})


