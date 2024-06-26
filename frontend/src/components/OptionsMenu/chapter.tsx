"use client";

import * as React from "react";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { styled, alpha, ThemeProvider } from "@mui/material/styles";
import { Divider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Inter } from "next/font/google";
import { deleteCourse } from "@/reducers/courseReducer";
import { deleteChapter } from "@/reducers/courseReducer";
import { useAppDispatch } from "@/hooks";
import { setNotification } from "@/reducers/notifReducer";
import { Chapter, NewChapter, NewSection, Notif } from "@/types";
import { addSection } from "@/reducers/courseReducer";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import { editChapter } from "@/reducers/courseReducer";
import PushPinIcon from "@mui/icons-material/PushPin";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { List, ListItem, ListItemText, ListItemButton } from "@mui/material";
import courseService from "@/services/courses";
import { useEffect } from "react";
import { AxiosError } from "axios";
import { Course } from "@/types";

const ITEM_HEIGHT = 36;
const inter = Inter({ subsets: ["latin"] });
interface Props {
  id: number;
  chapter: Chapter;
}

export default function ChapterMenu({ id, chapter }: Props): JSX.Element {
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
  const [openNSDialog, setOpenNSDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openCopyDialog, setOpenCopyDialog] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [chapterName, setChapterName] = useState<string>(
    chapter.title ? chapter.title : ""
  );
  const [title, setTitle] = useState<string>("");
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleNSDialogOpen = () => {
    setAnchorEl(null);
    setOpenNSDialog(true);
  };
  const handleEditDialogOpen = () => {
    setAnchorEl(null);
    setOpenEditDialog(true);
  };
  const handleCopyDialogOpen = () => {
    setAnchorEl(null);
    setOpenCopyDialog(true);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleNSDialogClose = () => {
    setOpenNSDialog(false);
  };
  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  };

  useEffect(() => {
    courseService.getAll().then((response) => {
      setCourses(response);
    });
  }, []);

  // to handle new section responses once 'create' button is clicked
  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim().length === 0) {
      console.log("No empty strings allowed");
    } else {
      const newSection: NewSection = {
        title: title && title.trim(),
      };

      await dispatch(addSection(newSection, id));
      setTitle("");
      const notif: Notif = {
        type: "success",
        message: "Section created",
      };
      await dispatch(setNotification(notif, 5000));
      setOpenNSDialog(false);
    }
  };

  const handleEditChapter = async (event: React.FormEvent) => {
    event.preventDefault();
    if (chapterName.trim().length === 0) {
      console.log("No empty strings allowed");
    } else {
      const chapter: NewChapter = {
        title: chapterName && chapterName.trim(),
      };

      await dispatch(editChapter(chapter, id));
      setChapterName("");
      const notif: Notif = {
        type: "success",
        message: "Chapter edited",
      };
      await dispatch(setNotification(notif, 5000));
      setOpenEditDialog(false);
    }
  };

  const handleCopyChapter = async (newCourseId: number) => {
    try {
      await courseService.copyChapter(id, newCourseId);

      const successNotif: Notif = {
        type: "success",
        message: "Chapter copied. Refresh the page to see changes.",
      };
      await dispatch(setNotification(successNotif, 5000));

      setOpenCopyDialog(false);
    } catch (error: unknown) {
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
          message: "Unknown error happened. Contact support!",
          type: "error",
        };
        dispatch(setNotification(notif, 5000));
      }
    }
  };

  // to ensure button's text is not all CAPS
  const StyledButton = styled(Button)({
    textTransform: "none",
  });

  // handle pinning of chapters
  const pinChapter = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (window.confirm(`Do you want to pin this chapter?`)) {
      try {
        const editChp = {
          ...chapter,
          pinned: true,
        };
        await dispatch(editChapter(editChp, id));
        setAnchorEl(null);
        const notif: Notif = {
          message: "Chapter pinned",
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

  const unpinChapter = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (window.confirm(`Do you want to unpin this chapter?`)) {
      try {
        const editChp = {
          ...chapter,
          pinned: false,
        };
        await dispatch(editChapter(editChp, id));
        setAnchorEl(null);
        const notif: Notif = {
          message: "Chapter unpinned",
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

  // Handle delete of chapter
  const handleDelete = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (window.confirm(`Do you want to delete this chapter?`)) {
      try {
        await dispatch(deleteChapter(id));
        setAnchorEl(null);
        const notif: Notif = {
          message: "Chapter deleted",
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
          <MenuItem onClick={handleEditDialogOpen}>
            <EditIcon />
            Edit
          </MenuItem>
          <MenuItem onClick={handleCopyDialogOpen}>
            <ContentCopyIcon />
            Copy
          </MenuItem>
          {chapter.pinned ? (
            <MenuItem onClick={unpinChapter}>
              <PushPinIcon />
              Unpin
            </MenuItem>
          ) : (
            <MenuItem onClick={pinChapter}>
              <PushPinIcon />
              Pin Chapter
            </MenuItem>
          )}
          <MenuItem onClick={handleNSDialogOpen}>
            <AddIcon />
            Add Section
          </MenuItem>

          <Divider sx={{ my: 0.5 }} />
          <MenuItem sx={{ color: "red" }} onClick={handleDelete}>
            <DeleteIcon sx={{ color: "red" }} />
            Delete
          </MenuItem>
        </StyledMenu>

        <Dialog
          open={openNSDialog}
          onClose={handleClose}
          fullWidth
          PaperProps={{ style: { backgroundColor: "black" } }}
        >
          <NewDialogTitle
            id="customized-dialog-title"
            onClose={handleNSDialogClose}
          >
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
            <StyledButton onClick={handleNSDialogClose}>Cancel</StyledButton>
            <StyledButton onClick={handleCreate}>Create</StyledButton>
          </DialogActions>
        </Dialog>

        {/* Edit chapter dialog */}
        <Dialog
          open={openEditDialog}
          onClose={handleEditDialogClose}
          fullWidth
          PaperProps={{ style: { backgroundColor: "black" } }}
        >
          <NewDialogTitle
            id="customized-dialog-title"
            onClose={handleEditDialogClose}
          >
            {" "}
            Edit chapter title
          </NewDialogTitle>
          <DialogContent dividers>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              defaultValue={chapter.title}
              type="text"
              required={true}
              onChange={({ target }) => setChapterName(target.value)}
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <StyledButton onClick={handleEditDialogClose}>Cancel</StyledButton>
            <StyledButton onClick={handleEditChapter}>Edit</StyledButton>
          </DialogActions>
        </Dialog>

        {/* Copy chapter dialog */}
        <Dialog
          open={openCopyDialog}
          onClose={() => setOpenCopyDialog(false)}
          fullWidth
          PaperProps={{ style: { backgroundColor: "black" } }}
        >
          <NewDialogTitle
            id="customized-dialog-title"
            onClose={() => setOpenCopyDialog(false)}
          >
            {" "}
            Copy this chapter to one of your other courses
          </NewDialogTitle>
          <DialogContent dividers>
            <List sx={{ pt: 0 }}>
              {courses.length > 0 &&
                courses.map((course) => (
                  <ListItem disableGutters key={course.id}>
                    <ListItemButton
                      selected={selectedCourse === course.id}
                      onClick={() => setSelectedCourse(course.id)}
                    >
                      <ListItemText primary={course.title} />
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
          </DialogContent>
          <DialogActions>
            <StyledButton onClick={() => setOpenCopyDialog(false)}>
              Cancel
            </StyledButton>
            <StyledButton
              onClick={() => {
                if (selectedCourse !== null) {
                  handleCopyChapter(selectedCourse);
                }
              }}
            >
              Copy
            </StyledButton>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}
