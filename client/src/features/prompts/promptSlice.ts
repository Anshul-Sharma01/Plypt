import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";
import { toastHandler } from "../../helpers/toastHandler";


export const createPromptThunk = createAsyncThunk("prompt/create", async(data : any, { rejectWithValue }) => {
    try{
        const promise = axiosInstance.post("prompt/", data);
        toastHandler(promise, "Crafting Prompt...", "Prompt Crafted Successfully");
        const res = await promise;
        return res.data;
    }catch(err){
        console.log(`Error occurred while creating prompt : ${err}`);
    }
})

export const getAllPromptsThunk = createAsyncThunk("prompt/get-all", async(_, { rejectWithValue }) => {
    try{
        const promise = axiosInstance.get("prompt/");
        toastHandler(promise, "Fetching all prompts...", "Successfully fetched all prompts");
        const res = await promise;
        return res.data;
    }catch(err){
        console.error(`Error occurred while fetching all prompts : ${err}`);
    }
})




const promptSlice = createSlice({
    name : "prompt",
    initialState : {},
    reducers : {},
    extraReducers : (builder) => {
        builder
            
    }
})