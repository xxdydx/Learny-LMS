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
import { NewFile } from "@/app/types";
import { addFile } from "@/app/reducers/courseReducer";
import styled from "@mui/material/styles/styled";
import { useRouter } from "next/navigation";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";

const inter = Inter({ subsets: ["latin"] });
interface Props {
  sxnId: number;
}

export default function NewFileForm({ sxnId }: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [link, setLink] = useState<string>("");
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

    if (name.trim().length === 0 || link.trim().length === 0) {
      console.log("No empty strings allowed");
    } else {
      const newFile: NewFile = {
        name: name && name.trim(),
        link: link && link.trim(),
      };
      console.log(newFile);
      await dispatch(addFile(newFile, sxnId));
      setName("");
      setLink("");
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
        <div onClick={handleClickOpen}>
          {" "}
          <MenuItem>
            <AddIcon />
            Create File
          </MenuItem>
        </div>

        <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{ style: { backgroundColor: "black" } }}
        >
          <NewDialogTitle id="customized-dialog-title" onClose={handleClose}>
            {" "}
            Upload file
          </NewDialogTitle>
          <DialogContent dividers>
            <DialogContentText>
              Upload a tutorial file or worksheet here.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="File Name"
              type="text"
              required={true}
              onChange={({ target }) => setName(target.value)}
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="name"
              label="File Link"
              type="text"
              required={true}
              onChange={({ target }) => setLink(target.value)}
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
