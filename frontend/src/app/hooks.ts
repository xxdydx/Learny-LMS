import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { initializeUsers } from "./reducers/userReducer";
import { initializeCourses } from "./reducers/courseReducer";
import { useRouter } from "next/navigation";
import { UserIdentifier } from "./types";

import { AppDispatch, AppState } from "./store";
import { compose } from "redux";
import { Course } from "./types";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

// Hook to authenticate user & render courses associated with user
type UseAuthReturnType = [boolean, UserIdentifier | null, Course[] | null];

export const useAuth = (): UseAuthReturnType => {
  const dispatch = useAppDispatch();
  const courses = useAppSelector((state) => state.courses);
  const user: UserIdentifier | null = useAppSelector((state) => state.user);
  const [isLoading, setLoading] = useState(true);

  // to GET user
  useEffect(() => {
    const getUser = async () => {
      dispatch(initializeUsers());
    };
    getUser();
    setLoading(false);
  }, [dispatch]);

  // to GET courses
  useEffect(() => {
    if (user) {
      dispatch(initializeCourses());
    }
  }, [dispatch, user]);

  return [isLoading, user, courses];
};
