import { Bid } from "../models/bid.model.js";
import { Prompt } from "../models/prompt.model.js";
import mongoose, { isValidObjectId } from "mongoose";
import { Socket } from "socket.io";


export const registerBidHandlers = (io, socket) => {
    socket.on("joinAuctionRoom", ({ promptId }) => {
        socket.join(promptId);
        console.log(`Socket  ${socket.id} joined auction room ${promptId}`);
    });

    socket.on("placeBid", async({ promptId, userId, bidAmount }) => {
        try{
            if(!isValidObjectId(promptId)) return;
            const prompt = await Prompt.findById(promptId);
            if(!prompt){
                return socket.emit("error", "Prompt not found");
            }
            if(prompt.craftor.toString() === userId){
                return socket.emit("error", "You cannot bid on your own prompt");
            }
            if(bidAmount <= prompt.currentBid){
                return socket.emit("error", "Bid must be higher than current bid");
            }

            const newBid = new Bid({ prompt : promptId, user : userId, bidAmount });
            await newBid.save();
            
            prompt.currentBid = bidAmount;
            await prompt.save();

            io.to(promptId).emit("newBid", {
                bidAmount,
                userId,
                promptId
            });

        }catch(err){
            console.error(err);
            socket.emit("error", "Failed to place bid");
        }
    })
    socket.on("leaveAuctionRoom", ({ promptId }) => {
        socket.leave(promptId);
    })
}