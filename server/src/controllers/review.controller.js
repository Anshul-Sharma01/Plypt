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

    // Check if user has purchased the prompt
    if (!prompt.buyers.includes(userId)) {
        throw new ApiError(403, "You must purchase this prompt before reviewing it");
    }

    // Check if user has already reviewed this prompt
    const existingReview = await Review.findOne({ 
        buyer: userId, 
        prompt: promptId 
    });
    
    if (existingReview) {
        throw new ApiError(400, "You have already reviewed this prompt");
    }

    const review = await Review.create({
        craftor : craftorId,
        buyer : userId,
        prompt : promptId,
        rating,
        comment
    })

    // Populate the buyer information for the response
    await review.populate('buyer', 'name avatar');

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

    const review = await Review.findById(reviewId);
    if(!review){
        throw new ApiError(404, "Review not found");
    }

    // Check if the user is the owner of the review
    if(review.buyer.toString() !== req.user._id.toString()){
        throw new ApiError(403, "You can only delete your own reviews");
    }

    await Review.findByIdAndDelete(reviewId);

    // Remove review from prompt's reviews array
    await Prompt.findByIdAndUpdate(review.prompt, {
        $pull: { reviews: reviewId }
    });

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            review,
            "Successfully deleted the review"
        )
    )
})

const getReviewsForPromptController = asyncHandler(async(req, res) => {
    const { promptId } = req.params;
    if(!isValidObjectId(promptId)){
        throw new ApiError(400, "Invalid Prompt Id");
    }

    const reviews = await Review.find({ prompt: promptId })
        .populate('buyer', 'name avatar')
        .sort({ createdAt: -1 });

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            reviews,
            "Reviews fetched successfully"
        )
    );
})

export {
    addReviewController,
    deleteReviewController,
    getReviewsForPromptController
}


