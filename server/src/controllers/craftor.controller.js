import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Craftor } from "../models/craftor.model.js";
import slugify from "slugify";
import { isValidObjectId } from "mongoose";
import { Prompt } from "../models/prompt.model.js";
import redisClient from "../config/redisClient.js";
import { handleAuctionEnd } from "../socket/bidSocket.js";

const activateCraftorController = asyncHandler(async(req, res) => {
    const userId = req.user?._id;
    // console.log("Body : ", req.body);
    const { bankAccount, razorpayId, upiId } = req.body;

    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404, "User not found");
    }
    const username = user?.username;
    // console.log("User-Payment-Details : ", userPaymentDetails);

    const generatedSlug = slugify(username, { lower : true, strict : true });

    if(!razorpayId && !bankAccount && !upiId){
        throw new ApiError(400, "Atleast provide one payment option");
    }

    let paymentDetails = {};
    if(razorpayId) paymentDetails.razorpayId = razorpayId;
    if(bankAccount) paymentDetails.bankAccount = bankAccount;
    if(upiId) paymentDetails.upiId = upiId;

    let craftor = await Craftor.create({
        user : userId,
        slug : generatedSlug,
        paymentDetails
    });


    if(!craftor){
        throw new ApiError(400, "Please try again after sometime");
    }

    craftor = await Craftor.findById(craftor?._id).populate("user");
    

    return res.status(201)
    .json(
        new ApiResponse(
            201,
            craftor,
            "Successfully activated the craftor profile"
        )
    );



})

const getCraftorProfile = asyncHandler(async(req, res) => {
    const slug = req.params?.slug;
    if(!slug){
        throw new ApiError(400, "Please provide the slug identifier");
    }
    const craftor = await Craftor.findOne({ slug }).populate("user");
    if(!craftor){
        throw new ApiError(404, "Craftor not found");
    }
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            craftor,
            "Craftor profile fetched successfully"
        )
    )
})

const updatePaymentDetails = asyncHandler(async(req, res) => {
    const slug = req.params?.slug;
    const { paymentDetails }= req.body;
    if(!slug){
        throw new ApiError(400, "Please provide the slug identifier");
    }
    const craftor = await Craftor.findOne({ slug });
    if(!craftor){
        throw new ApiError(404, "Craftor not found");
    }

    craftor.paymentDetails = paymentDetails;
    await craftor.save();
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            craftor,
            "Craftor Payment Details updated Successfully"
        )
    )
    
})



export {
    activateCraftorController,
    getCraftorProfile,
    updatePaymentDetails
}



