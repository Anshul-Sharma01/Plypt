import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Purchase } from "../models/Purchase.model.js";
import { Transaction } from "../models/transaction.model.js";
import razorpayService from "../utils/razorpayService.js";
import crypto from "crypto";
import { Prompt } from "../models/prompt.model.js";
import { v4 as uuidv4 } from "uuid";
import { Craftor } from "../models/craftor.model.js";
import redisClient from "../config/redisClient.js";

const generateOrderId = () => `ord_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;


const purchasePromptController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { promptId } = req.params;
    const { amt, currency } = req.body;

    if (!isValidObjectId(promptId)) {
        throw new ApiError(400, "Invalid Prompt Id");
    }
    
    if(!amt || !currency){
        throw new ApiError(400, "All fields are mandatory");
    }

    if(!["INR", "RUB" , "USD", "GBP", "EUR", "JPY"].includes(currency)){
        throw new ApiError(400, "Invalid currency");
    }

    const prompt = await Prompt.findById(promptId);
    if(!prompt){
        throw new ApiError(404, "Prompt not found");
    }

    if(prompt.isBiddable){
        const winnerId = await redisClient.get(`winner : ${promptId}`);
        if(!winnerId || winnerId !== userId.toString()){
            throw new ApiError(403, "Only the auction winner can purchase this prompt");
        }
    }


    const alreadyPurchased = await Purchase.findOne({ user: userId, prompt: promptId });
    if (alreadyPurchased) {
        return res.status(400).json(
            new ApiResponse(400, { alreadyPurchased: true }, "Prompt already purchased")
        );
    }

    const receipt = generateOrderId();
    const amount = amt;
    const paymentOrder = await razorpayService.createOrder(amount, currency, receipt);

    const purchase = await Purchase.create({ 
        user : userId,
        prompt : promptId,
        amount,
        currency,
        razorpayOrderId : paymentOrder.id,
    });


    const newTransaction = await Transaction.create({
        orderId : receipt,
        razorpayOrderId : paymentOrder.id,
        isVerified : false
    })

    purchase.transaction = newTransaction?._id;
    await purchase.save();

    return res.status(201).json(
        new ApiResponse(
            201,
            { 
                receipt,
                transaction : newTransaction,
                promptId,  
            },
            "Prompt purchase initiated successfully"
        )
    );
});


const getUserPurchasedPromptsController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;


    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10;


    const skip = (page - 1) * limit;


    const userPurchases = await Purchase.find({ user: userId })
        .populate({
            path: "prompt",
            populate: {
                path: "craftor",
                select: "name email avatar"
            }
        })
        .populate("user", "name email avatar")
        .skip(skip) 
        .limit(limit);


    const totalPurchases = await Purchase.countDocuments({ user: userId });


    return res.status(200).json(
        new ApiResponse(
            200,
            {
                count: totalPurchases, 
                purchases: userPurchases
            },
            "Successfully fetched purchased prompts"
        )
    );
});


const completePurchaseController = asyncHandler(async(req, res) => {
    const userId = req.user?._id;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
        throw new ApiError(400, "All fields are mandatory for payment verification");
    }

    const purchase = await Purchase.findOne({ razorpayOrderId : razorpay_order_id });

    if(!purchase){
        throw new ApiError(404, "Order not found");
    }

    purchase.status = "Pending";

    const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    if(generatedSignature !== razorpay_signature){
        throw new ApiError(400, "Invalid Payment Signature");
    }

    purchase.status = "Completed";

    const transaction = await Transaction.findOne({ razorpayOrderId : razorpay_order_id });

    transaction.razorpayPaymentId = razorpay_payment_id;
    transaction.signature = razorpay_signature;
    transaction.isVerified = true;

    await purchase.save();
    await transaction.save();

    const promptId = purchase.prompt;
    const craftor = await Craftor.findOne({ 
        prompts : { $elemMatch : { $eq : promptId }}
    })

    craftor.totalPromptsSold = craftor.totalPromptsSold + 1;
    await craftor.save();

    const prompt = await Prompt.findById(promptId);
    prompt.buyers.push(userId);
    await prompt.save();

    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {
                order : purchase,
            },
            "Successfully completed the purchase"
        )
    )

})



export {
    purchasePromptController,
    getUserPurchasedPromptsController,
    completePurchaseController
}