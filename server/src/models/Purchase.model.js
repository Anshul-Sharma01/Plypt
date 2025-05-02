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
    purchasedAt : {
        type : Date, 
        default : Date.now
    }
}, {
    timestamps : true
})

export const Purchase = mongoose.model("Purchase", purchaseSchema);
