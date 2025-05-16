import app from "./app.js";
import http from "http";
import { connectDB } from "./config/db.js";
import { Server } from "socket.io";
import { registerBidHandlers } from "./socket/bidSocket.js";
import { registerChatHandlers } from "./socket/chatSocket.js";
import redisClient from "./config/redisClient.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

export const io = new Server(server, {
    cors : {
        origin : "*",
        methods : ["GET", "POST"]
    }
});

const subscriber = redisClient.duplicate();
await subscriber.connect();

io.on("connection", (socket) => {
    console.log("New Client connected : " + socket.id);

    registerBidHandlers(io, socket);
    registerChatHandlers(io, socket);

    socket.on("disconnect", () => {
        console.log("Client Disconnected : " + socket.id);
    })
    
})

await subscriber.pSubscribe("chat:*", ( message, channel ) => {
    const roomId = channel.split(":")[1];
    const msgObj = JSON.parse(message);
    io.to(roomId).emit("newMessage", msgObj);
})

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    })
})


