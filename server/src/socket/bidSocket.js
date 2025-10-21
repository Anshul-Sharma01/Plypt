import { Bid } from "../models/bid.model.js";
import { Prompt } from "../models/prompt.model.js";

import redisClient from "../config/redisClient.js";

const AUCTION_DURATION = 5 * 60; // 20 minutes in seconds

// Global timeout manager to prevent duplicate timeouts
const auctionTimeouts = new Map();

// Function to sync prompt's currentBid with the latest bid
const syncPromptCurrentBid = async (promptId) => {
    try {
        const latestBid = await Bid.findOne({ prompt: promptId }).sort({ createdAt: -1 });
        if (latestBid) {
            await Prompt.findByIdAndUpdate(promptId, { currentBid: latestBid.bidAmount });
            console.log(`Synced prompt ${promptId} currentBid to ${latestBid.bidAmount}`);
        }
    } catch (error) {
        console.error(`Error syncing prompt currentBid for ${promptId}:`, error);
    }
};

export const handleAuctionEnd = async(io, promptId) => {
    try {
        console.log(`Handling auction end for prompt: ${promptId}`);
        
        // Check if auction already ended to prevent duplicate processing
        const alreadyEnded = await redisClient.get(`auctionEnded:${promptId}`);
        if (alreadyEnded === "true") {
            console.log(`Auction already ended for prompt: ${promptId}`);
            return;
        }
        
        // Clear any existing timeout for this auction
        if (auctionTimeouts.has(promptId)) {
            clearTimeout(auctionTimeouts.get(promptId));
            auctionTimeouts.delete(promptId);
        }
        
        // Sync the prompt's currentBid before ending
        await syncPromptCurrentBid(promptId);
        
        const latestBid = await Bid.findOne({ prompt : promptId }).sort({ createdAt : -1 });

        if(!latestBid){
            console.log(`No bids found for prompt: ${promptId}`);
            await redisClient.set(`auctionEnded:${promptId}`, "true");
            // Clear auction start time to prevent restart
            await redisClient.del(`auctionStart:${promptId}`);
            io.to(promptId).emit("auctionEnd", {
                promptId,
                message : "No valid bids placed"
            });
            return;
        }

        const { user, bidAmount } = latestBid;

        // Mark auction as ended and set winner
        await redisClient.set(`winner:${promptId}`, user.toString());
        await redisClient.set(`auctionEnded:${promptId}`, "true");
        await redisClient.set(`finalBid:${promptId}`, bidAmount.toString());
        // Clear auction start time to prevent restart
        await redisClient.del(`auctionStart:${promptId}`);

        console.log(`Auction ended for prompt: ${promptId}, winner: ${user}, final bid: ${bidAmount}`);

        io.to(promptId).emit("auctionEnded", {
            promptId,
            winnerId : user,
            finalBid : bidAmount,
        });
    } catch (error) {
        console.error(`Error handling auction end for prompt ${promptId}:`, error);
    }
}

