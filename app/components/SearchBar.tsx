"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type SearchResult = {
  id: string;
  title: string;
  artist: string;
  year: string;
  type: string;
  image: string;
  resultType: "album" | "track" | "artist";
  albumId?: string;
  spotifyUrl?: string;
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const search = query.trim();

    if (!search) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/search?q=${encodeURIComponent(search)}`,
          {
            signal: controller.signal,
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error("Search request failed");
        }

        const data = await response.json();

        setResults(data.results ?? []);
        setOpen(true);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Search error:", error);
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  const albums = useMemo(
    () => results.filter((item) => item.resultType === "album"),
    [results]
  );

  const tracks = useMemo(
    () => results.filter((item) => item.resultType === "track"),
    [results]
  );

  const artists = useMemo(
    () => results.filter((item) => item.resultType === "artist"),
    [results]
  );

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  const closeSearch = () => {
    setOpen(false);
  };

  return (
    <div className="relative w-full max-w-[430px]">
      {/* SEARCH INPUT */}
      <div className="flex h-11 items-center rounded-full bg-[#212121] px-4 transition-colors focus-within:bg-[#2a2a2a]">
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#b3b3b3"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-3 shrink-0"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>

        <input
          type="text"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            if (query.trim()) {
              setOpen(true);
            }
          }}
          placeholder="Search albums, artists, tracks..."
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#b3b3b3]"
        />

        {loading && (
          <div className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[#535353] border-t-[#1db954]" />
        )}

        {!loading && query && (
          <button
            type="button"
            onClick={clearSearch}
            className="ml-2 text-xl leading-none text-[#b3b3b3] transition-colors hover:text-white"
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* RESULTS */}
      {open && query.trim() && (
        <>
          <button
            type="button"
            aria-label="Close search"
            onClick={closeSearch}
            className="fixed inset-0 z-40 h-full w-full cursor-default"
          />

          <div className="absolute left-0 right-0 top-14 z-50 max-h-[600px] overflow-y-auto rounded-2xl border border-[#2f2f2f] bg-[#181818] shadow-2xl">
            {/* LOADING */}
            {loading && (
              <div className="px-5 py-7 text-center">
                <div className="mx-auto mb-3 h-5 w-5 animate-spin rounded-full border-2 border-[#535353] border-t-[#1db954]" />

                <p className="text-sm font-semibold text-white">
                  Searching Musicboxd...
                </p>

                <p className="mt-1 text-xs text-[#777]">
                  Looking through Spotify
                </p>
              </div>
            )}

            {/* NOTHING FOUND */}
            {!loading && results.length === 0 && (
              <div className="px-5 py-8 text-center">
                <div className="mb-3 text-2xl">⌕</div>

                <p className="text-sm font-bold text-white">
                  Nothing found
                </p>

                <p className="mt-1 text-xs text-[#777]">
                  Try another album, artist or track.
                </p>
              </div>
            )}

            {/* RESULTS */}
            {!loading && results.length > 0 && (
              <div className="py-2">
                {/* ALBUMS */}
                {albums.length > 0 && (
                  <SearchSection
                    title="Albums"
                    results={albums}
                    onSelect={closeSearch}
                  />
                )}

                {/* TRACKS */}
                {tracks.length > 0 && (
                  <SearchSection
                    title="Tracks"
                    results={tracks}
                    onSelect={closeSearch}
                  />
                )}

                {/* ARTISTS */}
                {artists.length > 0 && (
                  <SearchSection
                    title="Artists"
                    results={artists}
                    onSelect={closeSearch}
                  />
                )}

                {/* FOOTER */}
                <div className="mt-2 border-t border-[#2a2a2a] px-5 py-3">
                  <p className="text-center text-[10px] uppercase tracking-[0.18em] text-[#535353]">
                    Music data powered by Spotify
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

type SearchSectionProps = {
  title: string;
  results: SearchResult[];
  onSelect: () => void;
};

function SearchSection({
  title,
  results,
  onSelect,
}: SearchSectionProps) {
  return (
    <section>
      <div className="px-5 pb-2 pt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1db954]">
          {title}
        </p>
      </div>

      <div>
        {results.map((item) => {
          if (item.resultType === "album") {
            return (
              <Link
                key={`album-${item.id}`}
                href={`/album/${item.id}`}
                onClick={onSelect}
                className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-[#242424]"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#212121]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#535353]">
                      ♪
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">
                    {item.title}
                  </p>

                  <p className="mt-1 truncate text-xs text-[#b3b3b3]">
                    {item.artist}
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#535353]">
                    <span>{item.year || "Unknown"}</span>
                    <span>•</span>
                    <span>{item.type}</span>
                  </div>
                </div>

                <span className="text-xl text-[#535353]">
                  ›
                </span>
              </Link>
            );
          }

          if (item.resultType === "track") {
            return (
              <a
                key={`track-${item.id}`}
                href={item.spotifyUrl}
                target="_blank"
                rel="noreferrer"
                onClick={onSelect}
                className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-[#242424]"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#212121]">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[#535353]">
                      ♪
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-white">
                    {item.title}
                  </p>

                  <p className="mt-1 truncate text-xs text-[#b3b3b3]">
                    {item.artist}
                  </p>

                  <div className="mt-1 flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#535353]">
                    <span>{item.year || "Unknown"}</span>
                    <span>•</span>
                    <span>Track</span>
                  </div>
                </div>

                <span className="text-xs text-[#535353]">
                  Spotify ↗
                </span>
              </a>
            );
          }

          return (
            <a
              key={`artist-${item.id}`}
              href={item.spotifyUrl}
              target="_blank"
              rel="noreferrer"
              onClick={onSelect}
              className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-[#242424]"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-[#212121]">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#535353]">
                    ♪
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-[#b3b3b3]">
                  Artist
                </p>
              </div>

              <span className="text-xs text-[#535353]">
                Spotify ↗
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}