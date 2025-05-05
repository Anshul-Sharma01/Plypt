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
    prompt : {
        type : Schema.Types.ObjectId,
        ref : "Prompt",
        required : [true, "Prompt is required"]
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

reviewSchema.post("save", async function(){
    const Review = this.constructor;
    const Prompt = mongoose.model("Prompt");

    const reviews = await Review.find({ prompt : this.prompt });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await Prompt.findByIdAndUpdate(this.prompt, { rating : avgRating });

})


export const Review = mongoose.model("Review", reviewSchema);
