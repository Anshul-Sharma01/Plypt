import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { Bookmark } from "../models/bookmark.model.js";

const toggleBookmarkController = asyncHandler(async(req, res) => {
    const userId = req.user?._id;
    const { promptId } = req.params;

    if(!isValidObjectId(promptId)){
        throw new ApiError(400, "Invalid Prompt Id");
    }

    const bookmarkDocument = await Bookmark.findOne({ user : userId, prompt : promptId});
    
    if(bookmarkDocument){
        await bookmarkDocument.deleteOne();

        let bookmarkedPrompts = await Bookmark.find({ user : userId })
        .select("prompt -_id")
        .lean();

        bookmarkedPrompts = bookmarkedPrompts
        .map(ele => ele?.prompt?.toString())
        .filter(Boolean);



        return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    bookmarked : false,
                    bookmarkedPrompts
                },
                "Successfully deleted the bookmark document"
            )
        )
    }else{
        const newBookmark = await Bookmark.create({
            user : userId,
            prompt : promptId
        });
        
        let bookmarkedPrompts = await Bookmark.find({ user : userId })
        .select("prompt -_id")
        .lean();

        bookmarkedPrompts = bookmarkedPrompts
        .map(ele => ele?.prompt?.toString())
        .filter(Boolean);


        return res.status(201)
        .json(
            new ApiResponse(
                201,
                {
                    bookmarked : true,
                    bookmarkedId : newBookmark._id,
                    bookmarkedPrompts
                },
                "Successfully created the bookmark document"
            )
        )
    }

})

const getUserBookmarksController = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    let userBookmarks = await Bookmark.find({ user: userId })
    .populate({
        path : "prompt",
        populate : {
            path : "craftor",
            populate : {
                path : "user",
                select : "name avatar"
            }
        }
    });

    userBookmarks = userBookmarks.map(e => e?.prompt);
    const bookmarkCount = userBookmarks.length;

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                bookmarks: bookmarkCount,
                bookmarkedPrompts : userBookmarks
            },
            bookmarkCount === 0 ? "No Bookmarked Prompts Yet" : "Fetched bookmarks successfully"
        )
    );
});



export { 
    toggleBookmarkController,
    getUserBookmarksController
}

