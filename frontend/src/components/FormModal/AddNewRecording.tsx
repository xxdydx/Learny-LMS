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
import { Course, NewCourse, NewRecording, Notif } from "@/types";
import { createCourse } from "@/reducers/courseReducer";
import styled from "@mui/material/styles/styled";
import { useRouter } from "next/navigation";
import { setNotification } from "@/reducers/notifReducer";
import { AxiosError } from "axios";
import AddIcon from "@mui/icons-material/Add";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useFormik } from "formik";
import * as Yup from "yup";

const inter = Inter({ subsets: ["latin"] });

export default function AddNewRecording() {
  const [open, setOpen] = useState<boolean>(false);
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

  const handleCreate = async (values: any) => {
    const { title, shareUrl, duration, startTime } = values;
    try {
      const newRecording: NewRecording = {
        title: title,
        shareUrl: shareUrl,
        duration: duration,
        startTime: startTime.toDate().toISOString(),
      };
      await courseService.addRecording(newRecording);
      setOpen(false);
    } catch (error: unknown) {
      // Error handling
      if (error instanceof AxiosError) {
        const notif: Notif = {
          message: error.response?.data.error
            ? error.response?.data.error
            : error.response?.data,
          type: "error",
        };
        dispatch(setNotification(notif, 5000));
      } else {
        console.log(error);
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

  const validationSchema = Yup.object({
    title: Yup.string().required("Required"),
    startTime: Yup.date().required("Required"),
    duration: Yup.number(),
    shareUrl: Yup.string()
      .matches(
        /^(https?:\/\/)[\da-z.-]+\.[a-z.]{2,6}[\/\w .-]*\/?$/,
        "Enter correct URL"
      )
      .required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
      startTime: dayjs(new Date()),
      duration: "",
      shareUrl: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleCreate(values);
    },
  });

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
            Add Recording Manually
          </NewDialogTitle>
          <form onSubmit={formik.handleSubmit}>
            <DialogContent dividers>
              <TextField
                autoFocus
                margin="dense"
                id="title"
                name="title"
                label="Recording Title"
                type="text"
                required={true}
                fullWidth
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                variant="standard"
              />
              <TextField
                margin="dense"
                id="duration"
                sx={{ mb: 3 }}
                name="duration"
                label="Duration"
                type="text"
                required={true}
                fullWidth
                variant="standard"
                value={formik.values.duration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.duration && Boolean(formik.errors.duration)
                }
                helperText={formik.touched.duration && formik.errors.duration}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Start Time"
                  value={formik.values.startTime}
                  onChange={(value) =>
                    formik.setFieldValue("startTime", value, true)
                  }
                />
              </LocalizationProvider>

              <TextField
                margin="dense"
                id="shareUrl"
                name="shareUrl"
                label="Share URL"
                type="text"
                required={true}
                fullWidth
                variant="standard"
                value={formik.values.shareUrl}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.shareUrl && Boolean(formik.errors.shareUrl)
                }
                helperText={formik.touched.shareUrl && formik.errors.shareUrl}
              />
            </DialogContent>
            <DialogActions>
              <StyledButton onClick={handleClose}>Cancel</StyledButton>
              <StyledButton type="submit">Add</StyledButton>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}
