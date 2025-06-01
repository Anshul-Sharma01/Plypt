import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../helpers/axiosInstance';
import toast from 'react-hot-toast';

const updateLocalStorage = (user: any) => {
  localStorage.setItem('userData', JSON.stringify(user));
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userRole', user?.role);
};

const toastHandler = (promise: Promise<any>, loadingMsg: string, successMsg: string, errorMsg: string) => {
  return toast.promise(promise, {
    loading: loadingMsg,
    success: (data) => data?.message || successMsg,
    error: errorMsg,
  });
};

interface UserState {
  isLoggedIn: boolean;
  userRole: string;
  userData: any;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  userRole: localStorage.getItem('userRole') || '',
  userData: JSON.parse(localStorage.getItem('userData') || '{}'),
  loading: false,
  error: null,
};

export const createUserAccount = createAsyncThunk('auth/register', async (data: any, { rejectWithValue }) => {
  try {
    const promise = axiosInstance.post('user/register', data);
    toastHandler(promise, 'Creating your account...', 'Account created!', 'Failed to create account!');
    const res = await promise;
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Signup failed');
  }
});

export const authenticateUser = createAsyncThunk('auth/login', async (data: any, { rejectWithValue }) => {
  try {
    const promise = axiosInstance.post('user/login', data);
    toastHandler(promise, 'Authenticating...', 'Login successful!', 'Failed to login!');
    const res = await promise;
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const logoutUserAccount = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const promise = axiosInstance.post('user/logout');
    toastHandler(promise, 'Logging out...', 'Logged out!', 'Failed to log out!');
    const res = await promise;
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Logout failed');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserAccount.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (action.payload?.data) {
          updateLocalStorage(action.payload.data);
          state.isLoggedIn = true;
          state.userData = action.payload.data;
          state.userRole = action.payload.data.role;
        }
      })
      .addCase(createUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        localStorage.clear();
        state.isLoggedIn = false;
        state.userData = {};
        state.userRole = '';
      })
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (action.payload?.data) {
          updateLocalStorage(action.payload.data);
          state.isLoggedIn = true;
          state.userData = action.payload.data;
          state.userRole = action.payload.data.role;
        }
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        localStorage.clear();
        state.isLoggedIn = false;
        state.userData = {};
        state.userRole = '';
      })
      .addCase(logoutUserAccount.fulfilled, (state) => {
        localStorage.clear();
        state.isLoggedIn = false;
        state.userData = {};
        state.userRole = '';
      });
  },
});

export default userSlice.reducer; 