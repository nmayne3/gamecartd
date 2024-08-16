"use client";

import "@/app/styles/navbar.css";
import { usePathname } from "next/navigation.js";
import Link from "next/link";
import Searchbar from "./searchbar";
import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";

const links = [
  { url: "/games", title: "Games" },
  { url: "/lists", title: "Lists" },
  { url: "/members", title: "Members" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathName = usePathname();
  return (
    <header className="h-full w-full font-medium z-50 navbar group pointer-events-auto pt-1">
      <div className="h-full w-full mx-auto max-w-screen-xl flex items-center group justify-between px-4 sm:px-8 md:px-12 lg:px-20 xl:px-36">
        {/* Home Button / Logo */}
        <h1 className="font-bold z-50">
          <Link
            href={"/"}
            className="text-2xl text-white rounded-md p-1 flex items-center justify-center"
          >
            <span className="px-1"> Gamecartd</span>
          </Link>
        </h1>
        {/* Website Directory */}
        <nav className="hidden md:flex flex-row items-center justify-center gap-4 header-text z-50">
          <div className="hover:text-white"> Sign In </div>
          <div className="hover:text-white"> Create Account </div>
          {links.map((link) => (
            <Link
              href={link.url}
              key={link.title}
              className={`${
                pathName === link.url &&
                "text-white underline underline-offset-4"
              } hover:text-white`}
            >
              {link.title}
            </Link>
          ))}
          {/** Search bar */}
          <Searchbar />
        </nav>

        {/* Links to Socials */}
        {/* Mobile Menu */}
        <div className="md:hidden">
          {/* MENU Button */}
          <button
            className="w-10 h-6 p-0.5 flex flex-col justify-between relative z-50"
            onClick={() => setOpen(!open)}
          >
            <div className="w-8 h-1 bg-white rounded-md"></div>
            <div className="w-8 h-1 bg-white rounded-md"></div>
            <div className="w-8 h-1 bg-white rounded-md"></div>
          </button>
          {/* MENU LIST */}
          {open && (
            <nav
              id="Mobile Nav Listing"
              className="fixed top-0 h-screen left-0 z-40 w-full bg-secondary text-primary flex flex-col items-center justify-center gap-8"
            >
              {links.map((link) => (
                <Link
                  href={link.url}
                  key={link.title}
                  className="hover:text-accent z-50"
                  onClick={() => setOpen(false)}
                >
                  {link.title}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
