"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "./components/HomePageScreenshots/Components/header";
import Hero from "./components/HomePageScreenshots/Components/hero";
import Features from "./components/HomePageScreenshots/Components/features";
import CTA from "./components/HomePageScreenshots/Components/cta";
import Footer from "./components/HomePageScreenshots/Components/footer";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});
export default function IndexPage() {
  return (
    <ThemeProvider theme={theme}>
      <div className="">
        <header>
          <Header />
        </header>
        <Hero />
        <Features />
        <CTA />
        <Footer />
      </div>
    </ThemeProvider>
  );
}
