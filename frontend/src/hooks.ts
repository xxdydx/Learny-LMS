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
type UseAuthReturnType = [boolean, UserIdentifier | null];

export const useAuth = (): UseAuthReturnType => {
  const dispatch = useAppDispatch();
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

  return [isLoading, user];
};

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState(false);
  const mobileWidth = 768;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < mobileWidth);
    };

    handleResize(); // Set initial state based on client's window size

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};
