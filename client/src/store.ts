import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';
import craftorReducer from "./features/craftor/craftorSlice";
import promptReducer from './features/prompts/promptSlice';
import realtimeReducer from './features/realtime/realtimeSlice';
import paymentReducer from './features/payment/paymentSlice';
import reviewReducer from './features/prompts/reviewSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    prompt: promptReducer,
    craftor: craftorReducer,
    realtime: realtimeReducer,
    payment: paymentReducer,
    review: reviewReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
