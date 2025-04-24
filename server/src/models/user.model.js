import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";


const userSchema = new Schema({
    name : {
        type : String,
        required : [true, "Name is required"],
        trim : true
    },
    username : {
        type : String,
        required : [true, "Username is required"],
        unique : [true, "Username already exists"],
        lowercase : true,
        trim : true
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : [true, "Email already exists"],
        lowercase : true,
        trim : true
    },
    avatar : {
        public_id : {
            type : String,
        },
        secure_url : {
            type : String
        }
    },
    password : {
        type : String,
        required : [true, "Password is required"],
        select : false
    },
    bio : {
        type : String,
        required : [true, "Bio is required"]
    },
    role : {
        type : String,
        enum : ["user", "admin"],
        default  : "user"
    },
    isCraftor : {
        type : Boolean,
        default : false
    },
    refreshToken : {
        type : String,
    },
    forgotPasswordToken : {
        type : String,
    },
    forgotPasswordExpiry : {
        type : Date
    }
}, {
    timestamps : true
})

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();
    
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods = {
    generateAccessToken : function(){
        return jwt.sign(
            {
                _id : this._id,
                email : this.email,
                username : this.username
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn : process.env.ACCESS_TOKEN_EXPIRY
            }
        )
    },

    generateRefreshToken : function(){
        return jwt.sign(
            {
                _id : this._id,
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn : process.env.REFRESH_TOKEN_EXPIRY
            }
        )
    },

    isPasswordCorrect : async function (password){
        if(!password || typeof password !== "string"){
            throw new Error("Password must be a string");
        }
        return await bcrypt.compare(password, this.password);
    },

    generatePasswordResetToken : async function(){
        const resetToken = crypto.randomBytes(20).toString("hex");
        this.forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        this.forgotPasswordExpiry = Date.now() + 15 * 60 * 1000;
        return resetToken;
    }
}


export const User = mongoose.model("User", userSchema);
