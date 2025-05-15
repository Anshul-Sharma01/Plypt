import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    roomId : {
        type : String, 
        required : [true, 'Room Id is required']
    },
    sender : {
        type : Schema.Types.ObjectId,
        ref : "User",
        required : [true, "User is required"]
    },
    content : {
        type : String,
        required : [true, "Message content is required"]
    },
    timeStamp : {
        type : Date, 
        default : Date.now,
    }
}, {
    timestamps : true
})

export const Message = mongoose.model("Message", messageSchema);
