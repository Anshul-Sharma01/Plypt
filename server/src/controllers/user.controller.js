import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { usernameValidation, emailValidation, passwordValidation } from "../utils/inputValidation.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";


const cookieOptions = {
    httpOnly : true,
    secure : false,
    maxAge : 7 * 24 * 60 * 60 * 1000,
}

const generateAccessTokenAndRefreshToken = async(user) => {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refeshToken = refreshToken;
    await user.save({ validateBeforeSave : false });

    return { accessToken, refreshToken }
}

const registerUserController = asyncHandler(async(req, res) => {
    const { name, email, username, password, bio } = req.body;

    usernameValidation(username);
    emailValidation(email);
    passwordValidation(password);

    const usernameExists = await User.findOne({ username });
    if(usernameExists){
        throw new ApiError(400, "Username already exists");
    }

    const emailExists = await User.findOne({ email });
    if(emailExists){
        throw new ApiError(400, "Email already exists");
    }

    if(req.file){
        const filePath = req.file?.path;
        const avatar = await uploadOnCloudinary(filePath);
        if(!avatar){
            throw new ApiError(400, "Avatar not uploaded");
        }

        const user = await User.create({
            username : username.toLowerCase(),
            email, name, password, bio, 
            avatar : {
                public_id : avatar?.public_id,
                secure_url : avatar?.secure_url
            }
        })

        const createdUser = await User.findById(user._id);
        if(!createdUser){
            deleteFromCloudinary(avatar?.public_id);
            throw new ApiError(500, "Something went wrong while creating your account");

        }

        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(createdUser);

        return res.status(201)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                201,
                createdUser,
                "User Registered Successfully"
            )
        )


    }else{
        throw new ApiError(400, "Avatar file is required");
    }
})

const loginUserController = asyncHandler(async(req, res) => {
    const { inputValue, password } = req.body;

    const userExists = await User.findOne({
        $or : [{username : inputValue}, {email : inputValue}]
    }).select("+password");

    if(!checkUser){
        throw new ApiError(400, "User or Email not found");
    }

    const isPasswordValid = await userExists.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(400, "Invalid Password");
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(checkUser);

    const loginUser = await User.findById(userExists._id);
    if(!loginUser){
        throw new ApiError(500, "Something went wrong while logging in");
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
        new ApiResponse(
            200,
            loginUser,
            "User Logged In Successfully"
        )
    );

})

const refreshAccessTokenController = asyncHandler(async(req, res) => {
    const token = req.cookies.refreshToken || req.body.refreshToken;
    if(!token){
        throw new ApiError(401, "Unauthorized request");
    };

    try{
        const deocdedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(deocdedToken?._id);

        if(!user){
            throw new ApiError(401, "Invalid refresh token");
        }
        
        if(token != user?.refreshToken){
            throw new ApiError(401, "Refresh Token is expired or used");
        }
        const { accessToken, newRefreshToken } = await generateAccessTokenAndRefreshToken(user);

        return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { accessToken, refreshToken : newRefreshToken },
                "Access Token Refreshed"
            )
        );
    }catch(err){
        throw new ApiError(401, err?.message || "Invalid Refresh Token");
    }
})

const updateProfileController = asyncHandler(async(req, res) => {
    const { name, bio, username } = req.body;
    const userId = req.user?._id;
    
    if(!name && !bio && !username){
        throw new ApiError(400, "Atleast provide one field to update");
    }
    if(username){
        const usernameExists = await User.findOne({ username });
        if(usernameExists){
            throw new ApiError(400, "Username already taken");
        }
    }

    const updationFields = {};
    if(name) updationFields.name = name;
    if(bio) updationFields.bio = bio;

    if(username) updationFields.username = username;

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $set : updationFields
        },
        {
            new : true,
            runValidators : true
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedUser,
            "Profile Details updated Successfully"
        )
    )
})

const updateAvatarController = asyncHandler(async(req, res) => {
    const userId = req.user?._id;
    if(!req.file){
        throw new ApiError(400, "Avatar file is required");
    }

    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404, "User not found");
    }

    const avatar = await uploadOnCloudinary(req.file?.path);
    if(!avatar.secure_url){
        throw new ApiError(400, "Please try again");
    }
    await deleteFromCloudinary(user.avatar.public_id);
    user.avatar.secure_url = avatar?.secure_url;
    user.avatar.public_id = avatar?.public_id;

    await user.save({ validateBeforeSave : false });
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "Successfully updated Profile Picture"
        )
    )
})

const logoutUserController = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset : {
                refreshToken : 1
            }
        },
        {
            new : true
        }
    )

    return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(
        new ApiResponse(
            200,
            {},
            "User Logged Out Successfully"
        )
    )
})

export {
    registerUserController,
    loginUserController,
    refreshAccessTokenController,
    updateProfileController,
    updateAvatarController,
    logoutUserController
}