"use client";

import NotifComponent from "@/components/NotifComponent";
import { Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import { useState } from "react";
import { useAppDispatch } from "@/hooks";
import { setNotification } from "@/reducers/notifReducer";
import { NewUser, Notif, User } from "@/types";
import courseService from "@/services/courses";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useAuth } from "@/hooks";
import { useEffect } from "react";
import LoadingPage from "@/components/LoadingPage";

export default function MyPage({ params }: { params: { slug: string } }) {
  const course = params.slug;
  const [isLoading, user] = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/dashboard");
    }
  }, [isLoading, user]);

  if (isLoading || user) {
    return <LoadingPage />;
  }

  if (user) {
    router.push("/dashboard");
  }

  const handleSignUp = async (event: React.MouseEvent) => {
    event.preventDefault();
    try {
      // See if username is empty -> error notif
      if (username.trim().length === 0) {
        const notif: Notif = {
          message: "Enter a username",
          type: "info",
        };
        dispatch(setNotification(notif, 5000));
        return;
      }
      // Likewise, to see if password is empty
      if (password.trim().length === 0) {
        const notif: Notif = {
          message: "Enter a password",
          type: "info",
        };
        dispatch(setNotification(notif, 5000));
        return;
      }

      if (name.trim().length === 0) {
        const notif: Notif = {
          message: "Enter a name",
          type: "info",
        };
        dispatch(setNotification(notif, 5000));
        return;
      }

      if (email.trim().length === 0) {
        const notif: Notif = {
          message: "Enter an email",
          type: "info",
        };
        dispatch(setNotification(notif, 5000));
        return;
      }

      const user: NewUser = {
        courseString: course,
        name: name,
        email: email,
        password: password,
        username: username,
      };

      await courseService.directSignUp(course, user);

      router.push("/login");
    } catch (error: unknown) {
      // Error handling
      if (error instanceof AxiosError) {
        const notif: Notif = {
          message: error.response?.data.error,
          type: "error",
        };
        dispatch(setNotification(notif, 5000));
      } else {
        const notif: Notif = {
          message: "Unknown error happpened. Contact support!",
          type: "error",
        };
        dispatch(setNotification(notif, 5000));
      }
    }
  };

  return (
    <div className="dark">
      <section className="bg-gray-50 dark:bg-bg min-h-screen">
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
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Learny LMS
            </Typography>
          </div>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-bg ">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Register for a student account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your name
                  </label>
                  <input
                    type="name"
                    name="name"
                    id="name"
                    onChange={({ target }) => setName(target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-bg  dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow dark:focus:border-yellow"
                    placeholder="John Appleseed"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    onChange={({ target }) => setEmail(target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-bg  dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow dark:focus:border-yellow"
                    placeholder="name@company.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    type="username"
                    name="username"
                    id="name"
                    onChange={({ target }) => setUsername(target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-bg  dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow dark:focus:border-yellow"
                    placeholder="John Appleseed"
                  />
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
                  />
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-light text-gray-500 dark:text-gray-300"
                    >
                      I accept the{" "}
                      <a
                        className="text-sm font-medium text-primary-600 hover:underline dark:text-yellow"
                        href="#"
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>
                <button
                  onClick={handleSignUp}
                  className="w-full text-white bg-primary-600 hover:bg-primary-700  font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-pink dark:hover:bg-darkerpink"
                >
                  Create an account
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-yellow"
                  >
                    Login here
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
      <NotifComponent />
    </div>
  );
}
