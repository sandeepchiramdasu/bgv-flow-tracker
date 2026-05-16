import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import candidateReducer from "../features/candidates/candidateSlice";
import analyticsReducer from "../features/analytics/analyticsSlice";

export const store = configureStore({
  reducer: {
    auth:authReducer,
    candidates: candidateReducer,
    analytics: analyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;