"use client";

import { useAppSelector } from "@/hooks";
import { useEffect } from "react";
import { useAuth } from "@/hooks";
import { useAppDispatch } from "@/hooks";
import { deleteEnrollment, initializeCourses } from "@/reducers/courseReducer";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import NotifComponent from "@/components/NotifComponent";
import NavigationBar from "@/components/NavigationBar";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material";
import { Inter } from "next/font/google";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridActionsCellItem,
  GridRowId,
} from "@mui/x-data-grid";
import AddNewStudentForm from "@/components/FormModal/AddNewStudent";
import { useState } from "react";
import { setNotification } from "@/reducers/notifReducer";
import { Notif } from "@/types";
import { updateCourse } from "@/reducers/courseReducer";
import { AxiosError } from "axios";
import { NewCourse } from "@/types";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import { Course } from "@/types";
import { isNull } from "util";

const inter = Inter({ subsets: ["latin"] });

export default function SettingsPage({ params }: { params: { slug: string } }) {
  const courses = useAppSelector((state) => state.courses);
  const [course, setCourse] = useState<Course | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [zoomName, setZoomName] = useState<string>("");
  const [copyClicked, setCopyClicked] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const theme = createTheme({
    typography: {
      fontFamily: inter.style.fontFamily,
    },

    palette: {
      mode: "dark",
      primary: {
        main: "#fec006",
      },
    },
  });
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

  useEffect(() => {
    const course1 = courses.find(
      (course) => course.id === parseInt(params.slug)
    );
    setCourse(course1 ? course1 : null);
  }, [courses, params.slug]);

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description ? course.description : "");
      setZoomName(course.zoomName ? course.zoomName : "");
    }
  }, [course]);

  // if page is loading and no user => redirect to loading page
  if (isLoading || !user) {
    return <LoadingPage />;
  }
  if (!Array.isArray(courses)) {
    // handle error or return null
    return null;
  }

  if (course === null) {
    return <main className="bg-bg min-h-screen"></main>;
  }

  // handle removal of student from course
  const handleDeleteClick = (id: GridRowId) => async () => {
    if (window.confirm(`Do you want to remove this student from the course?`)) {
      try {
        const student = Number(id);
        await dispatch(deleteEnrollment(student, course.id));
        const notif: Notif = {
          message: "Student removed from course",
          type: "success",
        };
        dispatch(setNotification(notif, 5000));
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          const notif: Notif = {
            message: error.response?.data,
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
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "Student ID", flex: 0.5, resizable: true },
    { field: "name", headerName: "Name", flex: 1, resizable: true },
    {
      field: "username",
      headerName: "Username",
      flex: 1,
      resizable: true,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      resizable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      flex: 0.5,
      resizable: true,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  // handle editing of courses in settings page
  const handleEdit = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (title.trim().length === 0) {
      setTitle(course.title);
    }
    if (description.trim().length === 0) {
      setDescription(course.description ? course.description : "");
    }

    if (zoomName.trim().length === 0) {
      setZoomName(course.zoomName ? course.zoomName : "");
    }
    try {
      const newCourse: NewCourse = {
        title: title && title.trim(),
        description: description && description.trim(),
        zoomName: zoomName && zoomName.trim(),
      };
      await dispatch(updateCourse(course.id, newCourse));
      setTitle("");
      setDescription("");
      const notif: Notif = {
        type: "success",
        message: "Course edited",
      };
      dispatch(setNotification(notif, 5000));
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const notif: Notif = {
          message: error.response?.data,
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

  const CopyTextbox = () => {
    // Set the initial text for the textbox
    const text = `https://learny-lms.vercel.app/register/courses/${course.id}`;
    // Function to handle the "Copy" button click
    const handleCopy = () => {
      setCopyClicked(true)
      setTimeout(() => {
        setCopyClicked(false);
      }, 2000);
      navigator.clipboard.writeText(text);
      const notif: Notif = {
        message: "Copied to clipboard",
        type: "info",
      };
      dispatch(setNotification(notif, 2000));
    };

    return (
      <div className="flex flex-row ">
        <input
          type="text"
          value={text}
          readOnly
          className={`sm:w-full md:w-1/2 bg-gray-50 border ${copyClicked ? "border-pink" : "border-gray-300"} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-bg dark:placeholder-gray-400 ${copyClicked ? "dark:text-pink" : "dark:text-white"} dark:hover:ring-yellow dark:focus:border-yellow`}
        ></input>
        <button
          className="flex justify-start	text-heading-4 font-semibold px-2 py-2 bg-transparent text-pink hover:text-darkerpink hover-hover:active:text-darkerpink hover-hover:focus-visible:text-darkerpink"
          title="Copy"
          type="button"
          onClick={handleCopy}
        >
          <ContentCopyIcon />
        </button>
      </div>
    );
  };

  const SwitchComponent = styled((props: SwitchProps) => (
    <Switch
      focusVisibleClassName=".Mui-focusVisible"
      disableRipple
      {...props}
    />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor:
            theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  }));

  return (
    <ThemeProvider theme={theme}>
      <div className="dark">
        <div className="dark:bg-bg">
          <NavigationBar />
          <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 bg-white dark:bg-bg">
            <div className="min-h-screen flex justify-between px-4 mx-auto max-w-6xl">
              <div className="flex-grow mx-4">
                <div className="bg-white dark:bg-bg min-h-screen">
                  <div className=" w-full lg:max-w-6xl">
                    <h1 className="mb-8 text-3xl tracking-tight font-semibold text-gray-900 dark:text-white">
                      Course Details
                    </h1>

                    <a className="flex flex-col p-4 bg-white rounded-2xl md:flex-col md:max-w-6xl dark:bg-surface">
                      <div className="flex flex-col py-4">
                        <div className="">
                          <TextField
                            fullWidth
                            id="standard-basic"
                            label="Course Title"
                            variant="standard"
                            defaultValue={course.title}
                            onChange={({ target }) => setTitle(target.value)}
                          />
                        </div>

                        <div className="pt-4">
                          <TextField
                            fullWidth
                            id="standard-basic"
                            label="Course Description"
                            variant="standard"
                            defaultValue={course.description}
                            onChange={({ target }) =>
                              setDescription(target.value)
                            }
                          />
                        </div>
                      </div>
                      <button
                        className="flex justify-start	text-heading-4 font-semibold px-2  bg-transparent text-pink hover-hover:hover:text-darkerpink hover-hover:active:text-darkerpink hover-hover:focus-visible:text-darkerpink"
                        title="Save"
                        type="button"
                        onClick={handleEdit}
                      >
                        Save
                      </button>
                    </a>

                    <div className="mt-12 mx-auto ">
                      <h1 className="text-3xl mb-2 tracking-tight font-semibold text-gray-900 dark:text-white">
                        Sharing Link
                      </h1>
                      <p className="text-base mb-2 dark:text-text">
                        Allow students to create an account and directly enroll
                        into your course.
                      </p>

                      <CopyTextbox />
                    </div>
                    <div className="mt-12 mb-8 flex justify-between mx-auto">
                      <h1 className="text-3xl tracking-tight font-semibold text-gray-900 dark:text-white">
                        Students
                      </h1>
                      <AddNewStudentForm
                        courseId={course.id}
                        courseTitle={course.title}
                      >
                        <button
                          type="button"
                          className="text-white text-heading-4 font-semibold bg-[#ff4081] hover:bg-canary-500 font-medium rounded-2xl px-5 py-2.5 text-center ml-2 mr-2 mb-2 dark:bg-[#ff4081] dark:hover:bg-[#f01b68]"
                        >
                          Add Student
                        </button>
                      </AddNewStudentForm>
                    </div>

                    <div style={{ width: "100%", maxHeight: 800 }}>
                      <DataGrid
                        rows={course ? course.students : []}
                        columns={columns}
                        autoHeight
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize: 5 },
                          },
                        }}
                        pageSizeOptions={[5, 10]}
                      />
                    </div>
                  </div>
                  <div className="mt-12 mx-auto ">
                    <div className="flex justify-between">
                      <h1 className="text-3xl mb-2 tracking-tight font-semibold text-gray-900 dark:text-white">
                        Zoom Integration
                      </h1>
                      <div className="my-2">
                        <SwitchComponent
                          defaultChecked={course.zoomName ? true : false}
                        />
                      </div>
                    </div>

                    <p className="text-base mb-6 dark:text-text">
                      Automatically sync weekly meeting recording links with
                      Learny.
                    </p>
                    <label className="text-gray-900 dark:text-text mr-4">
                      Zoom Name
                    </label>
                    <input
                      type="text"
                      defaultValue={course.zoomName}
                      onChange={({ target }) => setZoomName(target.value)}
                      className="sm:w-full md:w-1/2 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 p-2.5 dark:bg-bg dark:placeholder-gray-400 dark:text-white dark:hover:ring-yellow dark:focus:border-yellow"
                    ></input>
                    <button
                      className="flex justify-start	text-heading-4 font-semibold px-2  bg-transparent text-pink hover-hover:hover:text-darkerpink hover-hover:active:text-darkerpink hover-hover:focus-visible:text-darkerpink"
                      title="Save"
                      type="button"
                      onClick={handleEdit}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <NotifComponent />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
