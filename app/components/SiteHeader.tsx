"use client";

import { useState } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-[100] border-b border-[#292929] bg-[#121212]/95 backdrop-blur-2xl">
        <div className="mx-auto flex h-[68px] w-full max-w-[1480px] items-center px-4 sm:px-6 lg:px-8">

          {/* LOGO */}

          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5"
          >
            <img
              src="/musicboxd-logo.png"
              alt="Musicboxd"
              className="h-9 w-9 object-contain transition-transform duration-200 group-hover:scale-105"
            />

            <span className="text-[19px] font-black tracking-[-0.055em] text-white">
              MUSICBOXD
            </span>
          </Link>

          {/* SEARCH */}

          <div className="ml-7 hidden min-w-0 flex-1 md:block lg:ml-12">
            <div className="max-w-[610px]">
              <SearchBar />
            </div>
          </div>

          {/* DESKTOP NAV */}

          <nav className="ml-auto hidden items-center gap-6 md:flex lg:gap-8">

            <Link
              href="/"
              className="relative py-2 text-[12px] font-bold tracking-[0.08em] text-[#a7a7a7] transition-colors hover:text-white"
            >
              MUSICS
            </Link>

            <Link
              href="/lists"
              className="relative py-2 text-[12px] font-bold tracking-[0.08em] text-[#a7a7a7] transition-colors hover:text-white"
            >
              LISTS
            </Link>

            <Link
              href="/"
              className="rounded-full border border-[#383838] px-4 py-2 text-[12px] font-bold tracking-[0.04em] text-white transition-colors hover:border-[#555] hover:bg-[#212121]"
            >
              + LOG
            </Link>

            <button
              type="button"
              aria-label="Profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#242424] text-[12px] font-bold text-white transition-all duration-200 hover:bg-[#303030] hover:ring-2 hover:ring-[#1db954]/30"
            >
              N
            </button>
          </nav>

          {/* MOBILE BUTTON */}

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#222] text-lg text-white transition-colors hover:bg-[#303030] md:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>

        {/* MOBILE SEARCH */}

        <div className="border-t border-[#202020] px-4 py-3 md:hidden">
          <SearchBar />
        </div>
      </header>

      {/* MOBILE MENU */}

      {mobileOpen && (
        <div className="fixed left-0 right-0 top-[113px] z-[90] border-b border-[#2a2a2a] bg-[#151515]/98 shadow-2xl backdrop-blur-2xl md:hidden">
          <nav className="mx-auto flex max-w-[1480px] flex-col px-5 py-3">

            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="border-b border-[#292929] py-4 text-xs font-bold tracking-[0.1em] text-white"
            >
              MUSICS
            </Link>

            <Link
              href="/lists"
              onClick={() => setMobileOpen(false)}
              className="border-b border-[#292929] py-4 text-xs font-bold tracking-[0.1em] text-white"
            >
              LISTS
            </Link>

            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="py-4 text-xs font-bold tracking-[0.1em] text-white"
            >
              + LOG
            </Link>

          </nav>
        </div>
      )}
    </>
  );
}