import { Message } from "../models/message.model.js";

export const registerChatHandlers = (io, socket) => {
    socket.on("joinChatRoom", ({ roomId }) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined chat room : ${roomId}`);
    })

    socket.on("sendMessage", async({ roomId, senderId, content }) => {
        try{
            const message = new Message({ roomId, sender : senderId, content });
            await message.save();

            io.to(roomId).emit("newMessage", {
                senderId,
                content,
                roomId,
                timeStamp : message.timeStamp
            });

        }catch(err){
            console.error("Chat Error : ", err);
            socket.emit("error", "Failed to send message");
        }
    })

    socket.on("leaveChatRoom", ({ roomId }) => {
        socket.leave(roomId);
    })
}
