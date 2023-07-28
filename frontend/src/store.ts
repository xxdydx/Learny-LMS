// src/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { createWrapper, Context, MakeStore } from "next-redux-wrapper";
import courseReducer from "./reducers/courseReducer";
import userReducer from "./reducers/userReducer";
import notifReducer from "./reducers/notifReducer";

export const store = configureStore({
  reducer: {
    courses: courseReducer,
    user: userReducer,
    notifications: notifReducer,
  },
});

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
