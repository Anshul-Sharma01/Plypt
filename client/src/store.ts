import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import craftorReducer from "./features/craftor/craftorSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    craftor : craftorReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
