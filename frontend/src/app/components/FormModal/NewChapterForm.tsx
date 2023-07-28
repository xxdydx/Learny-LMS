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
import { useAppDispatch, useAppSelector } from "@/hooks";
import courseService from "@/services/courses";
import { useState } from "react";
import { Chapter, Course, NewCourse } from "@/types";
import { createCourse } from "@/reducers/courseReducer";
import styled from "@mui/material/styles/styled";
import { useRouter } from "next/navigation";
import { NewChapter } from "@/types";
import { addChapter } from "@/reducers/courseReducer";
import AddIcon from "@mui/icons-material/Add";
import { setNotification } from "@/reducers/notifReducer";
import { Notif } from "@/types";

const inter = Inter({ subsets: ["latin"] });
interface Props {
  courseId: number;
}

export default function NewChapterForm({ courseId }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
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

    if (title.trim().length === 0) {
      console.log("No empty strings allowed");
    } else {
      const newChapter: NewChapter = {
        title: title && title.trim(),
        pinned: false,
      };
      await dispatch(addChapter(newChapter, courseId));
      setTitle("");
      setOpen(false);
      const notification: Notif = {
        type: "success",
        message: "Chapter created",
      };
      dispatch(setNotification(notification, 5000));
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
          className="text-white text-heading-4 font-semibold bg-[#ff4081] hover:bg-canary-500 font-medium rounded-2xl px-5 py-2.5 text-center mr-2 mb-2 dark:bg-[#ff4081] dark:hover:bg-[#f01b68]"
        >
          <AddIcon />
        </button>

        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{ style: { backgroundColor: "black" } }}
        >
          <NewDialogTitle id="customized-dialog-title" onClose={handleClose}>
            {" "}
            Add a chapter
          </NewDialogTitle>
          <DialogContent dividers>
            <DialogContentText>
              A great way to organise your files according to different topics.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Chapter Title"
              type="text"
              required={true}
              onChange={({ target }) => setTitle(target.value)}
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <StyledButton onClick={handleClose}>Cancel</StyledButton>
            <StyledButton onClick={handleCreate}>Add</StyledButton>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}
