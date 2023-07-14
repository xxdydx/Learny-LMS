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
import { Box, createTheme, ThemeProvider } from "@mui/material";
import { Inter } from "next/font/google";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridActionsCellItem,
  GridRowId,
} from "@mui/x-data-grid";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import courseService from "@/app/services/courses";
import { Recording } from "@/app/types";
import LinkIcon from "@mui/icons-material/Link";

const inter = Inter({ subsets: ["latin"] });

export default function SettingsPage({ params }: { params: { slug: string } }) {
  const courses = useAppSelector((state) => state.courses);
  const [recordings, setRecordings] = useState<Recording[]>();
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
      courseService
        .getZoomRecordings(parseInt(params.slug))
        .then((response) => {
          setRecordings(response);
        });
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
  const recordingsMapped = recordings?.map((item, index) => {
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
    return { ...item, duration: newDur, sn: index + 1, start_time: dateObj };
  });

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
                    <h1 className="text-3xl tracking-tight font-semibold text-gray-900 dark:text-white mb-8">
                      Recordings
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
