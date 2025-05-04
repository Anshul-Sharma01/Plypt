import mongoose, { Schema } from "mongoose";

const purchaseSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    prompt : {
        type : Schema.Types.ObjectId,
        ref : "Prompt",
        required : true
    },
    amount : {
        type : Number,
        required : true,
    },
    currency : {
        type : String,
        enum : ["INR", "RUB" , "USD", "GBP", "EUR", "JPY"],
        default : "INR"
    },
    razorpayOrderId : {
        type : String,
    },
    status : {
        type : String,
        enum : ["Completed", "Pending", "Initiated"],
        required : true,
        default : "Initiated"
    },
    transaction : {
        type : Schema.Types.ObjectId,
        ref : "Transaction"
    },
    purchasedAt : {
        type : Date, 
        default : Date.now
    }
}, {
    timestamps : true
})

export const Purchase = mongoose.model("Purchase", purchaseSchema);
