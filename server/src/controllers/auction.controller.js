import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { io } from "../index.js";
import { Prompt } from "../models/prompt.model.js";
import { Bid } from "../models/bid.model.js";
import redisClient from "../config/redisClient.js";
import { handleAuctionEnd } from "../socket/bidSocket.js";

const getBidsForPromptController = asyncHandler(async(req, res) => {
    try {
        console.log('getBidsForPromptController called with promptId:', req.params.promptId);
        
        const { promptId } = req.params;
        
        if(!promptId){
            throw new ApiError(400, "Prompt ID is required");
        }

        // Check Redis connection
        if (!redisClient.isReady) {
            console.log('Redis not ready, waiting for connection...');
            await redisClient.connect();
        }

        console.log('Finding bids for prompt:', promptId);
        
        const prompt = await Prompt.findById(promptId);
        if(!prompt){
            throw new ApiError(404, "Prompt not found");
        }

        // If prompt is not biddable, return empty data instead of error
        if(!prompt.isBiddable){
            console.log('Prompt is not biddable:', promptId);
            return res.status(200).json(
                new ApiResponse(200, {
                    bids: [],
                    currentBid: prompt.price || 0,
                    isAuctionEnded: false,
                    winnerId: null,
                    initialBid: prompt.price || 0
                }, "Prompt is not biddable")
            );
        }

        const bids = await Bid.find({ prompt: promptId })
            .sort({ createdAt: -1 })
            .populate('user', 'username email');

        console.log('Found bids:', bids.length);

        // Check if auction has ended
        let auctionEnded = null;
        let winner = null;
        
        try {
            auctionEnded = await redisClient.get(`auctionEnded:${promptId}`);
            winner = (auctionEnded === "true") ? await redisClient.get(`winner:${promptId}`) : null;
        } catch (redisError) {
            console.error('Redis error:', redisError);
            // Continue without Redis data if there's an error
        }

        console.log('Auction status - ended:', auctionEnded, 'winner:', winner);

        // Get final bid if auction ended
        let finalBid = prompt.currentBid;
        if (auctionEnded === "true") {
            const storedFinalBid = await redisClient.get(`finalBid:${promptId}`);
            if (storedFinalBid) {
                finalBid = parseFloat(storedFinalBid);
            }
        }

        const responseData = {
            bids,
            currentBid: finalBid,
            isAuctionEnded: auctionEnded === "true",
            winnerId: winner,
            initialBid: prompt.price
        };

        console.log('Sending response:', responseData);

        return res.status(200).json(
            new ApiResponse(200, responseData, "Bids fetched successfully")
        );
    } catch (error) {
        console.error('Error in getBidsForPromptController:', error);
        throw error;
    }
});

const getAuctionStatusController = asyncHandler(async(req, res) => {
    try {
        console.log('getAuctionStatusController called with promptId:', req.params.promptId);
        
        const { promptId } = req.params;
        
        if(!promptId){
            throw new ApiError(400, "Prompt ID is required");
        }

        const prompt = await Prompt.findById(promptId);
        if(!prompt || !prompt.isBiddable){
            throw new ApiError(404, "Biddable prompt not found");
        }

        // Check Redis connection
        if (!redisClient.isReady) {
            console.log('Redis not ready, waiting for connection...');
            await redisClient.connect();
        }

        let auctionEnded = null;
        let winner = null;
        let auctionStartTime = null;
        
        try {
            auctionEnded = await redisClient.get(`auctionEnded:${promptId}`);
            winner = (auctionEnded === "true") ? await redisClient.get(`winner:${promptId}`) : null;
            auctionStartTime = await redisClient.get(`auctionStart:${promptId}`);
        } catch (redisError) {
            console.error('Redis error:', redisError);
            // Continue without Redis data if there's an error
        }
        
        let timeLeft = null;
        if(auctionStartTime && auctionEnded !== "true"){
            const startTime = new Date(auctionStartTime);
            const endTime = new Date(startTime.getTime() + (20 * 60 * 1000)); // 20 minutes
            const now = new Date();
            timeLeft = Math.max(0, endTime.getTime() - now.getTime());
        }

        // Get final bid if auction ended
        let finalBid = prompt.currentBid;
        if (auctionEnded === "true") {
            const storedFinalBid = await redisClient.get(`finalBid:${promptId}`);
            if (storedFinalBid) {
                finalBid = parseFloat(storedFinalBid);
            }
        }

        const responseData = {
            isAuctionEnded: auctionEnded === "true",
            winnerId: winner,
            currentBid: finalBid,
            timeLeft,
            auctionStartTime
        };

        console.log('Auction status response:', responseData);

        return res.status(200).json(
            new ApiResponse(200, responseData, "Auction status fetched successfully")
        );
    } catch (error) {
        console.error('Error in getAuctionStatusController:', error);
        throw error;
    }
});

