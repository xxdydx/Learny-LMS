"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "@/components/HomePage/Components/header";
import { Pricing } from "@/components/HomePage/Components/pricing";
import Footer from "@/components/HomePage/Components/footer";

const theme = createTheme({
  palette: {}
});

export default function PricingPage() {
  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen">
        <header>
          <Header />
        </header>
        <main className="pt-20">
          <Pricing />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
