import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { User } from "../models/user.model.js";

const toggleLikeController = asyncHandler(async(req, res) => {
    const userId = req?.user?._id;
    const { promptId } = req.params;
    if(!isValidObjectId(promptId)){
        throw new ApiError(400, "Invalid Prompt Id");
    }

    const likeDocument = await Like.findOne({ user: userId, prompt: promptId });


    if(likeDocument){
        await likeDocument.deleteOne();
        let likedPrompts = await Like.find({ user : userId })
        .select("prompt -_id")
        .lean();

        likedPrompts = likedPrompts.map(ele => ele?.prompt?.toString());
        
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    liked : false,
                    likedPrompts
                },
                "Successfully deleted the like document"
            )
        )
    }else{
        const likeDocument = await Like.create({
            user : userId,
            prompt : promptId
        });
        let likedPrompts = await Like.find({ user : userId })
        .select("prompt -_id")
        .lean();
        if(likedPrompts.length != 0){
            likedPrompts = likedPrompts.map(ele => ele.prompt.toString()); 
        }


        return res.status(201)
        .json(
            new ApiResponse(
                201,
                {
                    liked : true,
                    likedPrompts,
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

const getTopLikedPromptsController = asyncHandler(async(req, res) => {
    const topLikedPrompts = await Like.aggregate([
        {
            $group : {
                _id : "$prompt",
                likeCount : { $sum : 1 }
            }
        },
        {
            $sort : { likeCount : -1 }
        },
        {
            $limit : 10
        },
        {
            $lookup : {
                from : "prompts",
                localField : "_id",
                foreignField : "_id",
                as : "prompt"
            }
        },
        {
            $match : {
                "prompt" : { $ne : null }
            }
        },  
        {
            $unwind : "$prompt"
        },
        {
            $project : {
                _id : 0,
                promptId : "$_id",
                likeCount : 1,
                prompt : {
                    title : "$prompt.title",
                    content : "$prompt.content",
                    createdAt : "$prompt.createdAt",
                    price : "$prompt.price"
                }
            }
        }
    ]);
    res.status(200)
    .json(
        new ApiResponse(
            200,
            topLikedPrompts,
            "Successfully fetched the top liked prompts"
        )
    )
})

export {
    toggleLikeController,
    getPromptLikesController,
    getTopLikedPromptsController
}