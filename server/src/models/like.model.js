import mongoose, { Schema }  from "mongoose";

const likeSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    prompt : {
        type : Schema.Types.ObjectId,
        ref : "Prompt",
        required : true
    }
}, {
    timestamps : true
})

likeSchema.index({ user : 1, prompt : 1 }, { unique : true });


export const Like = mongoose.model("Like", likeSchema); 
