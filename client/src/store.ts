import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import craftorReducer from "./features/craftor/craftorSlice";
import promptReducer from './features/prompts/promptSlice';
import realtimeReducer from './features/realtime/realtimeSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    prompt: promptReducer,
    craftor: craftorReducer,
    realtime: realtimeReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
