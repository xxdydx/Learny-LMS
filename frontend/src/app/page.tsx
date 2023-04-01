"use client";

import ChapterView from "./components/ChapterView";
import Contents from "./components/Contents";
import NavigationBar from "./components/NavigationBar";
import { sampleCourse } from "./data/courseinfo";

export default function MyPage() {
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
                  {sampleCourse.title}
                </h1>

                <ChapterView chapter="Price Mechanism" />
                <ChapterView chapter="Market Failure" />
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
