"use client";

import Link from "next/link";

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
    <Link
      href="/"
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
        active
          ? "bg-[#1db954]/15 text-[#1db954]"
          : "text-[#b3b3b3] hover:bg-[#212121] hover:text-white"
      }`}
    >
      <span className="w-5 text-center text-base">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-[72px] hidden w-[265px] border-r border-[#2a2a2a] bg-[#121212] p-5 lg:block">
      <div className="flex h-full flex-col">
        <div className="space-y-1">
          <SidebarItem icon="⌂" label="Home" active />
          <SidebarItem icon="◉" label="Explore" />
          <SidebarItem icon="↕" label="Rank" />
          <SidebarItem icon="▤" label="Lists" />
          <SidebarItem icon="◷" label="Diary" />
          <SidebarItem icon="◎" label="Profile" />
        </div>

        <div className="mt-10">
          <p className="mb-4 px-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#535353]">
            Recently Played
          </p>

          <div className="space-y-3">
            <MiniAlbum
              image="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=200&q=80"
              title="Blonde"
              artist="Frank Ocean"
            />

            <MiniAlbum
              image="https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=200&q=80"
              title="Channel Orange"
              artist="Frank Ocean"
            />

            <MiniAlbum
              image="https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=200&q=80"
              title="Currents"
              artist="Tame Impala"
            />
          </div>
        </div>

        <div className="mt-auto rounded-2xl border border-[#2a2a2a] bg-[#181818] p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#535353]">
            Now playing
          </p>

          <p className="mt-2 truncate text-sm font-bold text-white">
            Your Music Journey
          </p>

          <p className="mt-1 text-xs text-[#b3b3b3]">
            Musicboxd
          </p>

          <div className="mt-4 h-1 overflow-hidden rounded-full bg-[#535353]">
            <div className="h-full w-[42%] rounded-full bg-[#1db954]" />
          </div>
        </div>
      </div>
    </aside>
  );
}

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
        alt={title}
        className="h-10 w-10 rounded-lg object-cover"
      />

      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-white">{title}</p>
        <p className="truncate text-[11px] text-[#b3b3b3]">{artist}</p>
      </div>
    </div>
  );
}