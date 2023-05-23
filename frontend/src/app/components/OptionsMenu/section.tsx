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
import NewSectionForm from "../FormModal/NewSectionForm";
import NewFileForm from "../FormModal/NewFileForm";
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
  Input,
  Box,
  Fab,
  CircularProgress,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import FileUploadIcon from "@mui/icons-material/FileUpload";

import AWS from "aws-sdk";
import { AWSconfig } from "../../../../config";
import { AWSError, S3 } from "aws-sdk";

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
  const [file, setFile] = useState<null | File>(null);
  const [link, setLink] = useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  // initialize AWS bucket
  const s3 = new AWS.S3({
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
    region: process.env.NEXT_PUBLIC_AWS_REGION,
  });

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
  // handling setting of file to state variable once user attaches the file
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    // only choosing PDF files here
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    }
  };

  const buttonSx = success
    ? {
        backgroundColor: green[500],
        "&:hover": {
          backgroundColor: green[700],
        },
      }
    : {
        backgroundColor: "#ff4081",
      };

  // handling deletion of a section
  const handleDelete = async (event: React.MouseEvent) => {
    event.preventDefault();
    await dispatch(deleteSection(id));
    setAnchorEl(null);
  };

  const handleUpload = async () => {
    if (!loading) {
      setSuccess(false);
      setLoading(true);
    }
    if (file === null) {
      const notif: Notif = {
        message: "File cannot be null.",
        type: "error",
      };
      dispatch(setNotification(notif, 5000));
      return;
    }
    const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;

    const params = {
      Key: file?.name,
      Body: file,
      Bucket: bucketName ? bucketName : "",
      ContentType: file?.type,
    };

    try {
      const data = await s3.upload(params).promise();
      setSuccess(true);
      setLoading(false);
      setLink(data.Location);
    } catch (err) {
      console.log(err);
    }
  };

  // Handle creation of file once 'create' button is clicked
  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length === 0) {
      const notif: Notif = {
        message: "File name cannot be empty",
        type: "error",
      };
      dispatch(setNotification(notif, 5000));
      return;
    }
    if (link.trim().length === 0) {
      const notif: Notif = {
        message: "File must be uploaded before it can be created",
        type: "error",
      };
      dispatch(setNotification(notif, 5000));
      return;
    }

    try {
      const newFile: NewFile = {
        name: name && name.trim(),
        link: link,
      };

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
              {title}.
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
            <div className="flex justify-between">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf"
                required
              />

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ m: 1, position: "relative" }}>
                  <Fab
                    aria-label="save"
                    sx={buttonSx}
                    onClick={handleUpload}
                    disabled={file ? false : true}
                  >
                    {success ? <CheckIcon /> : <FileUploadIcon />}
                  </Fab>
                  {loading && (
                    <CircularProgress
                      size={68}
                      sx={{
                        color: green[500],
                        position: "absolute",
                        top: -6,
                        left: -6,
                        zIndex: 1,
                      }}
                    />
                  )}
                </Box>
              </Box>
            </div>
          </DialogContent>
          <DialogActions>
            <StyledButton onClick={() => setOpenDialog(false)}>
              Cancel
            </StyledButton>
            <StyledButton onClick={handleCreate} disabled={link === ""}>
              Create
            </StyledButton>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}
