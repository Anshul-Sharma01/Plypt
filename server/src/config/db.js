import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async() => {
    try{
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log("MongoDB Connected Successfully");
    }catch(err){
        console.error(`MongoDB connection failed : ${err.message}`);
        process.exit(1);
    }
}