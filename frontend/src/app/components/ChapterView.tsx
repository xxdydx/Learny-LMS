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

const inter = Inter({ subsets: ["latin"] });

export default function ChapterView({ chapter }: { chapter: string }) {
  const theme = createTheme({
    typography: {
      fontFamily: inter.style.fontFamily,
    },
    palette: {
      mode: "dark",
    },
  });

  const IndivListItem = ({
    name,
    subitems,
  }: {
    name: string;
    subitems: string;
  }) => {
    const [open, setOpen] = React.useState(false);
    const handleClick = () => {
      setOpen(!open);
    };
    return (
      <>
        <Divider light />
        <ListItemButton onClick={handleClick}>
          <ListItemText primary={name} className="dark:text-text" />

          {open ? (
            <ExpandLess className="dark:text-text" />
          ) : (
            <ExpandMore className="dark:text-text" />
          )}
        </ListItemButton>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Divider light />
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemText primary={subitems} className="dark:text-text" />
            </ListItemButton>
          </List>
        </Collapse>
      </>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <List
        className="bg-[#182c44] w-full lg:max-w-6xl mb-12"
        id={chapter}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader
            component="div"
            id="nested-list-subheader"
            className="py-4 bg-[#182c44] font-bold text-xl dark:text-sky-400"
          >
            {chapter}
          </ListSubheader>
        }
      >
        <IndivListItem name="Tutorials" subitems="Tutorial 1" />

        <IndivListItem name="Assignments" subitems="Assignment 2" />
      </List>
    </ThemeProvider>
  );
}
