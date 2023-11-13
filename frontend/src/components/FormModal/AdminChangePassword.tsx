"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { createTheme, ThemeProvider } from "@mui/material";
import { Inter } from "next/font/google";
import { useAppDispatch, useAppSelector } from "@/hooks";
import courseService from "@/services/courses";
import { Notif } from "@/types";
import styled from "@mui/material/styles/styled";
import { setNotification } from "@/reducers/notifReducer";
import { AxiosError } from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  openState: boolean;
  accountId: number;
  handleClose: () => void;
}

export default function AdminChangePassword({openState, accountId, handleClose}: Props) {
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


  const handleCreate = async (values: any) => {
    const { newPassword } = values;
    try {
      await courseService.changePasswordAdmin(accountId, newPassword);
      handleClose()
      const notif: Notif = {
        message: "Password changed successfully!",
        type: "success",
      };
      dispatch(setNotification(notif, 5000));
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
    newPassword: Yup.string()
      .min(8, "Your password must at least be 8 characters!")
      .required("How are you going to log in without a password? 🙄"),
  });

  const formik = useFormik({
    initialValues: {
      newPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handleCreate(values);
    },
  });


  return (
    <ThemeProvider theme={theme}>
      <div>
        <Dialog
          open={openState}
          onClose={handleClose}
          PaperProps={{ style: { backgroundColor: "black" } }}
          fullWidth={true}
        >
          <NewDialogTitle id="customized-dialog-title" onClose={handleClose}>
            {" "}
            Change password of this account 
          </NewDialogTitle>
          <form onSubmit={formik.handleSubmit}>
            <DialogContent dividers>
              <TextField
                margin="dense"
                id="newPassword"
                name="newPassword"
                label="New Password"
                type="password"
                required={true}
                fullWidth
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                helperText={formik.touched.newPassword && formik.errors.newPassword}
                variant="standard"
              />
              
            </DialogContent>
            <DialogActions>
              <StyledButton onClick={handleClose}>Cancel</StyledButton>
              <StyledButton type="submit">Change Password</StyledButton>
            </DialogActions>
          </form>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}
