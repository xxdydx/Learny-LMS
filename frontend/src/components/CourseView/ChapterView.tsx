"use client";

import * as React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";

import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import AddIcon from "@mui/icons-material/Add";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { createTheme, ThemeProvider } from "@mui/material";
import { Inter } from "next/font/google";
import Divider from "@mui/material/Divider";
import { Chapter, Section, File } from "../../types";
import ChapterMenu from "../OptionsMenu/chapter";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton/IconButton";
import { useAppSelector } from "@/hooks";

import SectionMenu from "../OptionsMenu/section";
import Typography from "@mui/material/Typography/Typography";
import { link } from "fs";
import FileMenu from "../OptionsMenu/file";
import PushPinIcon from "@mui/icons-material/PushPin";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import { Tooltip } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Assignment } from "../../types";
import AssignmentMenu from "../OptionsMenu/assignment";

const inter = Inter({ subsets: ["latin"] });

export default function ChapterView({ chapter }: { chapter: Chapter }) {
  const user = useAppSelector((state) => state.user);
  const theme = createTheme({
    typography: {
      fontFamily: inter.style.fontFamily,
    },
    palette: {
      mode: "dark",
    },
  });

  // Component for each file
  const IndivListFile = ({ file }: { file: File }) => {
    // to check if file should be invisible for student, based on visible date set for each file
    if (
      user?.role === "student" &&
      file?.visibledate > new Date().toISOString()
    ) {
      return null;
    }
    return (
      <List component="div" disablePadding>
        <Divider light />
        <div className="flex justify mr-4">
          <ListItemButton sx={{ pl: 4 }} onClick={() => window.open(file.link)}>
            <ListItemText primary={file?.name} className="dark:text-text" />
            {file?.visibledate > new Date().toISOString() && (
              <div className="mr-2">
                <Tooltip
                  title={`Scheduled on ${new Date(file.visibledate)
                    .toLocaleString("en-GB", {
                      timeZone: "Asia/Singapore",
                    })
                    .slice(0, -3)}`}
                  placement="top"
                >
                  <WatchLaterIcon sx={{ color: "white" }} />
                </Tooltip>
              </div>
            )}
            <Tooltip title="File" placement="top">
              <AttachFileIcon sx={{ color: "white" }} />
            </Tooltip>
          </ListItemButton>
          {user?.role === "teacher" && <FileMenu id={file.id} file={file} />}
        </div>
      </List>
    );
  };

  const IndivListAssignment = ({ assignment }: { assignment: Assignment }) => {
    // to check if file should be invisible for student, based on visible date set for each file
    if (
      user?.role === "student" &&
      assignment?.visibledate > new Date().toISOString()
    ) {
      return null;
    }
    return (
      <List component="div" disablePadding>
        <Divider light />
        <div className="flex justify mr-4">
          <ListItemButton
            sx={{ pl: 4 }}
            onClick={() => {
              window.location.href = `/assignments/${assignment.id}`;
            }}
          >
            <ListItemText
              primary={assignment.name}
              className="dark:text-text"
            />
            {assignment?.visibledate > new Date().toISOString() && (
              <div className="mr-2">
                <Tooltip
                  title={`Scheduled on ${new Date(assignment.visibledate)
                    .toLocaleString("en-GB", {
                      timeZone: "Asia/Singapore",
                    })
                    .slice(0, -3)}`}
                  placement="top"
                >
                  <WatchLaterIcon sx={{ color: "white" }} />
                </Tooltip>
              </div>
            )}
            <Tooltip title="Assignment" placement="top">
              <AssignmentIcon sx={{ color: "white" }} />
            </Tooltip>
          </ListItemButton>

          {user?.role === "teacher" && (
            <AssignmentMenu id={assignment.id} assignment={assignment} />
          )}
        </div>
      </List>
    );
  };

  // Component for each section
  const IndivListItem = ({ section }: { section: Section }) => {
    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
      setOpen(!open);
    };

    return (
      <>
        <Divider light />
        <div className="flex justify mr-4">
          <ListItemButton onClick={handleClick}>
            <ListItemText
              disableTypography
              primary={
                <Typography style={{ color: "#fff" }} component="div">
                  {section.title}
                </Typography>
              }
            />

            {user?.role !== "teacher" && (
              <>
                {section.files.length > 0 && open ? (
                  <ExpandLess className="dark:text-text" />
                ) : (
                  <ExpandMore className="dark:text-text" />
                )}
              </>
            )}
          </ListItemButton>
          {user?.role === "teacher" && (
            <SectionMenu id={section.id} title={section.title} />
          )}
        </div>

        <Collapse in={open} timeout="auto" unmountOnExit>
          {section.files.map((file) => (
            <IndivListFile key={file.id} file={file} />
          ))}
          {section.assignments.map((assignment) => (
            <IndivListAssignment key={assignment.id} assignment={assignment} />
          ))}
        </Collapse>
      </>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <List
        className="w-full lg:max-w-6xl"
        sx={{ bgcolor: "#242527", mb: "3rem", borderRadius: "1.25rem" }}
        id={chapter.title}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            sx={{
              py: 1,
              bgcolor: "#242527",
              fontWeight: "600",
              color: "#fec006",
              fontSize: 20,
              borderRadius: "1.25rem",
            }}
          >
            <div className="flex justify-between">
              <div>
                {chapter.pinned === true && <PushPinIcon />} {chapter.title}
              </div>

              {user?.role === "teacher" && (
                <ChapterMenu id={chapter.id} chapter={chapter} />
              )}
            </div>
          </ListSubheader>
        }
      >
        {chapter.sections.map((section) => (
          <IndivListItem key={section.id} section={section} />
        ))}
      </List>
    </ThemeProvider>
  );
}
