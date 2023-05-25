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
import { Chapter, Course, NewCourse, NewSection, Notif } from "@/app/types";
import { addSection, createCourse } from "@/app/reducers/courseReducer";
import styled from "@mui/material/styles/styled";
import { useRouter } from "next/navigation";
import { NewChapter } from "@/app/types";
import { addChapter } from "@/app/reducers/courseReducer";
import { setNotification } from "@/app/reducers/notifReducer";

const inter = Inter({ subsets: ["latin"] });
interface Props {
  chapterId: number;
  children: React.ReactNode;
}

export default function NewSectionForm({ chapterId, children }: Props) {
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
      const newSection: NewSection = {
        title: title && title.trim(),
      };

      await dispatch(addSection(newSection, chapterId));
      setTitle("");
      const notif: Notif = {
        type: "success",
        message: "Section created",
      };
      await dispatch(setNotification(notif, 5000));
      setOpen(false);
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
            Create section
          </NewDialogTitle>
          <DialogContent dividers>
            <DialogContentText>Add a section here.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Section Title"
              type="text"
              required={true}
              onChange={({ target }) => setTitle(target.value)}
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
