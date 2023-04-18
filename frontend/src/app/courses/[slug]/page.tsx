"use client";

import ChapterView from "../../components/CourseView/ChapterView";
import Contents from "../../components/CourseView/Contents";
import NavigationBar from "../../components/NavigationBar";
import { sampleCourse } from "../../data/courseinfo";
import { useEffect } from "react";
import { initializeCourses } from "@/app/reducers/courseReducer";
import { useAppDispatch, useAppSelector } from "@/app/hooks";

export default function MyPage({ params }: { params: { slug: string } }) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(initializeCourses());
  }, [dispatch]);
  const allCourses = useAppSelector((state) => state.courses);
  const course = allCourses.find(
    (course) => course.id === parseInt(params.slug)
  );
  if (course === undefined) {
    return <main className="bg-white dark:bg-bg min-h-screen"></main>;
  }

  return (
    <div className="dark">
      <div className="dark:bg-bg">
        <NavigationBar />
        <div className="flex flex-row pt-8 lg:pt-16 gap-6 lg:gap-16">
          <div className="w-1/8">
            <Contents />
          </div>
          <div className="flex-grow mr-4">
            <main className="bg-white dark:bg-bg min-h-screen">
              <div className="">
                <h1 className="pb-12 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">
                  {course.title}
                </h1>

                {sampleCourse.chapters.map((chapter) => (
                  <ChapterView chapter={chapter} />
                ))}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
