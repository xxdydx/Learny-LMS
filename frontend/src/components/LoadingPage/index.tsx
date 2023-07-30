"use client";
import { CircularProgress } from "@mui/material";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import createTheme from "@mui/material/styles/createTheme";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

const LoadingPage = () => {
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
  return (
    <div className="dark">
      <div className="dark:bg-bg h-screen flex items-center">
        <div className=" w-full">
          <div className="flex justify-center">
            <ThemeProvider theme={theme}>
              <CircularProgress />
            </ThemeProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
