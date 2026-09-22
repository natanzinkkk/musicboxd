import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import { spotifyFetch } from "../../lib/spotify";

type SpotifyImage = {
  url: string;
  width: number;
  height: number;
};

type SpotifyArtist = {
  name: string;
};

type SpotifyAlbum = {
  id: string;
  name: string;
  release_date: string;
  images: SpotifyImage[];
  artists: SpotifyArtist[];
};

type SpotifySearchResponse = {
  albums?: {
    items: SpotifyAlbum[];
  };
};

const discoveryQueries = [
  "Frank Ocean",
  "Kendrick Lamar",
  "SZA",
  "Tyler The Creator",
  "Travis Scott",
  "Drake",
  "The Weeknd",
  "Radiohead",
  "Kanye West",
  "Playboi Carti",
  "Mac Miller",
  "Tame Impala",
];

async function searchAlbums(query: string) {
  try {
    const data = (await spotifyFetch("/search", {
      q: query,
      type: "album",
      market: "BR",
      limit: "4",
    })) as SpotifySearchResponse;

    return data.albums?.items ?? [];
  } catch {
    return [];
  }
}

async function getDiscoveryAlbums() {
  const results = await Promise.all(
    discoveryQueries.map((query) => searchAlbums(query))
  );

  const albums = results.flat();

  const uniqueAlbums = Array.from(
    new Map(albums.map((album) => [album.id, album])).values()
  );

  return uniqueAlbums;
}

export default async function MusicsPage() {
  const albums = await getDiscoveryAlbums();

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <SiteHeader />

      <main className="pt-[113px] md:pt-[62px]">
        {/* PAGE HEADER */}
        <section className="border-b border-[#242424]">
          <div className="musicboxd-container py-10 md:py-14">
            <div className="max-w-3xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1db954]">
                DISCOVER
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-[-0.035em] sm:text-4xl md:text-5xl">
                Musics
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8f8f8f] md:text-base">
                Explore albums, discover new artists and find something worth
                adding to your history.
              </p>
            </div>
          </div>
        </section>

        {/* FILTERS */}
        <section className="border-b border-[#242424] bg-[#151515]">
          <div className="musicboxd-container py-5">
            <div className="flex flex-wrap items-center gap-2">
              <FilterButton label="Year" />
              <FilterButton label="Rating" />
              <FilterButton label="Popular" />
              <FilterButton label="Genre" />

              <div className="ml-auto hidden text-[10px] font-bold uppercase tracking-[0.16em] text-[#555] sm:block">
                {albums.length} albums
              </div>
            </div>
          </div>
        </section>

        {/* ALBUM GRID */}
        <section className="musicboxd-container py-10 md:py-12">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1db954]">
                EXPLORE
              </p>

              <h2 className="mt-1 text-xl font-black tracking-[-0.025em] sm:text-2xl">
                Discover albums
              </h2>
            </div>
          </div>

          {albums.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {albums.map((album) => (
                <MusicAlbumCard key={album.id} album={album} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#292929] bg-[#181818] p-8 text-sm text-[#888]">
              Spotify não conseguiu carregar os álbuns agora.
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#242424]">
        <div className="musicboxd-container flex flex-col gap-4 py-8 text-xs text-[#626262] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/musicboxd-logo.png"
              alt=""
              className="h-6 w-6 object-contain opacity-60"
            />

            <span className="font-semibold">MUSICBOXD</span>
          </div>

          <span>© 2026 Musicboxd</span>
        </div>
      </footer>
    </div>
  );
}

/* -------------------------------- */
/* FILTER BUTTON                    */
/* -------------------------------- */

function FilterButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-9 items-center gap-2 rounded-full border border-[#303030] bg-[#191919] px-4 text-[11px] font-bold text-[#a5a5a5] transition-colors hover:border-[#4a4a4a] hover:bg-[#222] hover:text-white"
    >
      {label}

      <span className="text-[10px] text-[#666]">⌄</span>
    </button>
  );
}

/* -------------------------------- */
/* ALBUM CARD                       */
/* -------------------------------- */

function MusicAlbumCard({ album }: { album: SpotifyAlbum }) {
  const image = album.images?.[0]?.url;
  const artist = album.artists?.[0]?.name ?? "Unknown artist";
  const year = album.release_date?.slice(0, 4) ?? "";

  return (
    <Link
      href={`/album/${album.id}`}
      className="group min-w-0"
    >
      <div className="relative overflow-hidden rounded-xl bg-[#1b1b1b]">
        {image ? (
          <img
            src={image}
            alt={album.name}
            className="aspect-square w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.025]"
          />
        ) : (
          <div className="aspect-square w-full bg-[#222]" />
        )}

        {/* DARK HOVER */}
        <div className="absolute inset-0 bg-black/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        {/* ALBUM INFO BUBBLE */}
        <div className="pointer-events-none absolute inset-x-2 bottom-2 translate-y-2 rounded-lg border border-white/10 bg-black/90 px-3 py-2.5 opacity-0 shadow-2xl backdrop-blur-md transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
          <p className="truncate text-[11px] font-bold text-white">
            {album.name}
          </p>

          <p className="mt-0.5 text-[10px] text-[#999]">
            {year}
          </p>
        </div>
      </div>

      <div className="mt-3 min-w-0">
        <h3 className="truncate text-[13px] font-bold text-white">
          {album.name}
        </h3>

        <p className="mt-1 truncate text-[11px] text-[#858585]">
          {artist}
        </p>

        <p className="mt-1 text-[10px] text-[#555]">
          {year}
        </p>
      </div>
    </Link>
  );
}