const getAuctionHistoryController = asyncHandler(async(req, res) => {
    try {
        console.log('getAuctionHistoryController called with promptId:', req.params.promptId);
        
        const { promptId } = req.params;
        
        if(!promptId){
            throw new ApiError(400, "Prompt ID is required");
        }

        const prompt = await Prompt.findById(promptId);
        if(!prompt){
            throw new ApiError(404, "Prompt not found");
        }

        const bids = await Bid.find({ prompt: promptId })
            .sort({ createdAt: -1 })
            .populate('user', 'username email');

        // Check Redis connection
        if (!redisClient.isReady) {
            console.log('Redis not ready, waiting for connection...');
            await redisClient.connect();
        }

        let auctionEnded = null;
        let winner = null;
        let auctionStartTime = null;
        
        try {
            auctionEnded = await redisClient.get(`auctionEnded:${promptId}`);
            winner = (auctionEnded === "true") ? await redisClient.get(`winner:${promptId}`) : null;
            auctionStartTime = await redisClient.get(`auctionStart:${promptId}`);
        } catch (redisError) {
            console.error('Redis error:', redisError);
            // Continue without Redis data if there's an error
        }

        const responseData = {
            prompt: {
                id: prompt._id,
                title: prompt.title,
                initialBid: prompt.price,
                currentBid: prompt.currentBid,
                isBiddable: prompt.isBiddable
            },
            bids,
            auctionInfo: {
                isEnded: auctionEnded === "true",
                winnerId: winner,
                startTime: auctionStartTime,
                endTime: auctionStartTime ? new Date(new Date(auctionStartTime).getTime() + (20 * 60 * 1000)) : null
            }
        };

        console.log('Auction history response:', responseData);

        return res.status(200).json(
            new ApiResponse(200, responseData, "Auction history fetched successfully")
        );
    } catch (error) {
        console.error('Error in getAuctionHistoryController:', error);
        throw error;
    }
});

const endAuctionManuallyController = asyncHandler(async(req, res) => {
    try {
        console.log('endAuctionManuallyController called with promptId:', req.params.promptId);
        
        const { promptId } = req.params;
        if(!promptId){
            throw new ApiError(400, "Invalid Prompt Id");
        }
        const prompt = await Prompt.findById(promptId);
        if(!prompt || !prompt.isBiddable){
            throw new ApiError(400, "Invalid or non-biddable prompt");
        }
        
        // Check Redis connection
        if (!redisClient.isReady) {
            console.log('Redis not ready, waiting for connection...');
            await redisClient.connect();
        }
        
        const auctionEnded = await redisClient.get(`auctionEnded:${promptId}`);
        if(auctionEnded === "true"){
            throw new ApiError(400, "Auction has already ended");
        }
        await handleAuctionEnd(io, promptId);
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Auction Ended successfully"
            )
        )
    } catch (error) {
        console.error('Error in endAuctionManuallyController:', error);
        throw error;
    }
})

// Helper function to clear auction data (for testing/debugging)
const clearAuctionDataController = asyncHandler(async(req, res) => {
    try {
        const { promptId } = req.params;
        
        if(!promptId){
            throw new ApiError(400, "Prompt ID is required");
        }

        // Check Redis connection
        if (!redisClient.isReady) {
            await redisClient.connect();
        }

        // Clear all auction-related Redis keys
        await redisClient.del(`auctionEnded:${promptId}`);
        await redisClient.del(`winner:${promptId}`);
        await redisClient.del(`finalBid:${promptId}`);
        await redisClient.del(`auctionStart:${promptId}`);
        await redisClient.del(`timeout:${promptId}`);

        console.log(`Cleared auction data for prompt: ${promptId}`);

        return res.status(200).json(
            new ApiResponse(200, null, "Auction data cleared successfully")
        );
    } catch (error) {
        console.error('Error in clearAuctionDataController:', error);
        throw error;
    }
});

export {
    getBidsForPromptController,
    getAuctionStatusController,
    getAuctionHistoryController,
    endAuctionManuallyController,
    clearAuctionDataController
}