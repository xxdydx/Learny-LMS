"use client";

import { useEffect } from "react";
import { useAuth } from "@/hooks";
import { useAppDispatch } from "@/hooks";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/LoadingPage";
import NotifComponent from "@/components/NotifComponent";
import NavigationBar from "@/components/NavigationBar";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import { Inter } from "next/font/google";
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowId,
} from "@mui/x-data-grid";
import { useState } from "react";
import { setNotification } from "@/reducers/notifReducer";
import { Notif, User } from "@/types";
import  { AxiosError } from "axios";
import { NewCourse } from "@/types";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { styled } from "@mui/material/styles";
import courseService from "@/services/courses";
import EditIcon from "@mui/icons-material/Edit";
import AdminChangePassword from "@/components/FormModal/AdminChangePassword";



const inter = Inter({ subsets: ["latin"] });

export default function SettingsPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  // abstracted GET users and courses into a hook
  const [isLoading, user] = useAuth();
  const [allUsers, setAllUsers] = useState<User[]>();
  const [allSessions, setAllSessions] = useState<any>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<number | null>(null);

  // if page is loaded + no user => redirect to login page
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user]);

  useEffect(() => {
    if (user && user.role === "admin") {
      courseService.getAllUsers().then((response) => {
        setAllUsers(response);
      });
      courseService.getAllSessions().then((response) => {
        setAllSessions(response);
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

  // if page is loading and no user => redirect to loading page
  if (isLoading || !user) {
    return <LoadingPage />;
  }

  if (user.role !== "admin") {
    router.push("/dashboard");
    return <LoadingPage />;
  }

  const handleOpenModal = (id: any) => () => {
    setActiveId(Number(id));
    setOpenModal(true);
  }

  const handleClose = () => {
    setActiveId(null);
    setOpenModal(false);
  };
  
  const userColumns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5, resizable: true },
    { field: "username", headerName: "Username", flex: 1, resizable: true },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      resizable: true,
    },
    {
      field: "role",
      headerName: "Role",
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
          <div>
            <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Link"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Link"
            onClick={handleOpenModal(id)}
            color="inherit"
          />
          </div>
          
        ];
      },
    },
  ];

  const sessionColumns: GridColDef[] = [
    { field: "username", headerName: "Username", flex: 0.5, resizable: true },
    {
      field: "login_time",
      headerName: "Last login time",
      flex: 0.5,
      resizable: true,
    },
  ];


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
          No users found.
        </Box>
      </StyledGridOverlay>
    );
  }

  const handleDeleteClick = (id: GridRowId) => async () => {
    if (window.confirm(`Do you want to delete this user permanently?`)) {
      try {
        const newUsersList = await courseService.deleteUser(Number(id));
        setAllUsers(newUsersList);
        const notif: Notif = {
          message: "User deleted successfully!",
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

  const sessionsMapped = allSessions?.map((item: any) => {
    const dateObj = new Date(item.login_time).toLocaleString("en-GB", {
      timeZone: "Asia/Singapore",
    });
    return { ...item, login_time: dateObj };
  });

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
                      Admin Management Page
                    </h1>

                    <h1 className="text-2xl tracking-tight font-semibold text-gray-900 dark:text-white mt-12 mb-8">
                      List of users
                    </h1>

                    <div style={{ width: "100%", maxHeight: 800 }}>
                      <DataGrid
                        rows={allUsers ? allUsers : []}
                        columns={userColumns}
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

                    <h1 className="text-2xl tracking-tight font-semibold text-gray-900 dark:text-white mt-14 mb-8">
                      List of sessions
                    </h1>

                    <div style={{ width: "100%", maxHeight: 800 }}>
                      <DataGrid
                        rows={sessionsMapped ? sessionsMapped : []}
                        columns={sessionColumns}
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
                {
                  openModal && activeId && (<AdminChangePassword openState={openModal} accountId = {activeId} handleClose={handleClose} />)
                } 
              </div>
            </div>
            <NotifComponent />
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
