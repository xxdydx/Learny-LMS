// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "./reducers/courseReducer";
export const store = configureStore({
  reducer: {
    courses: courseReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
