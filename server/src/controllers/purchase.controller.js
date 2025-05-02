import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Purchase } from "../models/Purchase.model.js";


const purchasePromptController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { promptId } = req.params;

    if (!isValidObjectId(promptId)) {
        throw new ApiError(400, "Invalid Prompt Id");
    }

    const alreadyPurchased = await Purchase.findOne({ user: userId, prompt: promptId });
    if (alreadyPurchased) {
        return res.status(200).json(
            new ApiResponse(200, { alreadyPurchased: true }, "Prompt already purchased")
        );
    }

    const purchase = await Purchase.create({ user: userId, prompt: promptId });

    return res.status(201).json(
        new ApiResponse(
            201,
            { purchaseId: purchase._id, promptId },
            "Prompt purchased successfully"
        )
    );
});


const getUserPurchasedPromptsController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const userPurchases = await Purchase.find({ user: userId }).populate("prompt", "title price"); 

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                count: userPurchases.length,
                purchases: userPurchases
            },
            "Successfully fetched purchased prompts"
        )
    );
});


export {
    purchasePromptController,
    getUserPurchasedPromptsController
}