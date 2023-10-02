"use client";

import ChapterView from "../../../components/CourseView/ChapterView";
import Contents from "../../../components/CourseView/Contents";
import NavigationBar from "../../../components/NavigationBar";
import { useEffect, useState } from "react";
import { initializeCourses } from "@/reducers/courseReducer";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import LoadingPage from "@/components/LoadingPage";
import styled from "@mui/material/styles/styled";
import NewCourseForm from "@/components/FormModal/NewCourseForm";
import { Chapter, NewChapter } from "@/types";
import NewChapterForm from "@/components/FormModal/NewChapterForm";
import NotifComponent from "@/components/NotifComponent";
import SettingsIcon from "@mui/icons-material/Settings";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function MyPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const courses = useAppSelector((state) => state.courses);
  const dispatch = useAppDispatch();
  // abstracted GET users and courses into a hook
  const [isLoading, user] = useAuth();
  const [open, setOpen] = useState(true);

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
    return <main className="bg-bg min-h-screen"></main>;
  }
  if (!Array.isArray(courses)) {
    // handle error or return null
    return null;
  }

  let course = courses.find((course) => course.id === parseInt(params.slug));
  if (course === undefined) {
    return <main className="bg-bg min-h-screen"></main>;
  }

  const sortChapterFunc = (a: Chapter, b: Chapter) => {
    if (a.pinned === true && b.pinned === false) {
      return -1;
    }
    if (b.pinned === true && a.pinned === false) {
      return 1;
    } else {
      return 0;
    }
  };

  return (
    <div className="dark">
      <div className="dark:bg-bg">
        <NavigationBar />
        <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-bg">
          <div className="min-h-screen flex justify-between px-4 mx-auto max-w-6xl">
            <div className="flex-grow mx-4">
              <div className="bg-white dark:bg-bg min-h-screen">
                <div className=" w-full lg:max-w-6xl">
                  <div className="flex flex-col justify-between md:flex-row mx-auto">
                    <h1 className="mb-4 md:mb-12 text-4xl text-clip overflow-hidden tracking-tight font-semibold text-gray-900 dark:text-white ">
                      {course.title}
                    </h1>

                    <div className="flex flex-row mb-8 md:mb-0">
                      <Tooltip title="Recordings" placement="top">
                        <div>
                          <button
                            type="button"
                            onClick={() => {
                              window.location.href = `/courses/${course?.id}/recordings`;
                            }}
                            className="text-white text-heading-4 font-semibold bg-[#ff4081] hover:bg-canary-500  rounded-2xl px-5 py-2.5 text-center mr-2 mb-2 dark:bg-[#ff4081] dark:hover:bg-[#f01b68]"
                          >
                            <PlayCircleIcon />
                          </button>
                        </div>
                      </Tooltip>

                      {user?.role === "teacher" ? (
                        <>
                          <Tooltip title="Add Chapter" placement="top">
                            <NewChapterForm courseId={course.id} />
                          </Tooltip>
                          <Tooltip title="Course Settings" placement="top">
                            <div>
                              <button
                                type="button"
                                onClick={() => {
                                  window.location.href = `/courses/${course?.id}/settings`;
                                }}
                                className="text-white text-heading-4 font-semibold bg-[#ff4081] hover:bg-canary-500  rounded-2xl px-5 py-2.5 text-center mr-2 mb-2 dark:bg-[#ff4081] dark:hover:bg-[#f01b68]"
                              >
                                <SettingsIcon />
                              </button>
                            </div>
                          </Tooltip>
                        </>
                      ) : null}
                    </div>
                  </div>

                  {[...course.chapters].sort(sortChapterFunc).map((chapter) => (
                    <ChapterView key={chapter.id} chapter={chapter} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <NotifComponent />
        </main>
      </div>
    </div>
  );
}
