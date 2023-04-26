import { Action, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Course } from "../types";
import { AppState } from "../store";
import courseService from "../services/courses";
import { ThunkAction } from "@reduxjs/toolkit";
import { UserIdentifier } from "../types";

const userSlice = createSlice({
  name: "user",
  initialState: null as UserIdentifier | null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export const initializeUsers = (): ThunkAction<
  void,
  AppState,
  unknown,
  Action
> => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem("AKAppSessionID");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      courseService.setToken(user.token);
    }
  };
};

export default userSlice.reducer;
