import mongoose, { mongo, Schema } from "mongoose";

const bidSchema = new Schema({
    prompt : {
        type : Schema.Types.ObjectId,
        ref : "Prompt",
        required : [true, "Prompt is required for bidding"]
    },
    user : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : [true, "User is required for bidding"]
    },
    bidAmount : {
        type : Number,
        required : [true, "Bid Ammount is required"],
    },
    timeStamp : {
        type : Date, 
        default : Date.now
    }
},{
    timestamps : true
})


export const Bid = mongoose.model("Bid", bidSchema);