import { Prompt } from "../models/prompt.model.js";
import slugify from "slugify";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteFromCloudinary, deleteMultipleFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";
import { Craftor } from "../models/craftor.model.js";
import { inngest } from "../inngest/client.js";

const createPromptController = asyncHandler(async (req, res) => {
    const { title, description, content, price, category, model, tags, visibility, isBiddable } = req.body;
    const userId = req?.user?._id;
    if (!title || !description || !content) {
        throw new ApiError(400, "Title, Description and Content are required");
    }
    if (!Array.isArray(tags)) {
        throw new ApiError(400, "Please provide tags in proper format");
    }

    const generatedSlug = slugify(title, { lower: true, strict: true });

    const slugExists = await Prompt.findOne({ slug: generatedSlug });
    if (slugExists) {
        throw new ApiError(400, "Prompt Title already exists, please try some different title");
    }
    // console.log("It was here !!");


    const images = [];
    if (req?.files || req?.files?.length > 0) {
        for (const file of req.files) {
            const imgLocalPath = file.path;
            const img = await uploadOnCloudinary(imgLocalPath);
            if (!img) {
                throw new ApiError(400, "File Corrupted, Please try again later...");
            }
            images.push({
                public_id: img?.public_id,
                secure_url: img?.secure_url
            })
        }
    } else {
        throw new ApiError(400, "Atleast one prompt output image is required for publishing a prompt");
    }

    const craftor = await Craftor.findOne({ user: userId });
    if (!craftor) {
        throw new ApiError(400, "Craftor Id not activated yet, first activate that");
    }

    const prompt = await Prompt.create({
        title,
        slug: generatedSlug,
        description,
        content,
        craftor: craftor._id,
        price,
        category,
        model,
        tags,
        visibility,
        isBiddable,
        pictures: images,
    })

    craftor.prompts.push(prompt);
    if (craftor.tier == 'Basic' && craftor.prompts.length >= 5) {
        craftor.tier = 'Basic-Advanced';
    }else if(craftor.tier == 'Basic-Advanced' && craftor?.prompts?.length >= 10){
        craftor.tier = 'Pro';
    }else if(craftor.tier == 'Pro' && craftor?.prompts?.length >= 20){
        craftor.tier = 'Elite';
    }

    await craftor.save();
    // await fetch(`http://localhost:5000/api/v1/inngest/prompt/creation`, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //         data: {
    //             promptId: prompt._id.toString()
    //         }
    //     })
    // });


    // console.log(`Prompt ${prompt._id} created by user ${userId}, AI review triggered.`);



    return res.status(201)
        .json(
            new ApiResponse(
                201,
                prompt,
                "Prompt Successfully Published as a draft"
            )
        )
})

const getPromptBySlugController = asyncHandler(async (req, res) => {
    const { slug } = req.params;

    if (!slug) {
        throw new ApiError(400, "Please provide the slug");
    }

    let prompt = await Prompt.findOne({ slug })
        .select("-content")
        .populate({
            path: "craftor",
            populate: {
                path: "user",
                model: "User",
                select: "avatar name",
            },
        })
        .populate({
            path: "reviews",
            populate: {
                path: "buyer",
                model: "User",
                select: "name avatar",
            },
        });

    if (!prompt) {
        throw new ApiError(404, "Invalid Slug, Prompt not found");
    }

    const user = prompt?.craftor;

    const modifiedPrompt = {
        ...prompt._doc,
        craftor: {
            name: user?.user?.name || "",
            _id: user?._id,
            slug: user?.slug,
            avatar: user?.user?.avatar?.secure_url || "",
        },
    };

    return res.status(200).json(
        new ApiResponse(200, { prompt: modifiedPrompt }, "Prompt successfully fetched")
    );
});

