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
import { createCourse, submitToAssignment } from "@/reducers/courseReducer";
import styled from "@mui/material/styles/styled";
import { useRouter } from "next/navigation";
import { setNotification } from "@/reducers/notifReducer";
import { AxiosError } from "axios";
import AddIcon from "@mui/icons-material/Add";

const inter = Inter({ subsets: ["latin"] });

export default function SubmitAssignmentForm({
  title,
  id,
  checkAssignmentSubmit,
}: {
  title: string;
  id: number;
  checkAssignmentSubmit: boolean;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
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

  // handling setting of file to state variable once user attaches the file
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    // only choosing PDF files here
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile as unknown as File);
    }
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    const newFile = new FormData();

    if (file === null) {
      const notif: Notif = {
        message: "No file uploaded",
        type: "error",
      };
      dispatch(setNotification(notif, 5000));
      return;
    }

    if (file) {
      newFile.append("file", file as unknown as Blob, file?.name);
    }

    try {
      await dispatch(submitToAssignment(newFile, id));
      setOpen(false);
      const notif: Notif = {
        type: "success",
        message: "Assignment submitted",
      };
      await dispatch(setNotification(notif, 5000));
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
        <button
          type="button"
          onClick={handleClickOpen}
          disabled={checkAssignmentSubmit}
          className="text-white text-heading-4 font-semibold bg-[#ff4081] disabled:cursor-not-allowed hover:bg-canary-500 font-medium rounded-2xl px-5 py-2.5 text-center mr-2 mb-2 dark:bg-[#ff4081] dark:hover:bg-[#f01b68]"
        >
          Submit to assignment
        </button>

        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{ style: { backgroundColor: "black" } }}
        >
          <NewDialogTitle id="customized-dialog-title" onClose={handleClose}>
            {" "}
            Submit an assignment
          </NewDialogTitle>
          <DialogContent dividers>
            <DialogContentText sx={{ mt: 2 }}>
              Choose a file to upload onto our servers. Only PDF files are
              accepted for now.
            </DialogContentText>
            <div className="mt-2 mb-6">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf"
                required
              />
            </div>
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
