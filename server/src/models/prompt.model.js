import mongoose, { Schema } from "mongoose";

const promptSchema = new Schema({
    title : {
        type : String,
        required : [true, "Prompt is required"],
        trim : true
    },
    slug : {
        type : String,
        unique : true,
        lowercase : true,
        trim : true
    },
    description : {
        type : String,
        required : [true, "Prompt Descritpion is required"],
    },
    content : {
        type : String, 
        required : [true, "Content is required"]
    },
    craftor : {
        type : Schema.Types.ObjectId,
        ref : "Craftor",
        required : true,
    },
    price : {
        type : Number,
        default : 0
    },
    category : {
        type : String,
        enum : ["Coding", "Writing", "Design", "Marketing", "Bussiness", "Other"],
        default : "other"
    },
    model : {
        type : String,
        enum : ["GPT-3.5", "GPT-4", "DALL-E", "Claude", "Custom", "Other"],
        default : "GPT-3.5"
    },
    tags : [
        {
            type : String
        }
    ],
    pictures : [
        {
            public_id : { type : String},
            secure_url : { type : String }
        }
    ],
    rating : {
        type : Number,
        default : 0,
    },
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    visibility : {
        type : String,
        enum : ["Public", "Private", "Draft"],
        default : "draft"
    }
}, {
    timestamps : true
})

export const Prompt = mongoose.model("Prompt", promptSchema);
