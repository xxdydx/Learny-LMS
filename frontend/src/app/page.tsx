"use client";

import ChapterView from "./components/CourseView/ChapterView";
import Contents from "./components/CourseView/Contents";
import NavigationBar from "./components/NavigationBar";
import { sampleCourse } from "./data/courseinfo";
import CourseCard from "./components/CourseCard";
import { initializeCourses } from "./reducers/courseReducer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { AppDispatch } from "./store";
import { useAppDispatch, useAppSelector } from "./hooks";

export default function MyPage() {
  const dispatch = useAppDispatch();
  const courses = useAppSelector((state) => state.courses);
  useEffect(() => {
    dispatch(initializeCourses());
  }, [dispatch]);
  console.log(courses);

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
