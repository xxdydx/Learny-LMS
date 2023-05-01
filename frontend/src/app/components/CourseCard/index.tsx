"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Course } from "@/app/types";
import { CardHeader, ThemeProvider, createTheme } from "@mui/material";
import { Inter } from "next/font/google";
import { styled } from "@mui/material";
import CourseMenu from "../OptionsMenu/course";
import { useAppSelector } from "@/app/hooks";

interface Props {
  course: Course;
}
const inter = Inter({ subsets: ["latin"] });
const CourseCard = ({ course }: Props) => {
  const user = useAppSelector((state) => state.user);
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

  const StyledButton = styled(Button)({
    textTransform: "none",
  });

  if (course === undefined) {
    return null;
  }
  return (
    <ThemeProvider theme={theme}>
      <Card sx={{ minWidth: 280 }}>
        <CardHeader subheader="Course" action={<CourseMenu id={course.id} />} />

        <CardContent>
          <Typography variant="h5" fontWeight="bold" component="div">
            {course.title}
          </Typography>
          <Typography color="text.secondary">
            Teacher: {course.teacher?.name || user?.name}
          </Typography>
          <Typography variant="body2">
            <br />
          </Typography>
        </CardContent>
        <CardActions>
          <StyledButton size="small" href={`/courses/${course.id}`}>
            Open
          </StyledButton>
        </CardActions>
      </Card>
    </ThemeProvider>
  );
};

export default CourseCard;
