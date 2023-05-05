"use client";

import { Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import loginService from "../services/login";
import courseService from "../services/courses";
import Link from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import userReducer, { initializeUsers, setUser } from "../reducers/userReducer";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useAuth } from "../hooks";
import LoadingPage from "../components/LoadingPage";

export default function MyPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, user] = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/");
    }
  }, [isLoading, user]);

  if (isLoading || user) {
    return <LoadingPage />;
  }

  // attempts login thru API, sets token in local storage, dispatches token to reducers and authenticates user
  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("AKAppSessionID", JSON.stringify(user));
      courseService.setToken(user.token);
      dispatch(setUser(user));
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  if (user) {
    router.push("/");
  }

  return (
    <div className="dark">
      <section className="bg-white dark:bg-bg min-h-screen">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <SchoolIcon sx={{ display: { xs: "flex", md: "flex" }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 4,
                display: { xs: "flex", md: "flex" },
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              AE Education
            </Typography>
          </div>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-bg ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                action="#"
                onSubmit={handleLogin}
              >
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    onChange={({ target }) => setUsername(target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-bg dark:placeholder-gray-400 dark:text-white dark:hover:ring-yellow dark:focus:border-yellow"
                  ></input>
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    onChange={({ target }) => setPassword(target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-bg  dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow dark:focus:border-yellow"
                  ></input>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="remember"
                        aria-describedby="remember"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      ></input>
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="remember"
                        className="text-gray-500 dark:text-gray-300"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>
                  <a
                    href="#"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-yellow"
                  >
                    Forgot password?
                  </a>
                </div>
                <button className="w-full text-white bg-primary-600 hover:bg-primary-700  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-pink dark:hover:bg-darkerpink">
                  Sign in
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{" "}
                  <a
                    href="/register"
                    className="font-medium text-primary-600 hover:underline dark:text-yellow"
                  >
                    Sign up
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
