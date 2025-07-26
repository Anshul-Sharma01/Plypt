import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";
import { toastHandler } from "../../helpers/toastHandler";

interface PromptState {
  prompts: any[];
  myPrompts : any[],
  totalPrompts: number;
  totalPages: number;
  currentPage: number;
  loading: boolean;
  error: string | null;
}

const initialState: PromptState = {
  prompts: [],
  myPrompts : [],
  totalPrompts: 0,
  totalPages: 1,
  currentPage: 1,
  loading: false,
  error: null,
};

export const createPromptThunk = createAsyncThunk("prompt/create", async(data : any, { rejectWithValue }) => {
    try{
        const promise = axiosInstance.post("prompt/", data);
        toastHandler(promise, "Crafting Prompt...", "Prompt Crafted Successfully");
        const res = await promise;
        return res.data;
    }catch(err : any){
        return rejectWithValue(err.response?.data?.message || "Error occurred while crafting new prompt");
    }
})

export const getAllPromptsThunk = createAsyncThunk(
  "prompt/get-all",
  async (
    { page = 1, limit = 6 }: { page?: number; limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const promise = axiosInstance.get(`prompt/?page=${page}&limit=${limit}`);
      toastHandler(promise, "Fetching all prompts...", "Successfully fetched all prompts");
      const res = await promise;
      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Error occurred while fetching all prompts"
      );
    }
  }
);

export const getMyPromptsThunk = createAsyncThunk(
    "prompt/my-prompts",
    async(
        { craftorId, page = 1, limit = 6,} : { page? : number, limit? : number, craftorId? : any} = {},
        {rejectWithValue}
    ) => {
        try{
            const promise = axiosInstance.get(`prompt/my-prompts/${craftorId}?page=${page}&limit=${limit}`);
            toastHandler(promise, "Fetching your prompts...", "Successfully fetched your prompts");
            const res = await promise;
            return res.data;
        }catch(err : any){
            return rejectWithValue(
                err?.response?.data?.message || "Error occurred while fetching your prompts"
            )
        }
    }
);

export const getPromptBySlugThunk = createAsyncThunk("prompt/get-slug", async({ slug } : any, { rejectWithValue }) => {
    try{
        const promise = axiosInstance.get(`prompt/view/${slug}`);
        toastHandler(promise, "Fetching prompt...", "Successfully fetched prompt");
        const res = await promise;
        return res.data;
    }catch(err : any){
        return rejectWithValue(err.response?.data?.message || "Error occurred while fetching prompt")
    }
})

export const updatePromptDetailsThunk = createAsyncThunk("prompt/get-prompt-details", async(data : any, {rejectWithValue}) => {
    try{
        const promise = axiosInstance.patch(`prompt/update/${data.promptId}`);
        toastHandler(promise, 'Updating Prompt Details', "Successfully updated prompt details !!");
        const res = await promise;
        return res.data;
    }catch(err : any){
        return rejectWithValue(err.response?.data?.message || "Error occurred while updating prompt details !!");
    }
})

export const changeVisibilityThunk = createAsyncThunk("prompt/change-visibility", async(data: any, { rejectWithValue }) => {
    try{
        const promise = axiosInstance.patch(`prompt/visibility/${data.promptId}`);
        toastHandler(promise, "Changing Visibility...", "Prompt Visibility Changed Successfully");
        const res = await promise;
        return res.data;
    }catch(err : any){
        return rejectWithValue(err?.response?.data?.message || "Error occurred while changing the visibility of the prompt");
    }
})

export const addImageThunk = createAsyncThunk("prompt/add-image", async(data : any,  {rejectWithValue}) => {
    try{
        const promise = axiosInstance.post(`prompt/add-image/${data.promptId}`);
        toastHandler(promise, "adding new prompt image...", "Successfully added prompt Image");
        const res = await promise;
        return res.data;
    }catch(err : any){
        return rejectWithValue(err?.response?.data?.message || "Error occurred while adding Image to the prompt");
    }
})

export const deleteImagesThunk = createAsyncThunk("prompt/delete-image", async(data : any, { rejectWithValue }) => {
    try{
        const promise = axiosInstance.delete(`prompt/delete-images/${data.promptId}`);
        toastHandler(promise, "deleting prompt images...", "Successfully deleted Prompt Images");
        const res = await promise;
        return res.data;
    }catch(err : any){
        return rejectWithValue(err?.response?.data?.message || "Error occurred while deleting image ");
    }
})

const promptSlice = createSlice({
    name : "prompt",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
            .addCase(getAllPromptsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllPromptsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.prompts = action.payload.data.allPrompts;
                state.totalPrompts = action.payload.totalPrompts;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(getAllPromptsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getMyPromptsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyPromptsThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.myPrompts = action.payload.data.myPrompts;
                state.totalPrompts = action.payload.totalPrompts;
                state.totalPages = action.payload.totalPages;
                state.currentPage = action.payload.currentPage;
            })
            .addCase(getMyPromptsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                
            })
            .addCase(createPromptThunk.rejected, (_, action) => {
                toast.error(action.payload as string);
            })
            .addCase(getPromptBySlugThunk.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getPromptBySlugThunk.rejected, (_, action) => {
                toast.error(action.payload as string);
            })
            .addCase(updatePromptDetailsThunk.rejected, (_, action) => {
                toast.error(action.payload as string);
            })
            .addCase(changeVisibilityThunk.rejected, (_, action) => {
                toast.error(action.payload as string);
            })
            .addCase(addImageThunk.rejected, (_, action) => {
                toast.error(action.payload as string);
            })
            .addCase(deleteImagesThunk.rejected, (_, action) => {
                toast.error(action.payload as string);
            })
    }
})

export default promptSlice.reducer;
