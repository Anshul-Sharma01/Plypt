import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { Craftor } from "../models/craftor.model.js";
import slugify from "slugify";

const activateCraftorController = asyncHandler(async(req, res) => {
    const userId = req.user?._id;
    const { razorpayId, bankAccount, upiId } = req.body;

    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404, "User not found");
    }
    const username = user?.username;

    const generatedSlug = slugify(username, { lower : true, strict : true });

    if(!razorpayId && !bankAccount && !upiId){
        throw new ApiError(400, "Atleast provide one payment option");
    }

    let paymentDetails = {};
    if(razorpayId) paymentDetails.razorpayId = razorpayId;
    if(bankAccount) paymentDetails.bankAccount = bankAccount;
    if(upiId) paymentDetails.upiId = upiId;

    const craftor = await Craftor.create({
        user : userId,
        slug : generatedSlug,
        paymentDetails
    });

    if(!craftor){
        throw new ApiError(400, "Please try again after sometime");
    }

    return res.status(201)
    .json(
        new ApiResponse(
            201,
            craftor,
            "Successfully activated the craftor profile"
        )
    );



})




export {
    activateCraftorController
}



