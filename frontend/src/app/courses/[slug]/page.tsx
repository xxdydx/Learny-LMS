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

export default function MyPage({ params }: { params: { slug: string } }) {
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

  const course = courses.find((course) => course.id === parseInt(params.slug));
  if (course === undefined) {
    return <main className="bg-white dark:bg-bg min-h-screen"></main>;
  }
  console.log(course);
  return (
    <div className="dark">
      <div className="dark:bg-bg">
        <NavigationBar />
        <div className="flex flex-row pt-8 lg:pt-16 gap-6 lg:gap-16">
          <div className="w-1/8">
            <Contents course={course} />
          </div>
          <div className="flex-grow mr-4">
            <main className="bg-white dark:bg-bg min-h-screen">
              <div className="">
                <h1 className="pb-12 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">
                  {course.title}
                </h1>

                {course.chapters.map((chapter) => (
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
