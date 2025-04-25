import { z } from "zod";
import { ApiError } from "./ApiError.js";


const usernameSchema = z.string()
    .min(3, "Username must be of atleast 3 characters")
    .max(12, "Username cannot be more than 12 characters")


const emailSchema = z.string()
    .email("Invalid Email format")


const passwordSchema = z.string()
    .min(8, "Password must be of at least 8 characters long")
    .max(16, "Password must not exceed 16 chracters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(
        /[@$!%*?&]/,
        "Password must contain at least one special character ( @, $, !, %, *, ?, &"
    );

const usernameValidation = (username) => {
    try{
        const validateUsername = usernameSchema.safeParse(username);
        if(!validateUsername.success){
            throw new ApiError(400, validateUsername.error.issues[0].message);
        }
    }catch(err){
        throw new ApiError(400, err?.message || "Invalid Username");
    }
}

const emailValidation = (email) => {
    try{
        const validateEmail = emailSchema.safeParse(email);
        if(!validateEmail.success){
            throw new ApiError(400, validateEmail.error.issues[0].message);
        }
    }catch(err){
        throw new ApiError(400, err?.message || "Invalid Email");
    }
}

const passwordValidation = (passowrd) => {
    try{
        const validatePassword = passwordSchema.safeParse(passowrd);
        if(!validatePassword.success){
            const errorMessages = validatePassword.error.issues.map(issue => issue.message);
            throw new ApiError(400, errorMessages[0]);
        }
    }catch(err){
        throw new ApiError(400, err?.message || "Invalid Password");
    }
}


export {
    usernameValidation,
    emailValidation,
    passwordValidation
}