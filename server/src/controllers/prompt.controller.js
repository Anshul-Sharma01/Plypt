import { Prompt } from "../models/prompt.model.js";
import slugify from "slugify";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createPromptController = asyncHandler(async(req, res) => {
    const { title, description, content, price, category, model, tags} = req.body;
    const userId = req?.user?._id;
    if(!title || !description || !content){
        throw new ApiError(400, "Title, Description and Content are required");
    }
    if(!Array.isArray(tags)){
        throw new ApiError(400, "Please provide tags in proper format");
    }

    const generatedSlug = slugify(title, { lower : true, strict : true });

    const slugExists = await Prompt.findOne({ slug : generatedSlug });
    if(slugExists){
        throw new ApiError(400, "Prompt Title already exists, please try some different title");
    }


    const images = [];
    if(req?.files || req?.files?.length > 0){
        for(const file of req.files){
            const imgLocalPath =file.path;
            const img = await uploadOnCloudinary(imgLocalPath);
            if(!img){
                throw new ApiError(400, "File Corrupted, Please try again later...");
            }
            images.push({
                public_id : img?.public_id,
                secure_url : img?.secure_url
            })
        }
    }else{
        throw new ApiError(400, "Atleast one prompt output image is required for publishing a prompt");
    }

    const prompt = await Prompt.create({
        title,
        slug : generatedSlug,
        description,
        content,
        craftor : userId,
        price,
        category,
        model,
        tags,
        pictures : images,
    })

    return res.status(201)
    .json(
        new ApiResponse(
            201,
            prompt,
            "Prompt Successfully Published as a draft"
        )
    )
})

const getPromptBySlugController = asyncHandler(async(req, res) => {
    const { slug } = req.params;
    if(!slug){
        throw new ApiError(400, "Please provide the slug");
    }
    
    const prompt = await Prompt.findOne({ slug });
    if(!prompt){
        throw new ApiError(404, "Invalid Slug, Prompt not found");
    }
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            prompt,
            "Prompt successfully fetched "
        )
    );
})

const getAllPromptsController = asyncHandler(async(req, res) => {
    let { page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = ( page - 1 ) * limit;
    const totalPrompts = await Prompt.countDocuments();

    if(totalPrompts === 0){
        return res.status(200)
        .json(
            new ApiResponse(
                200, 
                {
                    allPrompts : [],
                    totalPrompts,
                    totalPages : 0,
                    currentPage : page
                }
            )
        )
    }


    const allPrompts = await Prompt.find({})
        .skip(skip)
        .limit(limit)
        .sort({ createdAt : -1 });
    
    const totalPages = Math.ceil(totalPrompts / limit);
    if(page > totalPages){
        throw new ApiError(400, "Page exceeds total number of pages");
    }
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            {
                allPrompts,
                totalPrompts,
                totalPages : totalPages,
                currentPage : page
            },
            "All Prompts Fetched successfully"
        )
    )
});


export { 
    createPromptController,
    getPromptBySlugController,
    getAllPromptsController
}