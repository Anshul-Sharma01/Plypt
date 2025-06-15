import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import craftorReducer from "./features/craftor/craftorSlice";
import promptReduer from "./features/prompts/promptSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    craftor : craftorReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
