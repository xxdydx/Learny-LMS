import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./provider";
import { useAuth } from "./hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingPage from "./components/LoadingPage";

export const metadata = {
  title: "LMS",
  description: "Generated by create next app",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
