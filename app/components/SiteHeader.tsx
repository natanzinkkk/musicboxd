"use client";

import { useState } from "react";
import Link from "next/link";
import SearchBar from "./SearchBar";

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[17px] w-[17px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

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

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[19px] w-[19px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M6 6 18 18" />
      <path d="M18 6 6 18" />
    </svg>
  ) : (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[19px] w-[19px]"
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
      className="h-[16px] w-[16px]"
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-[100] border-b border-[#292929] bg-[#121212]/96 backdrop-blur-2xl">
        <div className="mx-auto flex h-[62px] w-full max-w-[1288px] items-center px-4 sm:px-6">
          {/* LOGO */}

          <Link
            href="/"
            onClick={() => {
              setMobileOpen(false);
              setProfileOpen(false);
            }}
            className="group flex shrink-0 items-center gap-2"
          >
            <img
              src="/musicboxd-logo.png"
              alt="Musicboxd"
              className="h-8 w-8 object-contain transition-transform duration-200 group-hover:scale-105"
            />

            <span className="text-[17px] font-extrabold tracking-[-0.055em] text-white">
              MUSICBOXD
            </span>
          </Link>

          {/* DESKTOP SEARCH */}

          {!mobileOpen && (
            <div className="ml-8 hidden min-w-0 flex-1 md:block lg:ml-10">
              <div className="max-w-[520px]">
                <SearchBar />
              </div>
            </div>
          )}

          {/* DESKTOP NAV */}

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            <Link
              href="/musics"
              className="rounded-lg px-3 py-2 text-[11px] font-bold tracking-[0.08em] text-[#999] transition-colors hover:bg-[#1c1c1c] hover:text-white"
            >
              MUSICS
            </Link>

            <Link
              href="/lists"
              className="rounded-lg px-3 py-2 text-[11px] font-bold tracking-[0.08em] text-[#999] transition-colors hover:bg-[#1c1c1c] hover:text-white"
            >
              LISTS
            </Link>

            <Link
              href="/"
              className="ml-2 inline-flex h-8 items-center rounded-full bg-white px-4 text-[11px] font-bold !text-black transition-colors hover:bg-[#e5e5e5]"
             >
              + LOG
            </Link>

            {/* PROFILE */}

            <div className="relative ml-2">
              <button
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
                className="flex h-8 items-center gap-2 rounded-full border border-[#303030] bg-[#1d1d1d] px-2.5 text-[#aaa] transition-colors hover:border-[#444] hover:bg-[#242424] hover:text-white"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#303030] text-[9px] font-bold text-white">
                  N
                </span>

                <ChevronIcon open={profileOpen} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] w-[190px] overflow-hidden rounded-xl border border-[#303030] bg-[#181818] p-1.5 shadow-2xl">
                  <div className="border-b border-[#292929] px-3 py-2.5">
                    <p className="text-xs font-bold text-white">
                      natan
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#666]">
                      Musicboxd member
                    </p>
                  </div>

                  <ProfileMenuItem href="/" label="Home" />
                  <ProfileMenuItem href="/profile" label="Profile" />
                  <ProfileMenuItem href="/musics" label="Musics" />
                  <ProfileMenuItem href="/reviews" label="Reviews" />
                  <ProfileMenuItem
                    href="/want-to-hear"
                    label="Want to Hear"
                  />
                  <ProfileMenuItem href="/lists" label="Lists" />
                </div>
              )}
            </div>
          </nav>

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            onClick={() => {
              setMobileOpen((value) => !value);
              setProfileOpen(false);
            }}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded-full border border-[#303030] bg-[#1d1d1d] text-[#aaa] transition-colors hover:bg-[#252525] hover:text-white md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>

        {/* MOBILE SEARCH */}

        {!mobileOpen && (
          <div className="border-t border-[#202020] px-4 py-2.5 md:hidden">
            <SearchBar />
          </div>
        )}
      </header>

      {/* MOBILE MENU */}

      {mobileOpen && (
        <div className="fixed left-0 right-0 top-[62px] z-[90] max-h-[calc(100vh-62px)] overflow-y-auto border-b border-[#2a2a2a] bg-[#151515]/98 shadow-2xl backdrop-blur-2xl md:hidden">
          <nav className="mx-auto max-w-[1288px] px-4 py-2 pb-6">
            <div className="px-3 pb-2 pt-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#303030] text-[10px] font-bold text-white">
                  N
                </span>

                <div>
                  <p className="text-xs font-bold text-white">
                    natan
                  </p>

                  <p className="text-[10px] text-[#666]">
                    Musicboxd member
                  </p>
                </div>
              </div>
            </div>

            <div className="my-2 border-t border-[#292929]" />

            <MobileMenuItem
              href="/"
              label="Home"
              onClick={() => setMobileOpen(false)}
            />

            <MobileMenuItem
              href="/profile"
              label="Profile"
              onClick={() => setMobileOpen(false)}
            />

            <MobileMenuItem
              href="/musics"
              label="Musics"
              onClick={() => setMobileOpen(false)}
            />

            <MobileMenuItem
              href="/reviews"
              label="Reviews"
              onClick={() => setMobileOpen(false)}
            />

            <MobileMenuItem
              href="/want-to-hear"
              label="Want to Hear"
              onClick={() => setMobileOpen(false)}
            />

            <MobileMenuItem
              href="/lists"
              label="Lists"
              onClick={() => setMobileOpen(false)}
            />

            <div className="my-2 border-t border-[#292929]" />

            <MobileMenuItem
              href="/"
              label="+ Log"
              onClick={() => setMobileOpen(false)}
              strong
            />
          </nav>
        </div>
      )}
    </>
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
  onClick,
  strong = false,
}: {
  href: string;
  label: string;
  onClick: () => void;
  strong?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center justify-between rounded-lg px-3 py-3 text-xs transition-colors hover:bg-[#202020] ${
        strong
          ? "font-bold text-white"
          : "font-semibold text-[#aaa] hover:text-white"
      }`}
    >
      <span>{label}</span>

      <span className="text-[#555]">›</span>
    </Link>
  );
}