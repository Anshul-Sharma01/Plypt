import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../helpers/axiosInstance';
import toast from 'react-hot-toast';
import { toastHandler } from '../../helpers/toastHandler';

const updateLocalStorage = (user: any) => {
  localStorage.setItem('userData', JSON.stringify(user));
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('userRole', user?.role);
};

const clearAuthData = (state: UserState) => {
  localStorage.clear();
  state.isLoggedIn = false;
  state.userData = {};
  state.userRole = '';
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

export const fetchCurrentUser = createAsyncThunk('user/fetchCurrent', async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get('user/me');
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
  }
});

export const updateProfileThunk = createAsyncThunk("user/update-profile", async(data : FormData, { rejectWithValue }) => {
  try{
    const promise = axiosInstance.patch("user/update-profile", data);
    toastHandler(promise, "Updating Profile...", "Successfully updated the profile");
    const res = await promise;
    return res.data;
  }catch(err : any){
    return rejectWithValue(err.response?.data?.message || "Failed to update the profile");
  }
})

export const updatePictureThunk = createAsyncThunk("user/update-picture", async( data : FormData, { rejectWithValue } ) => {
  try{
    const promise = axiosInstance.patch("user/update-avatar", data);
    toastHandler(promise, "Updating profile picture", "Successfully updated the profile picture");
    const res = await promise;
    return res.data;
  }catch(err : any){
    return rejectWithValue(err.response?.data?.message || "Failed to update the profile picture");
  }
})

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
          const { user, accessToken, refreshToken } = action.payload.data;
          updateLocalStorage(user);
          if (accessToken) localStorage.setItem('accessToken', accessToken);
          if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
          state.isLoggedIn = true;
          state.userData = user;
          state.userRole = user.role;
        }
      })
      .addCase(createUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        clearAuthData(state);
        toast.error(action.payload as string)
      })
      .addCase(authenticateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authenticateUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        if (action.payload?.data) {
          const { user, accessToken, refreshToken } = action.payload.data;
          updateLocalStorage(user);
          if (accessToken) localStorage.setItem('accessToken', accessToken);
          if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
          state.isLoggedIn = true;
          state.userData = user;
          state.userRole = user.role;
        }
      })
      .addCase(authenticateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        clearAuthData(state);
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
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<any>) => {
        if (action.payload?.data) {
          const user = action.payload.data;
          updateLocalStorage(user);
          state.isLoggedIn = true;
          state.userData = user;
          state.userRole = user.role;
          state.loading = false;
          state.error = null;
        }
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        clearAuthData(state);
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        if(action.payload.statusCode === 200){
          updateLocalStorage(action.payload.data);
          state.userData = action.payload.data;
        }
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        toast.error(action.payload as string);
      })
      .addCase(updatePictureThunk.fulfilled, (state, action) => {
        if(action.payload.statusCode === 200){
          state.userData = action.payload.data;
        }
      })
      .addCase(updatePictureThunk.rejected, (state, action) => {
        toast.error(action.payload as string);
      })
  },
});

export default userSlice.reducer; 