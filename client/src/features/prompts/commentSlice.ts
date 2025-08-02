import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";
import { toastHandler } from "../../helpers/toastHandler";




export const addCommentThunk = createAsyncThunk("comment/add", async(data, { rejectWithValue }) => {
    try{
        const promise = axiosInstance.post("comment/add", data);
        toastHandler(promise, "Adding comment", "Comment added successfully");
        const res = await promise;
        return res.data;
    }catch(err : any){
        return rejectWithValue(err?.response?.data?.message || "Error occurred while adding comment");
    }
})

export const deleteCommentThunk = createAsyncThunk("comment/delete", async({ commentId } : any, { rejectWithValue }) => {
    try{
        const promise = axiosInstance.delete(`comment/delete/${commentId}`);
        toastHandler(promise, "Deleting comment", "Comment deleted successfully");
        const res = await promise;
        return res.data;
    }catch(err : any){
        return rejectWithValue(err?.response?.data?.message || "Error occurred while deleting comment");
    }
})

export const fetchCommentsThunk = createAsyncThunk("comment/fetch", async({ promptId }, {rejectWithValue}) => {
    try{
        console.log("PromptId : ", promptId);
        const promise = axiosInstance.get(`comment/fetch/${promptId}`);
        toastHandler(promise, "Fetching comments", "Comments fetched successfully");
        const res = await promise;
        return res.data;
    }catch(err : any){
        console.log("Error" , err);
        return rejectWithValue(err?.response?.data?.message || "Error occurred while fetching comments");
    }
})


const commentSlice = createSlice({
    name : "comment",
    initialState : {},
    reducers : {},
    extraReducers : (builder) => {
        builder
            .addCase(deleteCommentThunk.rejected, (_, action) => {
                toast.error(action.payload as string);
            })
            .addCase(fetchCommentsThunk.rejected, (_, action) => {
                toast.error(action.payload as string);
            })
            .addCase(addCommentThunk.rejected, (_, action) => {
                toast.error(action.payload as string);
            })
    }
})

export default commentSlice.reducer;
