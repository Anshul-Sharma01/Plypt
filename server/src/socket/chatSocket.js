import redisClient from "../config/redisClient.js";
import { Message } from "../models/message.model.js";

export const registerChatHandlers = (io, socket) => {
    socket.on("joinChatRoom", ({ roomId }) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined chat room : ${roomId}`);
    })

    socket.on("sendMessage", async({ roomId, content }) => {
        try{
            // Check if user is authenticated
            if (!socket.user) {
                socket.emit("error", "Please log in to send messages");
                return;
            }

            const senderId = socket.user._id;

            const message = new Message({ roomId, sender : senderId, content });
            await message.save();

            io.to(roomId).emit("newMessage", {
                senderId,
                content,
                roomId,
                timeStamp : message.timeStamp
            });

            await redisClient.publish(`chat : ${roomId}`, JSON.stringify(message));

        }catch(err){
            console.error("Chat Error : ", err);
            socket.emit("error", "Failed to send message");
        }
    })

    socket.on("leaveChatRoom", ({ roomId }) => {
        socket.leave(roomId)
    })
}
