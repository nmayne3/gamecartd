"use client";

import "@/app/styles/navbar.css";
import { usePathname } from "next/navigation.js";
import Link from "next/link";
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
    <div className="h-full w-full font-medium z-50 navbar group pointer-events-auto pt-1">
      <div className="h-full w-full mx-auto max-w-screen-xl flex items-center group justify-between px-4 sm:px-8 md:px-12 lg:px-20 xl:px-36">
        {/* Home Button / Logo */}
        <div className="font-bold z-50">
          <Link
            href={"/"}
            className="text-2xl text-white rounded-md p-1 flex items-center justify-center"
          >
            <span className="px-1"> Gamecartd</span>
          </Link>
        </div>
        {/* Website Directory */}
        <div className="hidden md:flex flex-row items-center justify-center gap-4 header-text z-50">
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
          <div className="search-bar z-10 w-32 h-6 flex flex-row place-items-center rounded-full text-trimary bg-opacity-25 pointer-events-none bg-header-light-grey active:bg-white  focus-within:bg-white group-hover:bg-opacity-100">
            <input
              name="SearchField"
              type="text"
              id="search"
              className="w-full h-full pl-3 outline-none bg-transparent rounded-full group/search pointer-events-auto active:bg-white peer"
            />
            <FaMagnifyingGlass className="mr-2.5 ml-1 scale-[140%] fill-header-light-grey group-hover:fill-trimary peer-focus:fill-trimary ">
              {" "}
            </FaMagnifyingGlass>
          </div>
        </div>

        {/* Links to Socials */}
        {/* Mobile Menu */}
        <div className="md:hidden">
          {/* MENU Button */}
          <button
            className="w-10 h-6 p-0.5 flex flex-col justify-between relative z-50"
            onClick={() => setOpen(!open)}
          >
            <div className="w-8 h-1 bg-primary rounded-md"></div>
            <div className="w-8 h-1 bg-primary rounded-md"></div>
            <div className="w-8 h-1 bg-primary rounded-md"></div>
          </button>
          {/* MENU LIST */}
          {open && (
            <div className="absolute top-0 left-0 w-full h-full bg-secondary text-primary flex flex-col items-center justify-center gap-8">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
