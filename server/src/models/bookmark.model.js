import mongoose, { Schema }  from "mongoose";

const bookmarkSchema = new Schema({
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

bookmarkSchema.index({ user : 1, prompt : 1 }, { unique : true });

export const Bookmark = mongoose.model("Bookmark", bookmarkSchema);