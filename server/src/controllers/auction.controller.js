import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { io } from "../index.js";
import { Prompt } from "../models/prompt.model.js";
import redisClient from "../config/redisClient.js";


const endAuctionManuallyController = asyncHandler(async(req, res) => {
    const { promptId } = req.params;
    if(!isValidObjectId(promptId)){
        throw new ApiError(400, "Invalid Prompt Id");
    }
    const prompt = await Prompt.findById(promptId);
    if(!prompt || !prompt.isBiddable){
        throw new ApiError(400, "Invalid or non-biddable prompt");
    }
    const auctionEnded = await redisClient.get(`auctionEnded:${promptId}`);
    if(auctionEnded){
        throw new ApiError(400, "Auction has already ended");
    }
    await handleAuctionEnd(io, prompt);
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            null,
            "Auction Ended successfully"
        )
    )
})

export {
    endAuctionManuallyController
}