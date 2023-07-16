"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import Dropdown from "./dropdown";
import MobileMenu from "./mobile-menu";
import { Typography } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";

export default function Header() {
  const [top, setTop] = useState<boolean>(true);

  // detect whether user has scrolled the page down by 10px
  const scrollHandler = () => {
    window.pageYOffset > 10 ? setTop(false) : setTop(true);
  };

  useEffect(() => {
    scrollHandler();
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [top]);

  return (
    <header
      className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${
        !top ? "bg-bg backdrop-blur-sm shadow-lg" : "bg-black"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="mr-4">
            <div className="flex flex-row">
              <SchoolIcon
                sx={{
                  display: { xs: "none", md: "flex" },
                  fontSize: "h6.fontSize",
                  color: "white",
                  mt: 0.5,
                  mr: 1,
                }}
              />
              <h1 className="text-xl text-white font-extrabold">Learny LMS</h1>
            </div>
          </div>

          <nav className="hidden md:flex md:grow">
            <ul className="flex grow justify-end flex-wrap items-center">
              <li>
                <Link
                  href="/login"
                  className="font-medium text-text hover:text-gray-900 px-5 flex items-center transition duration-150 ease-in-out"
                >
                  Sign in
                </Link>
              </li>
              <li>
                <Link
                  href="/#"
                  className="font-medium text-text hover:text-gray-900 px-5 flex items-center transition duration-150 ease-in-out"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </nav>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
