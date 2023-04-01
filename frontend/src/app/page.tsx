"use client";

import Contents from "./components/Contents";
import NavigationBar from "./components/NavigationBar";

export default function MyPage() {
  return (
    <div className="dark">
      <div className="dark:bg-gray-900">
        <NavigationBar />
        <div className="flex flex-row pt-8 lg:pt-16 gap-6 lg:gap-16">
          <div>
            <Contents />
          </div>
          <div>
            <main className="bg-white dark:bg-gray-900 min-h-screen">
              <div className="px-4 lg:px-8 mx-auto max-w-6xl ">
                <article className="mx-auto w-full max-w-6xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert">
                  <h1 className="antialiased pb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">
                    JC2 H2 Economics
                  </h1>
                </article>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
