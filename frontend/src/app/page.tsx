"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "@/components/HomePage/Components/header";
import Hero from "@/components/HomePage/Components/hero";
import Features from "@/components/HomePage/Components/features";
import CTA from "@/components/HomePage/Components/cta";
import Footer from "@/components/HomePage/Components/footer";

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
