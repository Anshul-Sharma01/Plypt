import mongoose, { Schema } from "mongoose";

const craftorSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true,
        unique : true
    },
    slug : {
        type : String,
        unique : true,
        required : true
    },
    totalPromptsSold : {
        type : Number,
        default : 0
    },
    propmts : [
        {
            type : Schema.Types.ObjectId,
            ref : "Prompt"
        }
    ],
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    rating : {
        type : Number,
        default : 0
    },
    paymentDetails : {
        razorpayId : String,
        bankAccount : String,
        upiId : String
    },
    tier : {
        type : String,
        enum : ["Basic", "Pro", "Elite"],
        default : "Basic"
    }
}, {
    timestamps : true
})

export const Craftor = mongoose.model("Craftor", craftorSchema);
