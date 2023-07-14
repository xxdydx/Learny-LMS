"use client";

import { useAppSelector } from "@/app/hooks";
import { useEffect } from "react";
import { useAuth } from "@/app/hooks";
import { useAppDispatch } from "@/app/hooks";
import {
  deleteEnrollment,
  initializeCourses,
} from "@/app/reducers/courseReducer";
import { useRouter } from "next/navigation";
import LoadingPage from "@/app/components/LoadingPage";
import NotifComponent from "@/app/components/NotifComponent";
import NavigationBar from "@/app/components/NavigationBar";
import TextField from "@mui/material/TextField";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import { Inter } from "next/font/google";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridActionsCellItem,
  GridRowId,
} from "@mui/x-data-grid";
import AddNewStudentForm from "@/app/components/FormModal/AddNewStudent";
import { useState } from "react";
import { setNotification } from "@/app/reducers/notifReducer";
import { Notif } from "@/app/types";
import { updateCourse } from "@/app/reducers/courseReducer";
import axios, { AxiosError } from "axios";
import { NewCourse } from "@/app/types";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Switch, { SwitchProps } from "@mui/material/Switch";
import { styled } from "@mui/material/styles";
import courseService from "@/app/services/courses";
import { Recording } from "@/app/types";
import LinkIcon from "@mui/icons-material/Link";

const inter = Inter({ subsets: ["latin"] });

export default function SettingsPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  // abstracted GET users and courses into a hook
  const [isLoading, user] = useAuth();
  const [show, setShow] = useState<boolean>(false);
  const [recordings, setRecordings] = useState<Recording[]>();
  // if page is loaded + no user => redirect to login page
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user]);

  useEffect(() => {
    if (user) {
      courseService.getAllZoomRecordings().then((response) => {
        setRecordings(response);
      });
    }
  }, [dispatch, user]);

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
  useEffect(() => {
    // Check if the 'code' parameter is present in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get("code");
    setShow(codeParam !== null);
  }, []);

  // if page is loading and no user => redirect to loading page
  if (isLoading || !user) {
    return <LoadingPage />;
  }

  if (user.role === "student") {
    router.push("/");
  }

  const handleSync = async (event: React.MouseEvent) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get("code");
    const response = await axios.post(`/api/recordings/sync?code=${codeParam}`);
    console.log(response);
    if (response.data === "Process complete") {
      const notif: Notif = {
        message: "Zoom Cloud Recordings synced",
        type: "success",
      };
      dispatch(setNotification(notif, 5000));
    } else {
      const notif: Notif = {
        message:
          "Zoom Cloud Recordings sync failed. Try logging in again with your Zoom account.",
        type: "error",
      };
      dispatch(setNotification(notif, 5000));
    }
  };

  const columns: GridColDef[] = [
    { field: "sn", headerName: "S/N", flex: 0.5, resizable: true },
    { field: "title", headerName: "Name", flex: 1, resizable: true },
    {
      field: "duration",
      headerName: "Duration",
      flex: 1,
      resizable: true,
    },
    {
      field: "start_time",
      headerName: "Start Time",
      flex: 1,
      resizable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Link",
      flex: 0.5,
      resizable: true,
      cellClassName: "actions",
      getActions: ({ row }) => {
        return [
          <GridActionsCellItem
            icon={<LinkIcon />}
            label="Link"
            onClick={() => window.open(row.share_url)}
            color="inherit"
          />,
        ];
      },
    },
  ];
  const recordingsMapped = recordings
    ? recordings?.map((item, index) => {
        const dateObj = new Date(item.start_time).toLocaleString("en-GB", {
          timeZone: "Asia/Singapore",
        });
        function formatMinutes(minutes: number) {
          const hours = Math.floor(minutes / 60);
          const remainingMinutes = minutes % 60;
          const formattedHours = hours > 0 ? `${hours}h` : "";
          const formattedMinutes = `${remainingMinutes}m`;
          return `${formattedHours}${formattedMinutes}`;
        }
        const newDur = formatMinutes(item.duration);
        return {
          ...item,
          duration: newDur,
          sn: index + 1,
          start_time: dateObj,
        };
      })
    : [];

  const StyledGridOverlay = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    "& .ant-empty-img-1": {
      fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626",
    },
    "& .ant-empty-img-2": {
      fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959",
    },
    "& .ant-empty-img-3": {
      fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343",
    },
    "& .ant-empty-img-4": {
      fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
    },
    "& .ant-empty-img-5": {
      fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
      fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff",
    },
  }));

  function CustomNoRowsOverlay() {
    return (
      <StyledGridOverlay>
        <Box sx={{ mt: 1 }}>
          {user?.role === "teacher"
            ? "No recordings found. Check if Zoom Integration is set up in the settings page"
            : "No recordings found"}
        </Box>
      </StyledGridOverlay>
    );
  }

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
                    <h1 className="text-3xl tracking-tight font-semibold text-gray-900 dark:text-white mb-4">
                      Zoom Cloud Recordings Integration
                    </h1>

                    <p className="text-base mb-6 dark:text-text">
                      Automatically sync meeting cloud recording links with
                      Learny, so that your students can get access to the
                      recording links. You need to have a Zoom Premium license
                      to access this feature.
                    </p>

                    <p className="text-base mb-6 dark:text-text">
                      <u>
                        Steps to integrate your Zoom account with Learny LMS
                      </u>
                      <ol className="list-decimal">
                        <li>
                          Add your meeting name to the course settings page.
                        </li>
                        <li>
                          Once the meeting's over, head over to the Integrations
                          page, press the 'Log in with Zoom' button and log in
                          with your Zoom account.
                        </li>
                        <li>
                          Then, press the 'Sync recordings' button and the list
                          of recordings from your account will be transferred
                          over to Learny LMS.
                        </li>
                      </ol>
                    </p>

                    <h1 className="text-2xl tracking-tight font-semibold text-gray-900 dark:text-white mb-8">
                      Sync Recordings
                    </h1>
                    <button
                      type="button"
                      onClick={() => {
                        window.location.href =
                          "https://zoom.us/oauth/authorize?response_type=code&client_id=W52xPeVSToSqXwW4jbZglg&redirect_uri=https%3A%2F%2Flearny-lms.vercel.app%2Frecordings";
                      }}
                      className="text-white text-heading-4 font-semibold bg-[#ff4081] hover:bg-canary-500 font-medium rounded-2xl px-5 py-2.5 text-center mr-2 mb-2 dark:bg-[#ff4081] dark:hover:bg-[#f01b68]"
                    >
                      Log in with Zoom
                    </button>

                    {show && (
                      <button
                        type="button"
                        onClick={handleSync}
                        className="text-white text-heading-4 font-semibold bg-[#ff4081] hover:bg-canary-500 font-medium rounded-2xl px-5 py-2.5 text-center mr-2 mb-2 dark:bg-[#ff4081] dark:hover:bg-[#f01b68]"
                      >
                        Sync Recordings
                      </button>
                    )}

                    <h1 className="text-2xl tracking-tight font-semibold text-gray-900 dark:text-white mt-12 mb-8">
                      List of Recordings synced
                    </h1>

                    <div style={{ width: "100%", maxHeight: 800 }}>
                      <DataGrid
                        rows={recordingsMapped ? recordingsMapped : []}
                        columns={columns}
                        autoHeight
                        slots={{
                          noRowsOverlay: CustomNoRowsOverlay,
                        }}
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
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
