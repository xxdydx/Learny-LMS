"use client";

import { useAppSelector } from "@/app/hooks";
import { useEffect } from "react";
import { useAuth } from "@/app/hooks";
import { useAppDispatch } from "@/app/hooks";
import { initializeCourses } from "@/app/reducers/courseReducer";
import { useRouter } from "next/navigation";
import LoadingPage from "@/app/components/LoadingPage";
import NotifComponent from "@/app/components/NotifComponent";
import NavigationBar from "@/app/components/NavigationBar";
import TextField from "@mui/material/TextField";
import { createTheme, ThemeProvider } from "@mui/material";
import { Inter } from "next/font/google";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import AddNewStudentForm from "@/app/components/FormModal/AddNewStudent";

const inter = Inter({ subsets: ["latin"] });

export default function SettingsPage({ params }: { params: { slug: string } }) {
  const courses = useAppSelector((state) => state.courses);
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
    return <main className="bg-bg min-h-screen"></main>;
  }

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
  ];

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
                          />
                        </div>

                        <div className="pt-4">
                          <TextField
                            fullWidth
                            id="standard-basic"
                            label="Course Description"
                            variant="standard"
                            defaultValue={course.description}
                          />
                        </div>
                      </div>
                      <button
                        className="flex justify-start	text-heading-4 font-semibold px-2  bg-transparent text-pink hover-hover:hover:text-darkerpink hover-hover:active:text-darkerpink hover-hover:focus-visible:text-darkerpink"
                        title="Save"
                        type="button"
                      >
                        Save
                      </button>
                    </a>
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
                          className="text-white text-heading-4 font-semibold bg-[#ff4081] hover:bg-canary-500 font-medium rounded-2xl px-5 py-2.5 text-center mr-2 mb-2 dark:bg-[#ff4081] dark:hover:bg-[#f01b68]"
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
