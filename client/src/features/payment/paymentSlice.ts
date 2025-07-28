import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";
import { toastHandler } from "../../helpers/toastHandler";


const initialState = {
    order : null
}



export const fetchPurchasingHistory = createAsyncThunk("purchase/history", async(_, {rejectWithValue}) => {
    try{
        const promise = axiosInstance.get("purchase/my-purchases");
        toastHandler(promise, "fetching purchase history.", "Successfully fetched purhcase history");
        const res = await promise;
        return res.data;
    }catch(err : any){
        return rejectWithValue(err?.response?.data?.message || "Error occurred while fetching purchase history");
    }
})

export const initiatePurchaseForPrompt = createAsyncThunk("purchase/new-order", async({ promptId, amt, currency } : { promptId: string | undefined; amt: number; currency: string; }, { rejectWithValue }) => {
    try{
        const promise = axiosInstance.post(`purchase/buy/${promptId}`, { amt, currency });
        toastHandler(promise, "Initating a purchase order for prompt...", "Payment Initiated successfully");
        const res = await promise;
        return res.data;
    }catch(err : any){
        return rejectWithValue(err?.response?.data?.message || "Error occurred while placing a prompt purchase order");
    }
})


export const completePurchaseForPrompt = createAsyncThunk("purchase/complete-payment", async(data, { rejectWithValue }) => {
    try{
        const promise = axiosInstance.post("purchase/complete", data);
        toastHandler(promise, "Completing Payment...", "Payment complted successfully");
        const res = await promise;
        return res.data;
    }catch(err : any){
        return rejectWithValue(err?.response?.data?.message || "Error occurred while completing the payment");
    }
})


const paymentSlice = createSlice({
    name : "payment",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
            .addCase(fetchPurchasingHistory.rejected, (state, action) => {
                toast.error(action.payload as string);
            })
            .addCase(initiatePurchaseForPrompt.fulfilled, (state, action) => {
                state.order = action?.payload?.data;
            })
    }
})

export default paymentSlice.reducer;



