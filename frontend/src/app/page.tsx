"use client";

import ChapterView from "./components/CourseView/ChapterView";
import Contents from "./components/CourseView/Contents";
import NavigationBar from "./components/NavigationBar";
import { sampleCourse } from "./data/courseinfo";
import CourseCard from "./components/CourseCard";
import { initializeCourses } from "./reducers/courseReducer";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { AppDispatch } from "./store";
import { useAppDispatch, useAppSelector } from "./hooks";
import { initializeUsers } from "./reducers/userReducer";
import { UserIdentifier, Course } from "./types";
import { useRouter } from "next/navigation";
import LoadingPage from "./components/LoadingPage";
import { useAuth } from "./hooks";
import NewCourseForm from "./components/FormModal/NewCourseForm";
import NotifComponent from "./components/NotifComponent";

export default function MyPage() {
  // abstracted GET users and courses into a hook
  const [isLoading, user] = useAuth();
  const courses = useAppSelector((state) => state.courses);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // if page is loaded + no user => redirect to login page
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
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

  return (
    <div className="dark">
      <div className="dark:bg-bg">
        <NavigationBar />
        <div className="flex flex-col px-4 pt-16 mx-auto min-h-screen max-w-7xl ">
          <div>
            <div className="flex justify-between mx-auto max-w-7xl ">
              <h1 className="pb-12 text-4xl tracking-tight font-semibold text-gray-900 dark:text-white">
                My Courses
              </h1>
              {user?.role === "teacher" ? <NewCourseForm /> : null}
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
