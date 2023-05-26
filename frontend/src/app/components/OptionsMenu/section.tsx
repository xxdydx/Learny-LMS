"use client";
import IconButton from "@mui/material/IconButton";
import { MenuProps } from "@mui/material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { styled, alpha, ThemeProvider } from "@mui/material/styles";
import { Divider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Inter } from "next/font/google";
import { deleteCourse, deleteSection } from "@/app/reducers/courseReducer";
import { deleteChapter } from "@/app/reducers/courseReducer";
import { useAppDispatch } from "@/app/hooks";
import React, { useState, useEffect } from "react";
import { NewFile, Notif } from "@/app/types";
import { addFile } from "@/app/reducers/courseReducer";
import { setNotification } from "@/app/reducers/notifReducer";
import { green } from "@mui/material/colors";
import {
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
} from "@mui/material";
import { File } from "buffer";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { Dayjs } from "dayjs";

const inter = Inter({ subsets: ["latin"] });
interface Props {
  id: number;
  title: string;
}

export default function SectionMenu({ id, title }: Props) {
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
    components: {
      MuiFab: {
        styleOverrides: {
          root: {
            color: "#ffffff",
            backgroundColor: "#ff4081",
            "&:hover": {
              backgroundColor: "#f01b68",
            },
          },
        },
      },
    },
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [name, setName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [visibleDate, setVisibleDate] = useState<Dayjs | null>(dayjs());
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuClick = () => {
    setAnchorEl(null);
    setOpenDialog(true);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  // handling deletion of a section
  const handleDelete = async (event: React.MouseEvent) => {
    event.preventDefault();
    await dispatch(deleteSection(id));
    setAnchorEl(null);
  };

  // handling setting of file to state variable once user attaches the file
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    // only choosing PDF files here
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile as unknown as File);
    }
  };

  // Handle creation of file once 'create' button is clicked
  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    const newFile = new FormData();
    if (name.trim().length === 0) {
      const notif: Notif = {
        message: "File name cannot be empty",
        type: "error",
      };
      dispatch(setNotification(notif, 5000));
      return;
    }
    if (file === null) {
      const notif: Notif = {
        message: "No file uploaded",
        type: "error",
      };
      dispatch(setNotification(notif, 5000));
      return;
    }
    const date = visibleDate
      ? visibleDate?.toDate().toISOString()
      : new Date().toISOString();
    newFile.append("name", name);
    newFile.append("file", file as unknown as Blob, file?.name);
    newFile.append("visibledate", date);

    try {
      await dispatch(addFile(newFile, id));
      const notif: Notif = {
        type: "success",
        message: "File uploaded",
      };
      await dispatch(setNotification(notif, 5000));
    } catch (error) {
      console.log(error);
    }
  };

  const StyledButton = styled(Button)({
    textTransform: "none",
  });

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

  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      {...props}
    />
  ))(({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 150,
      color:
        theme.palette.mode === "light"
          ? "rgb(55, 65, 81)"
          : theme.palette.grey[300],
      boxShadow:
        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
      "& .MuiMenu-list": {
        padding: "4px 0",
      },
      "& .MuiMenuItem-root": {
        "& .MuiSvgIcon-root": {
          fontSize: 16,
          marginRight: theme.spacing(1.5),
        },
        fontSize: 16,
      },
    },
  }));

  return (
    <ThemeProvider theme={theme}>
      <div>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <StyledMenu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          PaperProps={{
            style: {
              maxHeight: "none",
              width: "15ch",
            },
          }}
        >
          <MenuItem onClick={handleClose}>
            <EditIcon />
            Edit Section
          </MenuItem>
          <MenuItem onClick={handleMenuClick}>
            <AddIcon />
            Create File
          </MenuItem>

          <Divider sx={{ my: 0.5 }} />
          <MenuItem sx={{ color: "red" }} onClick={handleDelete}>
            <DeleteIcon sx={{ color: "red" }} />
            Delete
          </MenuItem>
        </StyledMenu>

        <Dialog
          open={openDialog}
          onClose={handleDialogClose}
          PaperProps={{ style: { backgroundColor: "black" } }}
        >
          <NewDialogTitle
            id="customized-dialog-title"
            onClose={() => setOpenDialog(false)}
          >
            Upload file
          </NewDialogTitle>
          <DialogContent dividers>
            <DialogContentText>
              Upload a tutorial file or worksheet here. You are uploading in{" "}
              <b>{title}</b>.
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
            <DialogContentText sx={{ mb: 4 }}>
              Set a date and time for this file to become visible for students.
            </DialogContentText>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="File visible date"
                value={visibleDate}
                onChange={(newValue) => setVisibleDate(newValue)}
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            <StyledButton onClick={() => setOpenDialog(false)}>
              Cancel
            </StyledButton>
            <StyledButton onClick={handleCreate}>Create</StyledButton>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}
