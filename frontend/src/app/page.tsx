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
import { UserIdentifier } from "./types";
import { useRouter } from "next/navigation";
import LoadingPage from "./components/LoadingPage";
import { useAuth } from "./hooks";

export default function MyPage() {
  const router = useRouter();
  // abstracted GET users and courses into a hook
  const [isLoading, user, courses] = useAuth();
  // if page is loaded + no user => redirect to login page
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user]);

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
        <div className="flex justify-between px-4 pt-16 mx-auto max-w-7xl">
          <main className="bg-white dark:bg-bg min-h-screen">
            <div>
              <h1 className="pb-12 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">
                My Courses
              </h1>
              <div className="grid gap-12 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
                {courses.map((course) => (
                  <div key={course.id} className="mx-auto max-w-xs">
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
