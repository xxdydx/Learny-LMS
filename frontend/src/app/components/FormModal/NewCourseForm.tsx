"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createTheme, ThemeProvider } from "@mui/material";
import { Inter } from "next/font/google";
import { useAppDispatch, useAppSelector } from "@/hooks";
import courseService from "@/services/courses";
import { useState } from "react";
import { Course, NewCourse, Notif } from "@/types";
import { createCourse } from "@/reducers/courseReducer";
import styled from "@mui/material/styles/styled";
import { useRouter } from "next/navigation";
import { setNotification } from "@/reducers/notifReducer";
import { AxiosError } from "axios";
import AddIcon from "@mui/icons-material/Add";

const inter = Inter({ subsets: ["latin"] });

export default function NewCourseForm() {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const router = useRouter();
  const dispatch = useAppDispatch();

  const StyledButton = styled(Button)({
    textTransform: "none",
  });

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    // See if title and description fields are empty
    if (title.trim().length === 0 || description.trim().length === 0) {
      const notif: Notif = {
        type: "info",
        message: "Title and description cannot be empty",
      };
      dispatch(setNotification(notif, 5000));
    } else {
      try {
        const newCourse: NewCourse = {
          title: title && title.trim(),
          description: description && description.trim(),
        };
        await dispatch(createCourse(newCourse));
        setTitle("");
        setDescription("");
        const notif: Notif = {
          type: "success",
          message: "Course created",
        };
        dispatch(setNotification(notif, 5000));
        setOpen(false);
        router.push("/dashboard");
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

  interface DialogTitleProps {
    id: string;
    children?: React.ReactNode;
    onClose: () => void;
  }

  const NewDialogTitle = (props: DialogTitleProps) => {
    const { children, onClose, ...other } = props;

    return (
      <DialogTitle {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <Tooltip title="Create course" placement="top">
          <button
            type="button"
            onClick={handleClickOpen}
            className="text-white text-heading-4 font-semibold bg-[#ff4081] hover:bg-canary-500 font-medium rounded-2xl px-5 py-2.5 text-center mr-2 mb-2 dark:bg-[#ff4081] dark:hover:bg-[#f01b68]"
          >
            <AddIcon />
          </button>
        </Tooltip>

        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{ style: { backgroundColor: "black" } }}
        >
          <NewDialogTitle id="customized-dialog-title" onClose={handleClose}>
            {" "}
            Create course
          </NewDialogTitle>
          <DialogContent dividers>
            <DialogContentText>
              Create a course here. You can initialize chapters, sections, files
              and add students later on.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Course Title"
              type="text"
              required={true}
              onChange={({ target }) => setTitle(target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="name"
              label="Description"
              type="text"
              required={true}
              onChange={({ target }) => setDescription(target.value)}
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <StyledButton onClick={handleClose}>Cancel</StyledButton>
            <StyledButton onClick={handleCreate}>Create</StyledButton>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}
