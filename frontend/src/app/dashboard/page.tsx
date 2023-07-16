"use client";

import ChapterView from "../components/CourseView/ChapterView";
import Contents from "../components/CourseView/Contents";
import NavigationBar from "../components/NavigationBar";
import CourseCard from "../components/CourseCard";
import { initializeCourses } from "../reducers/courseReducer";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { AppState } from "../store";
import { AppDispatch } from "../store";
import { useAppDispatch, useAppSelector } from "../hooks";
import { initializeUsers } from "../reducers/userReducer";
import { UserIdentifier, Course } from "../types";
import { useRouter } from "next/navigation";
import LoadingPage from "../components/LoadingPage";
import { useAuth } from "../hooks";
import NewCourseForm from "../components/FormModal/NewCourseForm";
import NotifComponent from "../components/NotifComponent";
import { Box, Collapse, Alert, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import SyncIcon from "@mui/icons-material/Sync";

export default function MyPage() {
  // abstracted GET users and courses into a hook
  const [isLoading, user] = useAuth();
  const [open, setOpen] = useState<boolean>(true);
  const courses = useAppSelector((state) => state.courses);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // if page is loaded + no user => redirect to home page
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    }
  }, [isLoading, user]);

  // to GET courses
  useEffect(() => {
    if (user) {
      dispatch(initializeCourses());
    }
  }, [dispatch, user]);

  // if page is loading and no user => redirect to loading page
  if (isLoading || !user) {
    return <LoadingPage />;
  }
  if (!Array.isArray(courses)) {
    // handle error or return null
    return null;
  }

  const InfoComponent = () => {
    return (
      <Box sx={{ width: "100%", mb: 6 }}>
        <Collapse in={open}>
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            severity="info"
          >
            14/07/23 Update! - You can view past recordings of online lessons
            (up to a month) on the Recordings list under each course.
          </Alert>
        </Collapse>
      </Box>
    );
  };

  return (
    <div className="dark">
      <div className="dark:bg-bg">
        <NavigationBar />
        <div className="flex flex-col px-4 pt-6 pb-10 mx-auto min-h-screen max-w-7xl ">
          <div>
            <InfoComponent />
            <div className="flex justify-between mx-auto">
              <h1 className="pb-12 text-4xl tracking-tight font-semibold text-gray-900 dark:text-white">
                My Courses
              </h1>
              <div className="flex flex-row">
                {user?.role === "teacher" ? (
                  <>
                    <NewCourseForm />
                    <Tooltip title="Sync Recordings" placement="top">
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            window.location.href = `/recordings`;
                          }}
                          className="text-white text-heading-4 font-semibold bg-[#ff4081] hover:bg-canary-500  rounded-2xl px-5 py-2.5 text-center mr-2 mb-2 dark:bg-[#ff4081] dark:hover:bg-[#f01b68]"
                        >
                          <RadioButtonCheckedIcon />
                        </button>
                      </div>
                    </Tooltip>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <div>
            <div className="grid gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center">
              {courses.map((course) => (
                <div key={course.id} className="mx-auto max-w-xs">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          </div>
        </div>
        <NotifComponent />
      </div>
    </div>
  );
}
