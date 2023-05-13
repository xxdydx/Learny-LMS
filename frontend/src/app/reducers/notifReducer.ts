import { Action, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Course, NewCourse, NewFile, NewSection, Notif } from "../types";

import { AppState } from "../store";
import courseService from "../services/courses";

import { ThunkAction } from "@reduxjs/toolkit";
import { NewChapter } from "../types";

const notifSlice = createSlice({
  name: "notifications",
  initialState: null as Notif | null,
  reducers: {
    createNotification(state, action) {
      const notification = action.payload;
      return notification;
    },
  },
});

export const { createNotification } = notifSlice.actions;

let timeoutId: any = null;

export const setNotification = (
  notification: Notif,
  time: number
): ThunkAction<void, AppState, unknown, Action> => {
  return async (dispatch) => {
    dispatch(createNotification(notification));

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => dispatch(createNotification(null)), time);
  };
};

export default notifSlice.reducer;
