"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createTheme, ThemeProvider } from "@mui/material";
import { Inter } from "next/font/google";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import courseService from "@/app/services/courses";
import { useState } from "react";
import { Course, NewCourse, NewEnrollment, Notif } from "@/app/types";
import { addEnrollment, createCourse } from "@/app/reducers/courseReducer";
import styled from "@mui/material/styles/styled";
import { useRouter } from "next/navigation";
import { setNotification } from "@/app/reducers/notifReducer";
import { AxiosError } from "axios";

const inter = Inter({ subsets: ["latin"] });
interface Props {
  courseId: number;
  courseTitle: string;
  children: React.ReactNode;
}

export default function AddNewStudentForm({
  courseId,
  courseTitle,
  children,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
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

    if (username.trim().length === 0) {
      const notif: Notif = {
        type: "error",
        message: `No empty strings allowed`,
      };
      dispatch(setNotification(notif, 5000));
    } else {
      const newEnrollment: NewEnrollment = {
        username: username && username.trim(),
        courseId: courseId,
      };
      try {
        const response = await dispatch(addEnrollment(newEnrollment));
        const notif: Notif = {
          type: "success",
          message: `Student u/${username} added`,
        };
        dispatch(setNotification(notif, 5000));
        setUsername("");
        setOpen(false);
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
        <div onClick={handleClickOpen}>{children}</div>

        <Dialog
          open={open}
          onClose={handleClose}
          fullWidth
          PaperProps={{ style: { backgroundColor: "black" } }}
        >
          <NewDialogTitle id="customized-dialog-title" onClose={handleClose}>
            {" "}
            Add student to course
          </NewDialogTitle>
          <DialogContent dividers>
            <DialogContentText>
              Add a student to <b>{courseTitle}</b>.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Student's username"
              type="text"
              required={true}
              onChange={({ target }) => setUsername(target.value)}
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
