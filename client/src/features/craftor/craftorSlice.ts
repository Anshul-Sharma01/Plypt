import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";
import { toastHandler } from "../../helpers/toastHandler";

const updateLocalStorage = (craftor : any) => {

}



interface CraftorState {
    craftorData : any;
    loading : boolean;
    error : string | null;
}

const initialState : CraftorState = {
    craftorData : localStorage.getItem("isLoggedIn") === "true",
    loading : false,
    error : null
}

export const activateCraftorAccount = createAsyncThunk("auth/craftor/activate", async(data : any, { rejectWithValue } ) => {
    try{
        const promise = axiosInstance.post("craftor/activate", data);
        toastHandler(promise, "Activating Craftor Account", "Craftor Account Activated Successfully !");
        const res = await promise;
        return res.data;
    }catch(err : any){
        return rejectWithValue(err.response?.data?.message || "Error occurred while activating craftor account");
    }
})

export const getCraftorProfile = createAsyncThunk("auth/craftor/get-profile", async(data : any, { rejectWithValue }) => {
    try{
        const promise = axiosInstance.get(`craftor/get-profile/${data.slug}`);
        toastHandler(promise, "Fetching profile...", "Profile Fetched Successfully");
        const res = await promise;
        return res.data;
    }catch(err : any){
        return rejectWithValue(err?.response?.data?.message || "Error occurred while fetching profile !!");
    }
})

export const updatePaymentDetailsThunk = createAsyncThunk("auth/craftor/update-payment", async(data : any, { rejectWithValue }) => {
    try{
       const promise = axiosInstance.patch(`craftor/update-payment/${data.slug}`, data);
       const res = await promise;
       return res.data;
    }catch(err : any){
        return rejectWithValue(err?.response?.data?.message || "Error occurred while updating payment details !!");
    }
})

const craftorSlice = createSlice({
    name : "craftor",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
            .addCase(activateCraftorAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(activateCraftorAccount.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                if(action?.payload?.data){
                    updateLocalStorage(action.payload.data);
                    state.craftorData = action.payload.data;
                }
            })
            .addCase(activateCraftorAccount.rejected, (state, action) => {
                state.error = action.payload as string;
                state.craftorData = {};
                toast.error(action.payload as string);
            })
            .addCase(getCraftorProfile.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCraftorProfile.fulfilled, (state, action : PayloadAction < any >) => {
                state.loading = false;
                if(action?.payload?.data){
                    updateLocalStorage(action.payload.data);
                    state.craftorData = action.payload.data;
                }
            })
            .addCase(getCraftorProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.craftorData = {};
                toast.error(action.payload as string);
            })
            .addCase(updatePaymentDetailsThunk.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePaymentDetailsThunk.fulfilled, (state, action : PayloadAction < any >) => {
                state.loading = false;
                if(action?.payload?.data){
                    updateLocalStorage(action.payload.data);
                    state.craftorData = action.payload.data;
                }

            })
            .addCase(updatePaymentDetailsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                toast.error(action.payload as string);
            })
    }
})

export default craftorSlice.reducer;