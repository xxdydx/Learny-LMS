"use client";

import * as React from "react";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled, alpha, ThemeProvider } from "@mui/material/styles";
import { Divider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Inter } from "next/font/google";
import { deleteCourse, updateCourse } from "@/app/reducers/courseReducer";
import { useAppDispatch } from "@/app/hooks";
import { useRouter } from "next/navigation";
import { setNotification } from "@/app/reducers/notifReducer";
import { Notif } from "@/app/types";
import { AxiosError } from "axios";
import { NewCourse } from "@/app/types";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TextField,
} from "@mui/material";

const ITEM_HEIGHT = 36;
const inter = Inter({ subsets: ["latin"] });
interface Props {
  id: number;
}

export default function CourseMenu({ id }: Props) {
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const router = useRouter();
  const open = Boolean(anchorEl);
  const handleCloseClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleEditOptionClick = () => {
    setAnchorEl(null);
    setOpenDialog(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleEdit = async (event: React.MouseEvent) => {
    event.preventDefault();
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
        await dispatch(updateCourse(id, newCourse));
        setTitle("");
        setDescription("");
        const notif: Notif = {
          type: "success",
          message: "Course created",
        };
        dispatch(setNotification(notif, 5000));
        setOpenDialog(false);
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

  const handleDelete = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (window.confirm(`Do you want to delete this course?`)) {
      try {
        await dispatch(deleteCourse(id));
        setAnchorEl(null);
        const notif: Notif = {
          message: "Course deleted",
          type: "info",
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

  const StyledButton = styled(Button)({
    textTransform: "none",
  });

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
      minWidth: 100,
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
          onClick={handleCloseClick}
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
              maxHeight: ITEM_HEIGHT * 4.5,
              width: "15ch",
            },
          }}
        >
          <MenuItem onClick={handleEditOptionClick}>
            <EditIcon />
            Edit
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
            onClose={handleDialogClose}
          >
            {" "}
            Edit course
          </NewDialogTitle>
          <DialogContent dividers>
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
            <StyledButton onClick={handleDialogClose}>Cancel</StyledButton>
            <StyledButton onClick={handleEdit}>Edit</StyledButton>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}
