import { Link, List, ListItem } from "@mui/material";
import { useState } from "react";

const chapters = [
  {
    id: 0,
    name: "Price Mechanism",
    quantity: 2,
  },
  {
    id: 1,
    name: "Market Failure",
    quantity: 1,
  },
  {
    id: 2,
    name: "Firms & Decisions",
    quantity: 1,
  },
  {
    id: 3,
    name: "Globalisation",
    quantity: 2,
  },
];
/**
 * MenuInteractiveColumn :
 * @description
 */
const Contents = () => {
  const [selected, setSelected] = useState<string>("");
  const handleClick = (id: string) => {
    setSelected(id);
  };
  return (
    <div className="w-fit hidden md:flex md: ml-4 lg:ml-6">
      <List>
        {chapters.map((value) => {
          return (
            <ListItem key={value.id}>
              <Link
                href={`#${value.name}`}
                underline="none"
                className={
                  selected === value.name
                    ? "text-white font-bold"
                    : "dark:text-slate-400 text-slate-700"
                }
                onClick={() => handleClick(value.name)}
              >
                {value.name}
              </Link>
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

export default Contents;