export const registerBidHandlers = (io, socket) => {
    socket.on("joinAuctionRoom", async({ promptId }) => {
        try {
            socket.join(promptId);
            console.log(`Socket ${socket.id} joined auction room ${promptId}`);
            
            // Sync prompt's currentBid when joining
            await syncPromptCurrentBid(promptId);
            
            // Send current auction status when joining
            const prompt = await Prompt.findById(promptId);
            if(!prompt || !prompt.isBiddable) {
                console.log(`Invalid or non-biddable prompt: ${promptId}`);
                return;
            }
            
            const auctionEnded = await redisClient.get(`auctionEnded:${promptId}`);
            const auctionStartTime = await redisClient.get(`auctionStart:${promptId}`);
            
            console.log(`Auction status for ${promptId}: ended=${auctionEnded}, startTime=${auctionStartTime}`);
            
            if(auctionEnded === "true") {
                const winner = await redisClient.get(`winner:${promptId}`);
                const finalBid = await redisClient.get(`finalBid:${promptId}`) || prompt.currentBid;
                console.log(`Auction already ended for ${promptId}, winner: ${winner}`);
                socket.emit("auctionEnded", {
                    promptId,
                    winnerId: winner,
                    finalBid: parseFloat(finalBid)
                });
            } else if(auctionStartTime) {
                // Check if auction should have ended
                const startTime = new Date(auctionStartTime);
                const endTime = new Date(startTime.getTime() + (AUCTION_DURATION * 1000));
                const now = new Date();
                
                console.log(`Auction start: ${startTime}, end: ${endTime}, now: ${now}`);
                
                if(now >= endTime) {
                    console.log(`Auction should have ended for ${promptId}, ending now`);
                    await handleAuctionEnd(io, promptId);
                } else {
                    // Send current auction status with time left
                    const timeLeft = endTime.getTime() - now.getTime();
                    console.log(`Auction in progress for ${promptId}, time left: ${timeLeft}ms`);
                    socket.emit("auctionStarted", {
                        promptId,
                        timeLeft,
                        startTime: auctionStartTime
                    });
                    
                    // Set timeout for when auction should end (only if not already set)
                    if (!auctionTimeouts.has(promptId)) {
                        const timeoutId = setTimeout(() => handleAuctionEnd(io, promptId), timeLeft);
                        auctionTimeouts.set(promptId, timeoutId);
                        console.log(`Set auction end timeout for ${promptId} in ${timeLeft}ms`);
                    }
                }
            } else {
                console.log(`No auction started yet for ${promptId}`);
            }
        } catch(err) {
            console.error("Error handling join auction room:", err);
        }
    });

    socket.on("leaveAuctionRoom", ({ promptId }) => {
        socket.leave(promptId);
        console.log(`Socket ${socket.id} left auction room ${promptId}`);
    })

    socket.on("placeBid", async({ promptId, bidAmount }) => {
        console.log("PlaceBid event received:", { promptId, bidAmount, socketId: socket.id });
        
        try{
            // Check if user is authenticated via socket
            if (!socket.user) {
                console.log("User not authenticated via socket");
                socket.emit("bidRejected", {
                    message : "Please log in to place a bid"
                });
                return;
            }

            console.log("User authenticated for bid:", socket.user.username);

            const userId = socket.user._id;

            const prompt = await Prompt.findById(promptId).populate('craftor');
            if(!prompt) {
                console.log(`Prompt not found: ${promptId}`);
                return;
            }

            if(!prompt.isBiddable){
                socket.emit("bidRejected", {
                    message : "This prompt is not open for bidding"
                });
                return;
            }

            // Check if user is the craftor (prompt creator)
            if(prompt.craftor.user.toString() === userId.toString()){
                socket.emit("bidRejected", {
                    message : "You cannot bid on your own prompt"
                });
                return;
            }

            const auctionEnded = await redisClient.get(`auctionEnded:${promptId}`);
            if(auctionEnded === "true"){
                socket.emit("bidRejected",{
                    message : "Auction has ended"
                });
                return;
            }

            const lastBid = await Bid.findOne({ prompt : promptId }).sort({ createdAt : -1 });

            if(lastBid && lastBid.user.toString() === userId.toString()){
                socket.emit("bidRejected", {
                    message : "You cannot place consecutive bids"
                })
                return;
            }

            const lockKey = `lock:bid:${promptId}`;
            const lockAcquired = await redisClient.set(lockKey, userId.toString(), { NX: true, EX: 5 });
            if(!lockAcquired){
                socket.emit("bidRejected", {
                    message : "Another bid is being processed. Please try again "
                })
                return;
            }

            // For first bid, check against initial price; for subsequent bids, check against current bid
            const minimumBid = prompt.currentBid > 0 ? prompt.currentBid : prompt.price;
            
            if(bidAmount <= minimumBid){
                socket.emit("bidRejected", {
                    message : `Bid must be higher than ${prompt.currentBid > 0 ? 'current bid' : 'starting price'} ($${minimumBid})`
                });
                return;
            }

            prompt.currentBid = bidAmount;
            await prompt.save();

            const bid = await Bid.create({
                user : userId,
                prompt : promptId,
                bidAmount : bidAmount
            })

            console.log(`Bid placed successfully: ${bid._id} for prompt ${promptId} by user ${userId} for $${bidAmount}`);

            // Check if this is the first bid (auction start)
            const auctionStartTime = await redisClient.get(`auctionStart:${promptId}`);
            let isFirstBid = false;
            
            if(!auctionStartTime){
                isFirstBid = true;
                const now = new Date();
                await redisClient.set(`auctionStart:${promptId}`, now.toISOString());
                console.log(`Auction started for prompt ${promptId} at ${now}`);
                
                // Set auction to end in 20 minutes (only if not already set)
                if (!auctionTimeouts.has(promptId)) {
                    const timeoutId = setTimeout(() => handleAuctionEnd(io, promptId), AUCTION_DURATION * 1000);
                    auctionTimeouts.set(promptId, timeoutId);
                    console.log(`Set new auction timeout for ${promptId}`);
                }
            }

            // Emit new bid to all users in the room
            io.to(promptId).emit("newBid", {
                promptId,
                bid : {
                    user : userId,
                    bidAmount : bidAmount,
                    amount : bidAmount, // Keep both for compatibility
                    timeStamp : new Date()
                },
                isFirstBid
            })

            // If this is the first bid, send auction start status to all users
            if(isFirstBid) {
                const timeLeft = AUCTION_DURATION * 1000; // 20 minutes in milliseconds
                io.to(promptId).emit("auctionStarted", {
                    promptId,
                    timeLeft,
                    startTime: new Date().toISOString()
                });
            }

            await redisClient.del(lockKey);

        }catch(err){
            console.error(`Bid Error : ${err}`);
            socket.emit("bidRejected", {
                message : "Failed to place bid. Please try again."
            });
        }
    })

}