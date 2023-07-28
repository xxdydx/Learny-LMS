"use client";

import ChapterView from "../../components/CourseView/ChapterView";
import Contents from "../../components/CourseView/Contents";
import NavigationBar from "../../components/NavigationBar";
import { useEffect, useState } from "react";
import { initializeCourses } from "@/reducers/courseReducer";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks";
import LoadingPage from "@/app/components/LoadingPage";
import styled from "@mui/material/styles/styled";
import NewCourseForm from "@/app/components/FormModal/NewCourseForm";
import { Chapter, NewChapter } from "@/types";
import NewChapterForm from "@/app/components/FormModal/NewChapterForm";
import NotifComponent from "@/app/components/NotifComponent";
import SettingsIcon from "@mui/icons-material/Settings";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { Assignment } from "@/types";
import courseService from "@/services/courses";

export default function MyPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const courses = useAppSelector((state) => state.courses);
  const dispatch = useAppDispatch();
  // abstracted GET users and courses into a hook
  const [isLoading, user] = useAuth();
  const [open, setOpen] = useState(true);
  const [assignment, setAssignment] = useState<Assignment | null>(null);

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
  useEffect(() => {
    courseService
      .getAssignment(parseInt(params.slug))
      .then((response) => setAssignment(response));
  });

  // if page is loading and no user => redirect to loading page
  if (isLoading || !user) {
    return <LoadingPage />;
  }
  if (!Array.isArray(courses)) {
    // handle error or return null
    return null;
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
  if (assignment === null || assignment == undefined) {
    return <main className="bg-bg min-h-screen"></main>;
  }

  return (
    <div className="dark">
      <div className="dark:bg-bg">
        <NavigationBar />
        <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-bg">
          <div className="min-h-screen flex justify-between px-4 mx-auto max-w-6xl">
            <div className="flex-grow mx-4">
              <div className="bg-white dark:bg-bg min-h-screen">
                <div className=" w-full lg:max-w-6xl">
                  <div className="flex flex-col mx-auto mb-12 ">
                    <h1 className="mb-2 text-4xl tracking-tight font-semibold text-gray-900 dark:text-white">
                      {assignment?.name}
                    </h1>
                    <h2 className="text-lg tracking-tight text-gray-900 dark:text-white">
                      Assigned deadline:{" "}
                      {new Date(assignment.deadline)
                        .toLocaleString("en-GB", {
                          timeZone: "Asia/Singapore",
                        })
                        .slice(0, -3)}
                    </h2>
                    <h2 className="text-lg tracking-tight text-gray-900 dark:text-white">
                      Maximum score: {assignment.marks}
                    </h2>
                  </div>

                  <h2 className="mb-3 text-2xl tracking-tight font-semibold text-gray-900 dark:text-white">
                    <u>Instructions</u>
                  </h2>
                  <p className="text-base mb-4 dark:text-text">
                    {assignment?.instructions
                      ? assignment.instructions
                      : "No instructions given."}
                  </p>
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
