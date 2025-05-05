import { Prompt } from "../models/prompt.model.js";
import slugify from "slugify";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteMultipleFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";
import { Craftor } from "../models/craftor.model.js";

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
    
    const craftor = await Craftor.findOne({ user : userId });
    if(!craftor){
        throw new ApiError(400, "Craftor Id not activated yet, first activate that");
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

    craftor.prompts.push(prompt);
    await craftor.save();



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

const changeVisibilityController = asyncHandler(async (req, res) => {
    const { promptId } = req.params;
    const { visibility } = req.body;
    const userId = req?.user?._id;

    if (!isValidObjectId(promptId)) {
        throw new ApiError(400, "Invalid Prompt ID");
    }

    const allowedVisibilities = ["Public", "Private", "Draft"];
    if (!allowedVisibilities.includes(visibility)) {
        throw new ApiError(400, "Invalid visibility option");
    }

    const prompt = await Prompt.findById(promptId);

    if (!prompt) {
        throw new ApiError(404, "Prompt not found");
    }

    if (prompt.craftor.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to change visibility of this prompt");
    }

    prompt.visibility = visibility;
    await prompt.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            { 
                promptId, 
                newVisibility: prompt.visibility 
            },
            "Visibility successfully updated"
        )
    );
});

const updatePromptDetailsController = asyncHandler(async(req, res) => {
    const { promptId } = req.params;
    const userId = req?.user?._id;

    if(!isValidObjectId(promptId)){
        throw new ApiError(400, "Invalid Prompt Id");
    }

    const prompt = await Prompt.findById(promptId);

    if(!prompt){
        throw new ApiError(404, "Prompt not found");
    }

    if(prompt.craftor.toString() !== userId.toString()){
        throw new ApiError(403, "You are not allowed to update this prompt");
    }

    const {
        title,
        description,
        content,
        category,
        model,
        tags,
        price, 
        visibility
    } = req.body;

    if(title && title.trim() !== prompt.title){
        prompt.title = title;
        prompt.slug = slugify(title, { lower : true, strict : true });
        const existingSlug = await Prompt.findOne({ slug : prompt.slug });
        if(existingSlug && existingSlug._id.toString() !== prompt._id.toString()){
            throw new ApiError(400, "This title already exists, Choose a different one");
        }
    }
    
    if(description) prompt.description = description;
    if(content) prompt.content = content;
    if(category) prompt.category = category;
    if(model) prompt.model = model;
    if(Array.isArray(tags)) prompt.tags = tags;
    if(price !== undefined) prompt.price = price;
    if(visibility){
        const allowedVisibilities = ["Public", "Private", "Draft"];
        if(!allowedVisibilities.includes(visibility)){
            throw new ApiError(400, "Invalid visibility option");
        }
        prompt.visibility = visibility;
    }

    await prompt.save();
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            prompt,
            "Prompt updated successfully"
        )
    )
    
});


const addPromptImageController = asyncHandler(async(req, res) =>{
    const { promptId } = req.params;
    const userId = req?.user?._id;
    if(!isValidObjectId(promptId)){
        throw new ApiError(400, "Invalid Prompt Id");
    }

    const prompt = await Prompt.findById(promptId);
    if(prompt.craftor.toString() !== userId.toString()){
        throw new ApiError(403, "You are not allowed to update this prompt");
    }
    if(!req.file){
        throw new ApiError(400, "No Image provided");
    }
    const uploadedImage = await uploadOnCloudinary(req.file.path);

    if (!uploadedImage?.secure_url || !uploadedImage?.public_id){
        throw new ApiError(400, "Image upload response is invalid");
    }    

    if(!uploadedImage){
        throw new ApiError(400, "Error uploading image");
    }

    prompt.pictures.push({
        public_id : uploadedImage?.public_id,
        secure_url : uploadedImage?.secure_url
    });

    await prompt.save();
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            prompt,
            "Prompt Added successfully"
        )
    );


})

const deletePromptImagesController = asyncHandler(async(req, res) => {
    const { promptId } = req.params;
    const userId = req.user?._id;
    const { public_ids } = req.body;
    if(!isValidObjectId(promptId)){
        throw new ApiError(400, "Prompt id is invalid");
    }
    if(!Array.isArray(public_ids) || public_ids.length === 0){
        throw new ApiError(400, "Public IDs array is required");
    }

    const prompt = await Prompt.findById(promptId);
    
    if(prompt.craftor.toString() !== userId.toString()){
        throw new ApiError(403, "You are not allowed to update this prompt");
    }

    const imagesToDelete = prompt.pictures.filter(img => public_ids.includes(img.public_id));
    
    if(imagesToDelete.length === 0){
        throw new ApiError(404, "No matching images found to delete");
    }

    

    try {
        await deleteMultipleFromCloudinary(public_ids);
    } catch (err) {
        throw new ApiError(500, "Failed to delete Images from Cloudinary");
    }

    prompt.pictures = prompt.pictures.filter(img => !public_ids.includes(img.public_id));
    await prompt.save();
    return res.status(200)
    .json(
        new ApiResponse(
            200,
            prompt,
            "Images deleted Successfully"
        )
    )
})


export { 
    createPromptController,
    getPromptBySlugController,
    getAllPromptsController,
    changeVisibilityController,
    updatePromptDetailsController,
    deletePromptImagesController,
    addPromptImageController,
}