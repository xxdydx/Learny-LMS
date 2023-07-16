"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "./components/header";
import Hero from "./components/hero";
import Features from "./components/features";
import CTA from "./components/cta";
import Footer from "./components/footer";

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
