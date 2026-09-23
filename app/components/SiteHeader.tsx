"use client";

import { useState } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`h-3.5 w-3.5 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="pointer-events-none h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19c.9-3.1 3.1-4.8 6.5-4.8s5.6 1.7 6.5 4.8" />
    </svg>
  );
}

export default function SiteHeader() {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-[9999] border-b border-[#292929] bg-[#121212]">
      {/* desktop + mobile top bar */}

      <div className="mx-auto flex h-[62px] w-full max-w-[1080px] items-center px-4 sm:px-6">
        {/* logo */}

        <Link
          href="/"
          onClick={() => setProfileOpen(false)}
          className="flex shrink-0 items-center gap-2"
        >
          <img
            src="/musicboxd-logo.png"
            alt="musicboxd"
            className="h-8 w-8 object-contain"
          />

          <span className="text-[17px] font-extrabold tracking-[-0.055em] text-white">
            musicboxd
          </span>
        </Link>

        {/* desktop search */}

        <div className="ml-8 hidden min-w-0 flex-1 md:block lg:ml-10">
          <div className="max-w-[500px]">
            <SearchBar />
          </div>
        </div>

        {/* desktop navigation */}

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          <Link
            href="/musics"
            className="rounded-lg px-3 py-2 text-[11px] font-bold tracking-[0.08em] text-[#999] transition-colors hover:bg-[#1c1c1c] hover:text-white"
          >
            musics
          </Link>

          <Link
            href="/lists"
            className="rounded-lg px-3 py-2 text-[11px] font-bold tracking-[0.08em] text-[#999] transition-colors hover:bg-[#1c1c1c] hover:text-white"
          >
            lists
          </Link>

          <Link
            href="/"
            className="ml-2 inline-flex h-8 items-center rounded-full bg-white px-4 text-[11px] font-bold !text-black transition-colors hover:bg-[#e5e5e5]"
          >
            + log
          </Link>

          {/* profile */}

          <div className="relative ml-2">
            <button
              type="button"
              onClick={() => setProfileOpen((value) => !value)}
              aria-label="open profile menu"
              aria-expanded={profileOpen}
              className="flex h-8 items-center gap-2 rounded-full border border-[#303030] bg-[#1d1d1d] px-2.5 text-[#aaa] transition-colors hover:border-[#444] hover:bg-[#242424] hover:text-white"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#303030] text-[9px] font-bold text-white">
                n
              </span>

              <ChevronIcon open={profileOpen} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-[10000] w-[190px] overflow-hidden rounded-xl border border-[#303030] bg-[#181818] p-1.5 shadow-2xl">
                <div className="border-b border-[#292929] px-3 py-2.5">
                  <p className="text-xs font-bold text-white">natan</p>

                  <p className="mt-0.5 text-[10px] text-[#666]">
                    musicboxd member
                  </p>
                </div>

                <ProfileMenuItem href="/" label="home" />
                <ProfileMenuItem href="/profile" label="profile" />
                <ProfileMenuItem href="/musics" label="musics" />
                <ProfileMenuItem href="/reviews" label="reviews" />

                <ProfileMenuItem
                  href="/want-to-hear"
                  label="want to hear"
                />

                <ProfileMenuItem href="/lists" label="lists" />
              </div>
            )}
          </div>
        </nav>

        {/* MOBILE MENU */}

        <details className="group relative ml-auto md:hidden">
          <summary
            aria-label="open menu"
            className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-[#303030] bg-[#1d1d1d] text-[#aaa] active:bg-[#303030] [&::-webkit-details-marker]:hidden"
          >
            <MenuIcon />
          </summary>

          {/* mobile menu */}

          <div className="absolute right-[-16px] top-[61px] z-[10000] w-screen border-b border-[#2a2a2a] bg-[#151515] shadow-2xl">
            <nav className="mx-auto w-full max-w-[1080px] px-5 pb-7 pt-5">
              {/* user */}

              <div className="px-1 pb-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#303030] text-xs font-bold text-white">
                    n
                  </span>

                  <div>
                    <p className="text-sm font-bold text-white">
                      natan
                    </p>

                    <p className="mt-0.5 text-[11px] text-[#666]">
                      musicboxd member
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#292929]" />

              {/* navigation */}

              <div className="py-2">
                <MobileMenuItem href="/" label="home" />

                <MobileMenuItem
                  href="/profile"
                  label="profile"
                />

                <MobileMenuItem
                  href="/musics"
                  label="musics"
                />

                <MobileMenuItem
                  href="/reviews"
                  label="reviews"
                />

                <MobileMenuItem
                  href="/want-to-hear"
                  label="want to hear"
                />

                <MobileMenuItem
                  href="/lists"
                  label="lists"
                />
              </div>

              <div className="border-t border-[#292929]" />

              <div className="py-2">
                <MobileMenuItem
                  href="/"
                  label="+ log"
                  strong
                />
              </div>
            </nav>
          </div>
        </details>
      </div>

      {/* mobile search */}

      <div className="border-t border-[#202020] bg-[#121212] px-4 py-2.5 md:hidden">
        <SearchBar />
      </div>
    </header>
  );
}

function ProfileMenuItem({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#aaa] transition-colors hover:bg-[#242424] hover:text-white"
    >
      <span className="flex h-4 w-4 items-center justify-center text-[#777]">
        <ProfileIcon />
      </span>

      {label}
    </Link>
  );
}

function MobileMenuItem({
  href,
  label,
  strong = false,
}: {
  href: string;
  label: string;
  strong?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex min-h-[52px] items-center justify-between px-1 text-[15px] transition-colors ${
        strong
          ? "font-bold text-white"
          : "font-semibold text-[#b0b0b0] hover:text-white"
      }`}
    >
      <span>{label}</span>

      <span className="text-lg leading-none text-[#555]">
        ›
      </span>
    </Link>
  );
}