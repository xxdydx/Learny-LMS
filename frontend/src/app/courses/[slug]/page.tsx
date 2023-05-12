"use client";

import ChapterView from "../../components/CourseView/ChapterView";
import Contents from "../../components/CourseView/Contents";
import NavigationBar from "../../components/NavigationBar";
import { sampleCourse } from "../../data/courseinfo";
import { useEffect } from "react";
import { initializeCourses } from "@/app/reducers/courseReducer";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks";
import LoadingPage from "@/app/components/LoadingPage";
import styled from "@mui/material/styles/styled";
import NewCourseForm from "@/app/components/FormModal/NewCourseForm";
import { NewChapter } from "@/app/types";
import NewChapterForm from "@/app/components/FormModal/NewChapterForm";
import CourseSettings from "@/app/components/FormModal/CourseSettings";

export default function MyPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const courses = useAppSelector((state) => state.courses);
  const dispatch = useAppDispatch();
  // abstracted GET users and courses into a hook
  const [isLoading, user] = useAuth();

  useEffect(() => {
    if (user) {
      dispatch(initializeCourses());
    }
  }, [dispatch, user]);
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

  const course = courses.find((course) => course.id === parseInt(params.slug));
  if (course === undefined) {
    return <main className="bg-white dark:bg-bg min-h-screen"></main>;
  }

  return (
    <div className="dark">
      <div className="dark:bg-bg">
        <NavigationBar />
        <main className="mt-8 mb-16 lg:mt-16 lg:mb-24 bg-white dark:bg-bg min-h-screen">
          <div className="flex justify-between px-4 mx-auto max-w-6xl">
            <div className="flex-grow mx-4">
              <div className="bg-white dark:bg-bg min-h-screen">
                <div className="w-full lg:max-w-6xl">
                  <div className="flex justify-between mx-auto ">
                    <h1 className="mb-12 text-4xl tracking-tight font-semibold text-gray-900 dark:text-white">
                      {course.title}
                    </h1>
                    <div className="flex flex-row">
                      {user?.role === "teacher" ? (
                        <NewChapterForm courseId={course.id} />
                      ) : null}
                      <div>
                        <CourseSettings courseId={course.id} />
                      </div>
                    </div>
                  </div>

                  {course.chapters.map((chapter) => (
                    <ChapterView key={chapter.id} chapter={chapter} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
