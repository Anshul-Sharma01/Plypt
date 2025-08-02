import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Comment } from "../models/comment.model.js";
import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";

const addCommentController = asyncHandler(async(req, res) => {
    const userId = req.user?._id;
    const { promptId, content } = req.body;
    if(!isValidObjectId(promptId)){
        throw new ApiError(400, "Invalid Prompt Id");
    }
    if(!content){
        throw new ApiError(400, "Comment content is required");
    }
    const user = await User.findById(userId).select("-email -username -bio -isCraftor -role -googleId -createdAt -updatedAt");
    const comment = await Comment.create({
        user : userId,
        prompt : promptId,
        content
    });
    comment.user = user;
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
    const { commentId } = req.params;
    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid Comment Id");
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

const fetchAllCommentsController = asyncHandler(async(req, res) => {
    const { promptId } = req.params;
    if(!isValidObjectId(promptId)){
        throw new ApiError(400, "Invalid Prompt Id");
    }
    const comments = await Comment.find({ prompt : promptId }).populate("user", "name avatar");
    if(comments.length === 0){
        return res.status(200)
        .json(
            new ApiResponse(
                200,
                comments,
                "No comments yet !!"
            )
        )
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            comments,
            "All Comments fetched successfully"
        )
    )
})


export {
    addCommentController,
    deleteCommentController,
    fetchAllCommentsController
}