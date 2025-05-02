import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";

const toggleLikeController = asyncHandler(async(req, res) => {
    const userId = req?.user?._id;
    const { promptId } = req.params;
    if(!isValidObjectId(promptId)){
        throw new ApiError(400, "Invalid Prompt Id");
    }

    const likeDocument = await Like.findOne({ user: userId, prompt: promptId });


    if(likeDocument){
        await likeDocument.deleteOne();
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    liked : false,
                },
                "Successfully deleted the like document"
            )
        )
    }else{
        const likeDocument = await Like.create({
            user : userId,
            prompt : promptId
        });
        return res.status(201)
        .json(
            new ApiResponse(
                201,
                {
                    liked : true
                },
                "Successfully created the like document"
            )
        )
    }
    
})

const getPromptLikesController = asyncHandler(async(req, res) => {
    const { promptId } = req.params;
    if(!isValidObjectId(promptId)){
        throw new ApiError(400, "Invalid Prompt Id");
    }

    const promptLikes = await Like.countDocuments({ prompt : promptId });
    
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {
                likes : promptLikes,
            },
            "Successfully fetched the prompt likes"
        )
    )
})


export {
    toggleLikeController,
    getPromptLikesController
}