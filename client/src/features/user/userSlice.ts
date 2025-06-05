import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../helpers/axiosInstance';
import toast from 'react-hot-toast';
import { toastHandler } from '../../helpers/toastHandler';

const updateLocalStorage = (user: any) => {
  localStorage.setItem('userData', JSON.stringify(user));
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userRole', user?.role);
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
    toastHandler(promise, 'Creating your account...', 'Account created!');
    const res = await promise;
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Signup failed');
  }
});

export const authenticateUser = createAsyncThunk('auth/login', async (data: any, { rejectWithValue }) => {
  try {
    const promise = axiosInstance.post('user/login', data);
    toastHandler(promise, 'Authenticating...', 'Login successful!');
    const res = await promise;
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const logoutUserAccount = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    const promise = axiosInstance.get('user/logout');
    toastHandler(promise, 'Logging out...', 'Logged out!');
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
        toast.error(action.payload as string)
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
        toast.error(action.payload as string);
      })
      .addCase(logoutUserAccount.fulfilled, (state) => {
        localStorage.clear();
        state.isLoggedIn = false;
        state.userData = {};
        state.userRole = '';
      })
      .addCase(logoutUserAccount.rejected, (_, action) => {
        toast.error(action.payload as string);
      })
  },
});

export default userSlice.reducer; 