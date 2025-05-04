import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4  } from "uuid";

const generateOrderId = () => `order_${uuidv4()}`;

const transactionSchema = new Schema({
    orderId : {
        type : String,
        required : [true, "Please provide the transaction order Id"],
        default : generateOrderId
    },
    razorpayOrderId : {
        type : String,
        required : [true, "Please provide the razorpay order Id"]
    },
    razorpayPaymentId : {
        type : String,
    },  
    signature : {
        type : String,
    },
    isVerified : {
        type : Boolean,
        default : false
    }
})

export const Transaction = mongoose.model("Transaction", transactionSchema);