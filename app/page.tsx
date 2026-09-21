"use client";

import { useState } from "react";
import SearchBar from "./components/SearchBar";

const trendingAlbums = [
  {
    title: "Blonde",
    artist: "Frank Ocean",
    year: "2016",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=90",
  },
  {
    title: "GNX",
    artist: "Kendrick Lamar",
    year: "2024",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=90",
  },
  {
    title: "SOS",
    artist: "SZA",
    year: "2022",
    rating: "4.6",
    image:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=800&q=90",
  },
  {
    title: "UTOPIA",
    artist: "Travis Scott",
    year: "2023",
    rating: "4.5",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=90",
  },
];

const recentlyRated = [
  {
    title: "Channel Orange",
    artist: "Frank Ocean",
    rating: "5.0",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=90",
  },
  {
    title: "Blonde",
    artist: "Frank Ocean",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&q=90",
  },
  {
    title: "To Pimp a Butterfly",
    artist: "Kendrick Lamar",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=600&q=90",
  },
  {
    title: "IGOR",
    artist: "Tyler, The Creator",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=90",
  },
];

const popularLists = [
  {
    title: "Albums everyone should hear",
    creator: "musicboxd",
    count: "128 albums",
  },
  {
    title: "Late night essentials",
    creator: "musicboxd",
    count: "64 albums",
  },
  {
    title: "Modern classics",
    creator: "musicboxd",
    count: "93 albums",
  },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* HEADER */}

      <header className="fixed left-0 right-0 top-0 z-50 h-[72px] border-b border-[#212121] bg-[#121212]/95 backdrop-blur-xl">
        <div className="flex h-full items-center px-5 md:px-7">
          {/* LOGO */}

          <a
            href="/"
            className="flex w-[265px] shrink-0 items-center gap-3"
          >
            <img
              src="/musicboxd-logo.png"
              alt="Musicboxd"
              className="h-10 w-11 object-contain"
            />

            <span className="text-xl font-bold tracking-tight">
              musicboxd
            </span>
          </a>

          {/* SEARCH */}

          <div className="hidden flex-1 md:flex">
            <SearchBar />
          </div>

          {/* DESKTOP NAV */}

          <nav className="ml-auto hidden items-center gap-7 lg:flex">
            <a
              href="#features"
              className="text-sm font-semibold text-[#b3b3b3] transition-colors hover:text-white"
            >
              Features
            </a>

            <a
              href="#explore"
              className="text-sm font-semibold text-[#b3b3b3] transition-colors hover:text-white"
            >
              Explore
            </a>

            <a
              href="#rank"
              className="text-sm font-semibold text-[#b3b3b3] transition-colors hover:text-white"
            >
              Rank
            </a>

            <button className="flex h-9 w-9 items-center justify-center rounded-full text-[#b3b3b3] transition-colors hover:bg-[#212121] hover:text-white">
              ☾
            </button>

            <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#212121] text-sm font-bold text-white">
              U
            </button>
          </nav>

          {/* MOBILE MENU */}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#212121] text-xl lg:hidden"
          >
            ☰
          </button>
        </div>
      </header>

      {/* MOBILE NAV */}

      {mobileMenuOpen && (
        <div className="fixed left-0 right-0 top-[72px] z-40 border-b border-[#212121] bg-[#121212] p-5 lg:hidden">
          <div className="mb-5">
            <SearchBar />
          </div>

          <div className="flex flex-col gap-1">
            <MobileNav
              label="Home"
              href="#"
              onClick={() => setMobileMenuOpen(false)}
            />

            <MobileNav
              label="Explore"
              href="#explore"
              onClick={() => setMobileMenuOpen(false)}
            />

            <MobileNav
              label="Rank"
              href="#rank"
              onClick={() => setMobileMenuOpen(false)}
            />

            <MobileNav
              label="Lists"
              href="#lists"
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* SIDEBAR */}

      <aside className="fixed bottom-0 left-0 top-[72px] hidden w-[265px] border-r border-[#212121] bg-[#121212] p-5 md:block">
        <div className="flex h-full flex-col">
          <div className="space-y-1">
            <SidebarItem
              icon="⌂"
              label="Home"
              active
            />

            <SidebarItem
              icon="⌕"
              label="Explore"
            />

            <SidebarItem
              icon="↗"
              label="Rank"
            />

            <SidebarItem
              icon="▤"
              label="Lists"
            />

            <SidebarItem
              icon="◷"
              label="Diary"
            />

            <SidebarItem
              icon="◎"
              label="Profile"
            />
          </div>

          <div className="mt-9">
            <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#535353]">
              Recently Played
            </p>

            <div className="space-y-3">
              <MiniAlbum
                image={trendingAlbums[0].image}
                title="Blonde"
                artist="Frank Ocean"
              />

              <MiniAlbum
                image={trendingAlbums[1].image}
                title="GNX"
                artist="Kendrick Lamar"
              />

              <MiniAlbum
                image={trendingAlbums[2].image}
                title="SOS"
                artist="SZA"
              />
            </div>
          </div>

          {/* MINI PLAYER */}

          <div className="mt-auto rounded-2xl bg-[#212121] p-4">
            <div className="flex items-center gap-3">
              <img
                src={trendingAlbums[0].image}
                alt=""
                className="h-11 w-11 rounded-lg object-cover"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold">
                  Blonde
                </p>

                <p className="truncate text-[11px] text-[#b3b3b3]">
                  Frank Ocean
                </p>
              </div>

              <button className="text-lg text-[#1db954]">
                ▶
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}

      <main className="pt-[72px] md:ml-[265px]">
        {/* HERO */}

        <section className="relative overflow-hidden border-b border-[#212121]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(29,185,84,0.16),transparent_35%)]" />

          <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28">
            <div className="max-w-3xl">
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.3em] text-[#1db954]">
                YOUR MUSIC. YOUR HISTORY.
              </p>

              <h1 className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
                Your Music
                <br />
                Journey Starts Here.
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-7 text-[#b3b3b3] md:text-lg">
                Rate albums, write reviews, build lists,
                discover new music and keep track of
                everything you&apos;ve listened to.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href="#explore"
                  className="rounded-full bg-[#1db954] px-7 py-3.5 text-sm font-bold text-black transition-transform hover:scale-105"
                >
                  Explore Albums
                </a>

                <button className="rounded-full border border-[#535353] px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#212121]">
                  Album Bracket
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* TRENDING */}

        <section
          id="explore"
          className="mx-auto max-w-7xl px-6 py-14 md:px-10"
        >
          <SectionTitle
            eyebrow="DISCOVER"
            title="Trending Albums"
            action="View all"
          />

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {trendingAlbums.map((album) => (
              <AlbumCard
                key={album.title}
                {...album}
              />
            ))}
          </div>
        </section>

        {/* RECENTLY RATED */}

        <section className="mx-auto max-w-7xl px-6 pb-14 md:px-10">
          <SectionTitle
            eyebrow="COMMUNITY"
            title="Recently Rated"
            action="See all"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentlyRated.map((album) => (
              <RecentCard
                key={album.title}
                {...album}
              />
            ))}
          </div>
        </section>

        {/* COMMUNITY */}

        <section
          id="features"
          className="mx-auto max-w-7xl px-6 pb-14 md:px-10"
        >
          <div className="overflow-hidden rounded-3xl border border-[#212121] bg-[#181818]">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1db954]">
                  THE COMMUNITY
                </p>

                <h2 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
                  Your taste.
                  <br />
                  Your story.
                </h2>

                <p className="mt-5 max-w-lg leading-7 text-[#b3b3b3]">
                  Musicboxd gives you a place to keep
                  your music history, share your opinions
                  and discover what other people are
                  listening to.
                </p>

                <button className="mt-7 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105">
                  Join the community
                </button>
              </div>

              <div className="relative min-h-[300px] overflow-hidden bg-[#212121]">
                <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#1db954]/20 blur-3xl" />

                <div className="absolute bottom-10 left-10 rotate-[-8deg]">
                  <img
                    src={trendingAlbums[0].image}
                    alt=""
                    className="h-44 w-44 rounded-xl object-cover shadow-2xl"
                  />
                </div>

                <div className="absolute right-12 top-10 rotate-[7deg]">
                  <img
                    src={trendingAlbums[1].image}
                    alt=""
                    className="h-40 w-40 rounded-xl object-cover shadow-2xl"
                  />
                </div>

                <div className="absolute bottom-8 right-28 rotate-[-3deg]">
                  <img
                    src={trendingAlbums[2].image}
                    alt=""
                    className="h-32 w-32 rounded-xl object-cover shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LISTS */}

        <section
          id="lists"
          className="mx-auto max-w-7xl px-6 pb-20 md:px-10"
        >
          <SectionTitle
            eyebrow="CURATED"
            title="Popular Lists"
            action="View all"
          />

          <div className="grid gap-4 md:grid-cols-3">
            {popularLists.map((list) => (
              <div
                key={list.title}
                className="rounded-2xl border border-[#212121] bg-[#181818] p-6 transition-colors hover:bg-[#212121]"
              >
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1db954]/15 text-xl text-[#1db954]">
                  ▤
                </div>

                <h3 className="text-xl font-bold">
                  {list.title}
                </h3>

                <div className="mt-3 flex items-center justify-between text-sm text-[#b3b3b3]">
                  <span>by {list.creator}</span>

                  <span>{list.count}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}

        <footer className="border-t border-[#212121]">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-10 text-sm text-[#535353] md:flex-row md:items-center md:justify-between md:px-10">
            <div className="flex items-center gap-2">
              <img
                src="/musicboxd-logo.png"
                alt=""
                className="h-6 w-7 object-contain opacity-70"
              />

              <span>musicboxd</span>
            </div>

            <div className="flex gap-6">
              <a
                href="#"
                className="transition-colors hover:text-[#b3b3b3]"
              >
                About
              </a>

              <a
                href="#"
                className="transition-colors hover:text-[#b3b3b3]"
              >
                Privacy
              </a>

              <a
                href="#"
                className="transition-colors hover:text-[#b3b3b3]"
              >
                Terms
              </a>
            </div>

            <span>© 2026 Musicboxd</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

/* SIDEBAR ITEM */

function SidebarItem({
  icon,
  label,
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex w-full items-center gap-4 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
        active
          ? "bg-[#212121] text-white"
          : "text-[#b3b3b3] hover:bg-[#181818] hover:text-white"
      }`}
    >
      <span
        className={`flex h-6 w-6 items-center justify-center text-lg ${
          active ? "text-[#1db954]" : ""
        }`}
      >
        {icon}
      </span>

      {label}
    </button>
  );
}

/* MOBILE NAV */

function MobileNav({
  label,
  href,
  onClick,
}: {
  label: string;
  href: string;
  onClick: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="rounded-xl px-4 py-3 text-sm font-semibold text-[#b3b3b3] hover:bg-[#212121] hover:text-white"
    >
      {label}
    </a>
  );
}

/* MINI ALBUM */

function MiniAlbum({
  image,
  title,
  artist,
}: {
  image: string;
  title: string;
  artist: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={image}
        alt=""
        className="h-10 w-10 rounded-lg object-cover"
      />

      <div className="min-w-0">
        <p className="truncate text-xs font-semibold">
          {title}
        </p>

        <p className="truncate text-[11px] text-[#535353]">
          {artist}
        </p>
      </div>
    </div>
  );
}

/* SECTION TITLE */

function SectionTitle({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1db954]">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-3xl font-black tracking-tight">
          {title}
        </h2>
      </div>

      <button className="text-sm font-semibold text-[#b3b3b3] transition-colors hover:text-white">
        {action} →
      </button>
    </div>
  );
}

/* ALBUM CARD */

function AlbumCard({
  title,
  artist,
  year,
  rating,
  image,
}: {
  title: string;
  artist: string;
  year: string;
  rating: string;
  image: string;
}) {
  return (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-2xl bg-[#212121]">
        <img
          src={image}
          alt={title}
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="absolute bottom-4 left-4 rounded-full bg-black/80 px-3 py-1.5 text-xs font-bold opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
          ★ {rating}
        </div>
      </div>

      <div className="mt-3">
        <h3 className="truncate font-bold">{title}</h3>

        <p className="mt-1 truncate text-sm text-[#b3b3b3]">
          {artist}
        </p>

        <p className="mt-1 text-xs text-[#535353]">
          {year}
        </p>
      </div>
    </div>
  );
}

/* RECENT CARD */

function RecentCard({
  title,
  artist,
  rating,
  image,
}: {
  title: string;
  artist: string;
  rating: string;
  image: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#212121] bg-[#181818] p-4 transition-colors hover:bg-[#212121]">
      <img
        src={image}
        alt={title}
        className="h-16 w-16 shrink-0 rounded-xl object-cover"
      />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold">
          {title}
        </h3>

        <p className="mt-1 truncate text-xs text-[#b3b3b3]">
          {artist}
        </p>

        <div className="mt-2 text-xs font-bold text-[#1db954]">
          ★ {rating}
        </div>
      </div>
    </div>
  );
}