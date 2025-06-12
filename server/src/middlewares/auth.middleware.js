import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authMiddleware = asyncHandler(async (req, _, next) => {
    let token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();

    if (!token) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        return next();

    } catch (err) {
        // 🧠 Handle JWT expired gracefully
        if (err.name === "TokenExpiredError") {
            // let it fail silently with 401, so frontend can retry with refresh token
            throw new ApiError(401, "Access Token Expired");
        }

        throw new ApiError(401, err?.message || "Invalid Access Token");
    }
});


