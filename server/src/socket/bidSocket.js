import { Bid } from "../models/bid.model.js";
import { Prompt } from "../models/prompt.model.js";
import { isValidObjectId } from "mongoose";
import redisClient from "../config/redisClient.js";

const AUCTION_DURATION = 60 * 5;

export const handleAuctionEnd = async(io, promptId) => {
    const latestBid = await Bid.findOne({ prompt : promptId }).sort({ createdAt : -1 });

    if(!latestBid){
        io.to(promptId).emit("auctionEnd", {
            promptId,
            message : "No valid bids placed"
        });
        return;
    }

    const { user, amount } = latestBid;

    await redisClient.set(`winner : ${promptId}`, user.toString());
    await redisClient.set(`auctionEnded : ${promptId}`, true);

    io.to(promptId).emit("auctionEnded", {
        promptId,
        winnerId : user,
        finalBid : amount,
    });
}



export const registerBidHandlers = (io, socket) => {
    socket.on("joinAuctionRoom", ({ promptId }) => {
        socket.join(promptId);
        console.log(`Socket  ${socket.id} joined auction room ${promptId}`);
    });

    socket.on("leaveAuctionRoom", ({ promptId }) => {
        socket.leave(promptId);
    })

    socket.on("placeBid", async({ promptId, userId, bidAmount }) => {
        try{
            const prompt = await Prompt.findById(promptId);
            if(!prompt) return;

            if(!prompt.isBiddable){
                socket.emit("bidRejected", {
                    message : "This prompt is not open for bidding"
                });
                return;
            }

            const auctionEnded = await redisClient.get(`auctionEnded : ${promptId}`);
            if(auctionEnded){
                socket.emit("bidRejected",{
                    message : "Auction has ended"
                });
                return;
            }

            const lastBid = await Bid.findOne({ prompt : promptId }).sort({ createdAt : -1 });

            if(lastBid && lastBid.user.toString() === userId){
                socket.emit("bidRejected", {
                    message : "You cannot place consecutive bids"
                })
            }
            const lockKey = `lock:bid:${promptId}`;
            const lockAcquired = await redisClient.set(lockKey, userId, {NX : true, EX : 5});
            if(!lockAcquired){
                socket.emit("bidRejected", {
                    message : "Another bid is being processed. Please try again "
                })
                return;
            }

            if(bidAmount <= prompt.currentBid){
                socket.emit("bidRejected", {
                    message : "Bid must be higher than current bid"
                });
                return;
            }

            prompt.currentBid = bidAmount;
            await prompt.save();

            const bid = await Bid.create({
                user : userId,
                prompt : promptId,
                amount : bidAmount
            })

            io.to(promptId).emit("newBid", {
                promptId,
                bid : {
                    user : userId,
                    amount : bidAmount,
                    timeStamp : new Date()
                }
            })

            const auctionExists = await redisClient.get(`auction : ${promptId}`);
            if(!auctionExists){
                await redisClient.setEx(`auction : ${promptId}`, AUCTION_DURATION, userId);
                setTimeout(() => handleAuctionEnd(io, promptId), AUCTION_DURATION * 1000);
            }

            await redisClient.del(lockKey);

        }catch(err){
            console.error(`Bid Error : ${err}`);
        }
    })

}