"use client";

import "@/app/styles/navbar.css";
import { usePathname } from "next/navigation.js";
import Link from "next/link";
import Searchbar from "./searchbar";
import { useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import { DropdownTab } from "./dropdown";

const links = [
  { url: "/games", title: "Games" },
  { url: "/lists", title: "Lists" },
  { url: "/members", title: "Members" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathName = usePathname();
  const session = useSession();
  return (
    <header className="h-full w-full font-medium z-50 navbar group pointer-events-auto pt-1">
      <div className="h-full w-full mx-auto max-w-screen-xl flex items-center group justify-between px-4 sm:px-8 md:px-12 lg:px-20 xl:px-36">
        {/* Home Button / Logo */}
        <h1 className="font-bold font-sans z-50">
          <Link
            href={"/"}
            className="text-2xl text-white rounded-md p-1 flex items-center justify-center"
          >
            <span className="px-1"> Gamecartd</span>
          </Link>
        </h1>
        {/* Website Directory */}
        <nav className="hidden md:flex flex-row items-center justify-center gap-4 header-text z-50 uppercase">
          {/** Login Section */}
          {session.status != "authenticated" && (
            <Link href={"/login"} className="hover:text-white">
              {" "}
              Sign In{" "}
            </Link>
          )}
          {session.status != "authenticated" && (
            <div className="hover:text-white"> Create Account </div>
          )}
          {/** Profile Section */}
          {session.status == "authenticated" && (
            <DropdownTab
              name={session.data.user?.name}
              icon_src={session.data.user?.image}
            >
              <li className="dropdown">
                {" "}
                <Link className="dropdown-link" href={`/`}>
                  {" "}
                  Home{" "}
                </Link>
              </li>
              <li className="dropdown">
                <Link
                  href={`/user/${session?.data.user.slug}`}
                  className="dropdown-link "
                >
                  {" "}
                  Profile{" "}
                </Link>
              </li>
              <li className="hover:bg-menu-primary hover:text-white">
                {" "}
                <Link
                  className="dropdown-link"
                  href={`/user/${session?.data.user.slug}/games`}
                >
                  {" "}
                  Games{" "}
                </Link>
              </li>
              <li className="hover:bg-menu-primary hover:text-white">
                {" "}
                <Link
                  href={`/user/${session?.data.user.slug}/backlog`}
                  className="dropdown-link "
                >
                  {" "}
                  Backlog{" "}
                </Link>
              </li>
              <li className="hover:bg-menu-primary hover:text-white">
                {" "}
                <Link
                  href={`/user/${session?.data.user.slug}/lists`}
                  className="dropdown-link "
                >
                  {" "}
                  Lists{" "}
                </Link>
              </li>
              <li className="h-2 content-center m-auto">
                {" "}
                <hr className="border-menu-primary" />{" "}
              </li>
              <li className="dropdown">
                <button
                  className=" dropdown-link w-full text-left"
                  onClick={() => signOut()}
                >
                  {" "}
                  Log Out{" "}
                </button>
              </li>
            </DropdownTab>
          )}
          {/** Directory Section */}
          {links.map((link) => (
            <Link
              href={link.url}
              key={link.title}
              className={`${
                pathName === link.url && "text-white"
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
