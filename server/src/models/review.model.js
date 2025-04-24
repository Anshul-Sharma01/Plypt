import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
    craftor : {
        type : Schema.Types.ObjectId,
        ref : "Craftor",
        required : true,
    },
    buyer : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : [true, "Buyer is required"]
    },
    rating : {
        type : Number,
        required : true,
        min : 1,
        max : 5
    },

    comment : {
        type : String,
        trim : true,
    }

},{
    timestamps : true
})


export const Review = mongoose.model("Review", reviewSchema);
