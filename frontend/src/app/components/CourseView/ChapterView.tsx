"use client";

import * as React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";

import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";

import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { createTheme, ThemeProvider } from "@mui/material";
import { Inter } from "next/font/google";
import Divider from "@mui/material/Divider";
import { Chapter, Section, File } from "../../types";
import ChapterMenu from "../OptionsMenu/chapter";

const inter = Inter({ subsets: ["latin"] });

export default function ChapterView({ chapter }: { chapter: Chapter }) {
  const theme = createTheme({
    typography: {
      fontFamily: inter.style.fontFamily,
    },
    palette: {
      mode: "dark",
    },
  });
  console.log(chapter);

  // Component for each file
  const IndivListFile = ({ file }: { file: File }) => {
    return (
      <List component="div" disablePadding>
        <Divider light />
        <ListItemButton sx={{ pl: 4 }}>
          <ListItemText primary={file.name} className="dark:text-text" />
        </ListItemButton>
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
        <ListItemButton onClick={handleClick}>
          <ListItemText primary={section.title} className="dark:text-text" />

          {section.files.length > 0 && open ? (
            <ExpandLess className="dark:text-text" />
          ) : (
            <ExpandMore className="dark:text-text" />
          )}
        </ListItemButton>

        <Collapse in={open} timeout="auto" unmountOnExit>
          {section.files.map((file) => (
            <IndivListFile key={file.id} file={file} />
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
              {chapter.title}
              <ChapterMenu id={chapter.id} />
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
