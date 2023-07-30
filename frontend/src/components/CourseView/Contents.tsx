"use client";
import { Link, List, ListItem } from "@mui/material";
import { useState } from "react";
import { Course } from "@/types";

/**
 * MenuInteractiveColumn :
 * @description
 */

interface Props {
  course: Course;
}
const Contents = ({ course }: Props) => {
  const [selected, setSelected] = useState<string>("");
  const handleClick = (id: string) => {
    setSelected(id);
  };
  return (
    <div>
      <List>
        {course.chapters.map((value) => {
          return (
            <ListItem key={value.id}>
              <Link
                href={`#${value.title}`}
                underline="none"
                className={
                  selected === value.title
                    ? "text-white font-bold"
                    : "dark:text-slate-400 text-slate-700"
                }
                onClick={() => handleClick(value.title)}
              >
                {value.title}
              </Link>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default Contents;
