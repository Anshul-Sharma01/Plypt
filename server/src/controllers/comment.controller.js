import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Comment } from "../models/comment.model.js";
import { isValidObjectId } from "mongoose";

const addCommentController = asyncHandler(async(req, res) => {
    const userId = req.user?._id;
    const { promptId, content } = req.body;
    if(!isValidObjectId(promptId)){
        throw new ApiError(400, "Invalid Prompt Id");
    }
    if(!content){
        throw new ApiError(400, "Comment content is required");
    }
    const comment = await Comment.create({
        user : userId,
        prompt : promptId,
        content
    });
    return res.status(201)
    .json(
        new ApiResponse(
            201,
            comment,
            "Comment added successfully"
        )
    )
})

const deleteCommentController = asyncHandler(async(req, res) => {
    const { commentId } = req.body;
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid Prompt Id");
    }
    const comment = await Comment.findByIdAndDelete(commentId);
    if(!comment){
        throw new ApiError(500, "Something went wrong, please try again later..");
    }
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            comment,
            "Comment deleted successfully"
        )
    )
})


export {
    addCommentController,
    deleteCommentController
}