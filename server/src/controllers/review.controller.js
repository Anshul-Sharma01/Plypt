import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";
import { Review } from "../models/review.model.js";
import { Craftor } from "../models/craftor.model.js";
import { Prompt } from "../models/prompt.model.js";


const addReviewController = asyncHandler(async(req, res) => {
    const { craftorId, promptId } = req.params;
    if(!isValidObjectId(craftorId)){
        throw new ApiError(400, "Invalid Craftor Id");
    }
    if(!isValidObjectId(promptId)){
        throw new ApiError(400, "Invalid Prompt Id");
    }
    const craftor = await Craftor.findById(craftorId);
    const prompt = await Prompt.findById(promptId);
    if(!prompt){
        throw new ApiError(404, "Prompt not found");
    }

    if(!craftor){
        throw new ApiError(404, "Craftor not found");
    }

    const userId = req.user?._id;
    const { comment, rating } = req.body;

    if(!comment || !rating){
        throw new ApiError(400, "All fields are mandatory");
    }

    const review = await Review.create({
        craftor : craftorId,
        buyer : userId,
        rating,
        comment
    })

    prompt.reviews.push(review);
    await prompt.save();

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            review,
            "Successfully added the review"
        )
    );

})

const deleteReviewController = asyncHandler(async(req, res) => {
    const { reviewId } = req.params;
    if(!isValidObjectId(reviewId)){
        throw new ApiError(404, "Invalid Review Id");
    }

    const review = await Review.findByIdAndDelete(reviewId);
    if(!review){
        throw new ApiError(404, "Review not found");
    }

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            review,
            "Successfully deleted the review"
        )
    )


})

export {
    addReviewController,
    deleteReviewController
}


