import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";
import { toastHandler } from "../../helpers/toastHandler";

const initialState = {
    likedPrompts : []
}

export const toggleLikeThunk = createAsyncThunk("like/toggle", async({ promptId } : any, { rejectWithValue }) => {
    try{
        const promise = axiosInstance.post(`like/toggle/${promptId}`);
        toastHandler(promise, "Wait for a moment...", "Successfully toggled the like");
        const res = await promise;
        return res.data;

    }catch(err : any){
        return rejectWithValue(err?.response?.data?.message || "Error occurred while toggling like ");
    }
})

export const getMyLikedPromptsThunk = createAsyncThunk("like/my-prompts", async({limit, page} : any, { rejectWithValue }) => {
    try{
        const promise = axiosInstance.get(`like/my-liked?limit=${limit}&page=${page}`);
        toastHandler(promise, "fething your liked prompts...", "Successfully fetched your liked prompts");
        const res = await promise;
        return res.data;
    }catch(err : any){
        return rejectWithValue(err?.response?.data?.message || "Error occurred while getting my liked prompts !!");
    }
})

export const getPromptLikesThunk = createAsyncThunk("like/count", async({ promptId } : any, {rejectWithValue}) => {
    try{
        const promise = axiosInstance.get(`like/count/${promptId}`);
        toastHandler(promise, "Fetching prompt likes", "Successfully fetched prompts likes");
        const res = await promise;
        return res.data;
    }catch(err : any){
        return rejectWithValue(err?.response?.data?.message || "Error occurred while fetching prompt likes count");
    }
})


export const getTopLikedPromptThunk = createAsyncThunk("like/top",async(_, {rejectWithValue}) => {
    try{
        const promise = axiosInstance.get(`like/top-liked`);
        toastHandler(promise, "fetching top liked prompts", "Successfully fetched top liked prompts");
        const res = await promise;
        return res.data;
    }catch(err : any){
        return rejectWithValue(err?.response?.data?.message || "Error occurred while fetching top liked prompts");
    }
})


const likeSlice = createSlice({
    name : "like",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
            .addCase(toggleLikeThunk.rejected, (_, action ) => {
                toast.error(action.payload as string);
            })
            .addCase(toggleLikeThunk.fulfilled, (state, action) => {
                state.likedPrompts = action?.payload?.data;
            })
            .addCase(getPromptLikesThunk.rejected, (_, action) => {
                toast.error(action.payload as string);
            })
            .addCase(getTopLikedPromptThunk.rejected, (_, action) => {
                toast.error(action.payload as string);
            })
            .addCase(getMyLikedPromptsThunk.rejected, (_, action) => {
                toast.error(action.payload as string);
            })
    }
})

export default likeSlice.reducer;