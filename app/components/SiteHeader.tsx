"use client";

import { useState } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-[100] h-[72px] border-b border-[#2a2a2a] bg-[#121212]/95 backdrop-blur-xl">
        <div className="flex h-full items-center px-5 lg:px-7">
          <Link
            href="/"
            className="flex w-[220px] shrink-0 items-center gap-3"
          >
            <img
              src="/musicboxd-logo.png"
              alt="Musicboxd"
              className="h-10 w-10 object-contain"
            />

            <span className="text-xl font-black tracking-tight text-white">
              MUSICBOXD
            </span>
          </Link>

          <div className="hidden flex-1 items-center justify-center md:flex">
            <SearchBar />
          </div>

          <nav className="ml-auto hidden items-center gap-7 md:flex">
            <Link
              href="/"
              className="text-sm font-bold text-[#b3b3b3] transition hover:text-white"
            >
              Features
            </Link>

            <Link
              href="/"
              className="text-sm font-bold text-[#b3b3b3] transition hover:text-white"
            >
              Explore
            </Link>

            <Link
              href="/"
              className="text-sm font-bold text-[#b3b3b3] transition hover:text-white"
            >
              Rank
            </Link>

            <button
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#b3b3b3] transition hover:bg-[#212121] hover:text-white"
              aria-label="Toggle theme"
            >
              ☾
            </button>

            <button
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#212121] text-sm font-bold text-white"
              aria-label="Profile"
            >
              N
            </button>
          </nav>

          <button
            onClick={() => setMobileOpen((value) => !value)}
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#212121] text-xl text-white md:hidden"
            aria-label="Open menu"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>

        <div className="px-5 pb-3 md:hidden">
          <SearchBar />
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed left-0 right-0 top-[125px] z-[90] border-b border-[#2a2a2a] bg-[#181818] p-5 md:hidden">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-bold text-white"
            >
              Features
            </Link>

            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-bold text-white"
            >
              Explore
            </Link>

            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="text-sm font-bold text-white"
            >
              Rank
            </Link>
          </div>
        </div>
      )}
    </>
  );
}