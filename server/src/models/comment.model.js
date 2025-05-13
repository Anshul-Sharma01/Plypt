import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : [true, "User is required"]
    },
    prompt : {
        type : Schema.Types.ObjectId,
        ref : "Prompt",
        required : [true, "Prompt is required"]
    },
    content : {
        type : String,
        required : [true, "Comment is required"]
    }
}, {
    timestamps : true
});

export const Comment = mongoose.model("Comment", commentSchema);
