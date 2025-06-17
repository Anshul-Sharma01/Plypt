import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";
import { toastHandler } from "../../helpers/toastHandler";


export const toggleBookmarkThunk = createAsyncThunk("bookmark/toggle", async({ promptId } : any, {rejectWithValue}) => {
    try{
        const promise = axiosInstance.post(`bookmark/toggle/${promptId}`);
        toastHandler(promise, "Wait for a moment", "Successfully toggled the bookmark for prompt");
        const res = await promise;
        return res.data;
    }catch(err : any){
        return rejectWithValue(err?.response?.data?.message || "Error occurred while toggling prompt for bookmark");
    }
})

export const fetchMyBookmarksThunk = createAsyncThunk("bookmark/my", async(_, {rejectWithValue}) => {
    try{
        const promise = axiosInstance.get("bookmark/my-bookmarks");
        toastHandler(promise, "Fetching your bookmarks", "Successfully fetched the bookmarks");
        const res = await promise;
        return res.data;
    }catch(err : any){  
        return rejectWithValue(err?.response?.data?.message || "Error occurred while fething my bookmarks");
    }
})


const likeSlice = createSlice({
    name : "bookmark",
    initialState : {},
    reducers : {},
    extraReducers : (builder) => {
        builder
            .addCase(toggleBookmarkThunk.rejected, (_, action) => {
                toast.error(action.payload as string);
            })
            .addCase(fetchMyBookmarksThunk.rejected, (_, action) => {
                toast.error(action.payload as string);
            })
    }
})

export default likeSlice.reducer;