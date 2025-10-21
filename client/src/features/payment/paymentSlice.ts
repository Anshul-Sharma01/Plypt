import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";
import { toastHandler } from "../../helpers/toastHandler";


const initialState = {
    order : null,
    pendingPurchase: null,
    isLoading: false
}



export const fetchPurchasingHistory = createAsyncThunk("purchase/history", async({page, limit}: {page: number, limit: number}, {rejectWithValue}) => {
    try{
        const promise = axiosInstance.get(`purchase/my-purchases?page=${page}&limit=${limit}`);
        toastHandler(promise, "fetching purchase history.", "Successfully fetched purhcase history");
        const res = await promise;
        return res.data;
    }catch(err : any){
        return rejectWithValue(err?.response?.data?.message || "Error occurred while fetching purchase history");
    }
})

export const initiatePurchaseForPrompt = createAsyncThunk("purchase/new-order", async({ promptId, amt, currency } : { promptId: string | undefined; amt: number; currency: string; }, { rejectWithValue }) => {
    try{
        const res = await axiosInstance.post(`purchase/buy/${promptId}`, { amt, currency });
        
        // Only show success toast for successful payment initiation
        if (res.status === 201) {
            toast.success("Payment Initiated successfully");
        }
        
        return res.data;
    }catch(err : any){
        // Handle different error cases
        if (err?.response?.status === 409) {
            // Pending purchase exists - return the error with special flag
            return rejectWithValue({
                message: err?.response?.data?.message || "You have a pending purchase",
                statusCode: 409,
                hasPendingPurchase: true,
                purchase: err?.response?.data?.data?.purchase
            });
        }
        
        // For other errors, show toast and reject
        toast.error(err?.response?.data?.message || "Error occurred while placing a prompt purchase order");
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

export const getPendingPurchase = createAsyncThunk("purchase/get-pending", async(promptId: string, { rejectWithValue }) => {
    try{
        const res = await axiosInstance.get(`purchase/pending/${promptId}`);
        return res.data;
    }catch(err : any){
        return rejectWithValue(err?.response?.data?.message || "No pending purchase found");
    }
})

export const cancelPendingPurchase = createAsyncThunk("purchase/cancel-pending", async(promptId: string, { rejectWithValue }) => {
    try{
        const promise = axiosInstance.delete(`purchase/cancel/${promptId}`);
        toastHandler(promise, "Cancelling pending purchase...", "Pending purchase cancelled successfully");
        const res = await promise;
        return res.data;
    }catch(err : any){
        return rejectWithValue(err?.response?.data?.message || "Error occurred while cancelling pending purchase");
    }
})


const paymentSlice = createSlice({
    name : "payment",
    initialState,
    reducers : {
        clearPendingPurchase: (state) => {
            state.pendingPurchase = null;
        }
    },
    extraReducers : (builder) => {
        builder
            .addCase(fetchPurchasingHistory.rejected, (state, action) => {
                toast.error(action.payload as string);
            })
            .addCase(initiatePurchaseForPrompt.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(initiatePurchaseForPrompt.fulfilled, (state, action) => {
                state.order = action?.payload?.data;
                state.isLoading = false;
            })
            .addCase(initiatePurchaseForPrompt.rejected, (state, action) => {
                state.isLoading = false;
                // Check if it's a pending purchase error
                const payload = action.payload as any;
                if (payload?.statusCode === 409 && payload?.hasPendingPurchase) {
                    state.pendingPurchase = payload.purchase;
                }
            })
            .addCase(getPendingPurchase.fulfilled, (state, action) => {
                state.pendingPurchase = action?.payload?.data?.purchase;
            })
            .addCase(getPendingPurchase.rejected, (state) => {
                state.pendingPurchase = null;
            })
            .addCase(cancelPendingPurchase.fulfilled, (state) => {
                state.pendingPurchase = null;
            })
    }
})

export const { clearPendingPurchase } = paymentSlice.actions;

export default paymentSlice.reducer;



