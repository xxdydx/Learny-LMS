"use client";

import { Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import loginService from "../../services/login";
import courseService from "../../services/courses";
import Link from "@mui/material";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import userReducer, {
  initializeUsers,
  setUser,
} from "../../reducers/userReducer";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useAuth } from "../../hooks";
import LoadingPage from "../../components/LoadingPage";
import { setNotification } from "../../reducers/notifReducer";
import { Notif } from "../../types";
import NotifComponent from "../../components/NotifComponent";
import { Inter } from "next/font/google";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
const inter = Inter({ subsets: ["latin"] });
const theme = createTheme({
  typography: {
    fontFamily: inter.style.fontFamily,
  },
  palette: {
    mode: "dark",
  },
});

export default function MyPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, user] = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if(user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/dashboard");
      }
    }
  }, [isLoading, user]);

  if (isLoading || user) {
    return <LoadingPage />;
  }

  const DisplayingErrorMessagesSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required!"),
    password: Yup.string()
      .required("How are you going to log in without a password? 🙄"),
  });

  // attempts login thru API, sets token in local storage, dispatches token to reducers and authenticates user
  const handleLogin = async (values: any) => {
    const { username, password } = values;
    try {
      setLoading(true);
      const user = await loginService.login({ username, password });
      // Set token (issued by backend) in localstorage
      window.localStorage.setItem("AKAppSessionID", JSON.stringify(user));
      courseService.setToken(user.token);
      dispatch(setUser(user));
      console.log(user.role === "admin");
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error: unknown) {
      // Error handling
      setLoading(false);
      const notif: Notif = {
        message: "Unknown error happpened. Contact support!",
        type: "error"
      };
      dispatch(setNotification(notif, 5000));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="dark">
      {loading && <LoadingPage/>}
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
                  Sign in to your account
                </h1>
                <Formik
                initialValues={{
                  username: "",
                  password: "",
                }}
                validationSchema={DisplayingErrorMessagesSchema}
                onSubmit={(values) => {
                  handleLogin(values);
                }}
              >
                  {({ errors, touched }) => (
                <Form
                  className="space-y-4 md:space-y-6"
                >
                  <div>
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your username
                    </label>
                    <Field
                        type="username"
                        name="username"
                        id="username"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-bg  dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow dark:focus:border-yellow"
                      />
                    {touched.username && errors.username && (
                        <div className="mt-1 text-xs text-red-600">
                          {errors.username}
                        </div>
                      )}
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <Field
                        type="password"
                        name="password"
                        id="password"
                        placeholder="••••••••"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-bg  dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow dark:focus:border-yellow"
                      />
                      {touched.password && errors.password && (
                        <div className="mt-1 text-xs text-red-600">
                          {errors.password}
                        </div>
                      )}
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
                </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
          <NotifComponent />
        </section>
      </div>
    </ThemeProvider>
  );
}
