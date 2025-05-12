
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path : "./.env" });

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async(localFilePath) => {
    try{
        if(!localFilePath){
            throw new Error("No file path provided");
        }

        const cloudinaryResponse = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "image",
            folder : "Plypt"
        }).catch((err) => {
            console.error(`Error occurredat cloudinary service : ${err}`);
        })
        if(fs.existsSync(localFilePath)){
            fs.unlinkSync(localFilePath);
            console.log(`File ${localFilePath} successfully deleted`);
        }
        return cloudinaryResponse;

    }catch(err){
        if(localFilePath && fs.existsSync(localFilePath)){
            fs.unlinkSync(localFilePath);
        }
        console.error(`Cloudinary Upload Error : ${err.message}`);
        throw new Error("Failed to Upload file to cloudinary")
    }
}

const deleteMultipleFromCloudinary = async(publicIds) => {
    try{
        await cloudinary.api.delete_resources(publicIds);
    }catch(err){
        console.error(`Cloudinary batch delete error : ${err}`);
        throw new Error("Failed to delete images from cloudinary");
    }
}

const deleteFromCloudinary = async(public_id) => {
    try{
        await cloudinary.uploader.destroy(
            public_id, {
                invalidate : true,
                resource_type : "image"
            }
        )
    }catch(err){
        console.log(`Error occurred while deleting file from cloudinary : ${err}`);
        return null;
    }
}


export { 
    uploadOnCloudinary,
    deleteFromCloudinary,
    deleteMultipleFromCloudinary
}