const getAllPromptsController = asyncHandler(async (req, res) => {
    let { page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;
    const totalPrompts = await Prompt.countDocuments({ visibility: "Public" });

    if (totalPrompts === 0) {
        return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        allPrompts: [],
                        totalPrompts,
                        totalPages: 0,
                        currentPage: page
                    }
                )
            )
    }


    const rawPrompts = await Prompt.find({ visibility: "Public" })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .select("-content -reviews -pictures -updatedAt -visibility")
        .populate({
            path: "craftor",
            populate: {
                path: "user",
                model: "User",
                select: "avatar name"
            }
        });

    const formatPrompt = (prompt) => {
        const user = prompt?.craftor?.user;
        return {
            ...prompt._doc,
            craftor: {
                name: user?.name || "",
                avatar: user?.avatar?.secure_url || ""
            }
        };
    };

    const allPrompts = rawPrompts.map(formatPrompt);



    const totalPages = Math.ceil(totalPrompts / limit);
    if (page > totalPages) {
        throw new ApiError(400, "Page exceeds total number of pages");
    }
    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    allPrompts,
                    totalPrompts,
                    totalPages: totalPages,
                    currentPage: page
                },
                "All Prompts Fetched successfully"
            )
        )
});

const getMyPromptsController = asyncHandler(async (req, res) => {
    let { page, limit } = req.query;
    const { craftorId } = req.params;

    page = parseInt(page) || 3;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;
    const totalPrompts = await Prompt.countDocuments();

    if (totalPrompts == 0) {
        return res.status(200)
            .json(
                new ApiResponse(
                    200,
                    {
                        myPrompts: [],
                        totalPrompts,
                        totalPages: 0,
                        currentPage: page
                    }
                )
            )
    }


    const myPrompts = await Prompt.find({ craftor: craftorId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .select("-content -reviews -pictures -currentBid -updatedAt -visibility -craftor");


    const totalPages = Math.ceil(totalPrompts / limit);
    if (page > totalPages) {
        throw new ApiError(400, "Page exceeds total number of pages");
    }

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                {
                    myPrompts,
                    totalPrompts,
                    totalPages,
                    currentPage: page
                },
                "My Prompts fetched successfully"
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

    const prompt = await Prompt.findById(promptId).select("-content").populate("craftor");

    if (!prompt) {
        throw new ApiError(404, "Prompt not found");
    }

    console.log("Craftor : ", prompt?.craftor);
    console.log("userId : ", userId);

    if (prompt?.craftor?.user?.toString() !== userId.toString()) {
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

const updatePromptDetailsController = asyncHandler(async (req, res) => {
    const { promptId } = req.params;
    const userId = req?.user?._id;

    if (!isValidObjectId(promptId)) {
        throw new ApiError(400, "Invalid Prompt Id");
    }

    const prompt = await Prompt.findById(promptId).populate("craftor");

    if (!prompt) {
        throw new ApiError(404, "Prompt not found");
    }

    if (prompt?.craftor?.user?.toString() !== userId.toString()) {
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

    if (title && title.trim() !== prompt.title) {
        prompt.title = title;
        prompt.slug = slugify(title, { lower: true, strict: true });
        const existingSlug = await Prompt.findOne({ slug: prompt.slug });
        if (existingSlug && existingSlug._id.toString() !== prompt._id.toString()) {
            throw new ApiError(400, "This title already exists, Choose a different one");
        }
    }

    if (description) prompt.description = description;
    if (content) prompt.content = content;
    if (category) prompt.category = category;
    if (model) prompt.model = model;
    if (Array.isArray(tags)) prompt.tags = tags;
    if (price !== undefined) prompt.price = price;
    if (visibility) {
        const allowedVisibilities = ["Public", "Private", "Draft"];
        if (!allowedVisibilities.includes(visibility)) {
            throw new ApiError(400, "Invalid visibility option");
        }
        prompt.visibility = visibility;
    }

    await prompt.save();
    prompt.content = "";
    return res.status(200)
        .json(
            new ApiResponse(
                200,
                prompt,
                "Prompt updated successfully"
            )
        )

});

const addPromptImageController = asyncHandler(async (req, res) => {
    const { promptId } = req.params;
    const userId = req?.user?._id;
    if (!isValidObjectId(promptId)) {
        throw new ApiError(400, "Invalid Prompt Id");
    }

    const prompt = await Prompt.findById(promptId).populate("craftor").select("-content");
    if (prompt?.craftor?.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to update this prompt");
    }
    if (!req.file) {
        throw new ApiError(400, "No Image provided");
    }
    const uploadedImage = await uploadOnCloudinary(req.file.path);

    if (!uploadedImage?.secure_url || !uploadedImage?.public_id) {
        throw new ApiError(400, "Image upload response is invalid");
    }

    if (!uploadedImage) {
        throw new ApiError(400, "Error uploading image");
    }

    prompt.pictures.push({
        public_id: uploadedImage?.public_id,
        secure_url: uploadedImage?.secure_url
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

const deletePromptImagesController = asyncHandler(async (req, res) => {
    const { promptId } = req.params;
    const userId = req.user?._id;
    const { public_ids } = req.body;
    if (!isValidObjectId(promptId)) {
        throw new ApiError(400, "Prompt id is invalid");
    }
    if (!Array.isArray(public_ids) || public_ids.length === 0) {
        throw new ApiError(400, "Public IDs array is required");
    }

    const prompt = await Prompt.findById(promptId).populate("craftor");

    if (prompt?.craftor?.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to update this prompt");
    }

    const imagesToDelete = prompt.pictures.filter(img => public_ids.includes(img.public_id));

    if (imagesToDelete.length === 0) {
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

const deletePromptImageController = asyncHandler(async (req, res) => {
    const { promptId } = req.params;
    const userId = req.user?._id;
    const { imgToDeletePublicId } = req.query;
    console.log("imgToDeletePublicId : ", imgToDeletePublicId);
    if (!isValidObjectId(promptId)) {
        throw new ApiError(400, "Prompt id is invalid");
    }
    if (!imgToDeletePublicId) {
        throw new ApiError(400, "Please provide the image to delete");
    }

    const prompt = await Prompt.findById(promptId).populate("craftor").select("-content");

    if (prompt?.craftor?.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to update this prompt");
    }


    try {
        await deleteFromCloudinary(imgToDeletePublicId);
    } catch (err) {
        console.log("Err : ", err);
        throw new ApiError(500, "Failed to delete Images from Cloudinary");
    }

    prompt.pictures = prompt.pictures.filter((img) => img?.public_id != imgToDeletePublicId);
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

const deletePromptController = asyncHandler(async (req, res) => {
    const { promptId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(promptId)) {
        throw new ApiError(400, "Invalid Prompt ID");
    }

    const prompt = await Prompt.findById(promptId).populate("craftor");

    if (!prompt) {
        throw new ApiError(404, "Prompt not found");
    }

    if (prompt?.craftor?.user?.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to delete this prompt");
    }

    if (prompt.pictures && prompt.pictures.length > 0) {
        const publicIds = prompt.pictures.map(img => img.public_id);
        try {
            await deleteMultipleFromCloudinary(publicIds);
        } catch (err) {
            console.log("Error deleting images from cloudinary:", err);
        }
    }

    const craftor = await Craftor.findById(prompt.craftor._id);
    if (craftor) {
        craftor.prompts = craftor.prompts.filter(p => p.toString() !== promptId);
        await craftor.save();
    }

    await Prompt.findByIdAndDelete(promptId);
    
    if (craftor.tier == 'Elite' && craftor.prompts.length < 20) {
        craftor.tier = 'Pro';
    }else if(craftor.tier == 'Pro' && craftor?.prompts?.length < 10){
        craftor.tier = 'Basic-Advanced';
    }else if(craftor.tier == 'Basic-Advanced' && craftor?.prompts?.length < 5){
        craftor.tier = 'Basic';
    }

    return res.status(200)
        .json(
            new ApiResponse(
                200,
                { promptId },
                "Prompt deleted successfully"
            )
        )
})


export {
    createPromptController,
    getPromptBySlugController,
    getAllPromptsController,
    getMyPromptsController,
    changeVisibilityController,
    updatePromptDetailsController,
    deletePromptImagesController,
    deletePromptImageController,
    addPromptImageController,
    deletePromptController,
}