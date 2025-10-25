import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../helpers/axiosInstance";
import toast from "react-hot-toast";

interface Review {
  _id: string;
  craftor: string;
  buyer: {
    _id: string;
    name: string;
    avatar: string;
  };
  prompt: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

interface ReviewState {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [],
  isLoading: false,
  error: null,
};

// Add review thunk
export const addReviewThunk = createAsyncThunk(
  "review/add",
  async ({ craftorId, promptId, reviewData }: { 
    craftorId: string; 
    promptId: string; 
    reviewData: { rating: number; comment: string } 
  }) => {
    try {
      const response = await axiosInstance.post(
        `/review/add/${craftorId}/${promptId}`,
        reviewData
      );
      toast.success("Review added successfully!");
      return response.data;
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to add review");
      throw error;
    }
  }
);

// Delete review thunk
export const deleteReviewThunk = createAsyncThunk(
  "review/delete",
  async (reviewId: string) => {
    try {
      const response = await axiosInstance.delete(`/review/delete/${reviewId}`);
      toast.success("Review deleted successfully!");
      return { reviewId, ...response.data };
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to delete review");
      throw error;
    }
  }
);

// Fetch reviews for a prompt thunk
export const fetchReviewsThunk = createAsyncThunk(
  "review/fetchForPrompt",
  async (promptId: string) => {
    try {
      const response = await axiosInstance.get(`/review/prompt/${promptId}`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to fetch reviews:", error);
      throw error;
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.error = null;
    },
    setReviews: (state, action: PayloadAction<Review[]>) => {
      state.reviews = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add review
      .addCase(addReviewThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addReviewThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews.push(action.payload.data);
      })
      .addCase(addReviewThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to add review";
      })
      // Delete review
      .addCase(deleteReviewThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteReviewThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = state.reviews.filter(
          (review) => review._id !== action.payload.reviewId
        );
      })
      .addCase(deleteReviewThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to delete review";
      })
      // Fetch reviews
      .addCase(fetchReviewsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviewsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(fetchReviewsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch reviews";
      });
  },
});

export const { clearReviews, setReviews } = reviewSlice.actions;
export default reviewSlice.reducer;