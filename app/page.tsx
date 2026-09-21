import Link from "next/link";
import SiteHeader from "./components/SiteHeader";
import { spotifyFetch } from "../lib/spotify";

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

async function getAlbum(query: string) {
  try {
    const data = (await spotifyFetch("/search", {
      q: query,
      type: "album",
      market: "BR",
      limit: "1",
    })) as SpotifySearchResponse;

    return data.albums?.items?.[0] ?? null;
  } catch {
    return null;
  }
}

async function getPopularAlbums() {
  const queries = [
    "Blonde Frank Ocean",
    "GNX Kendrick Lamar",
    "SOS SZA",
    "UTOPIA Travis Scott",
    "Channel Orange Frank Ocean",
  ];

  const albums = await Promise.all(
    queries.map((query) => getAlbum(query))
  );

  return albums.filter(Boolean) as SpotifyAlbum[];
}

const reviews = [
  {
    user: "natan",
    album: "Blonde",
    artist: "Frank Ocean",
    rating: "★★★★★",
    text: "One of those albums that feels different every time you come back to it.",
  },
  {
    user: "vinicius",
    album: "GNX",
    artist: "Kendrick Lamar",
    rating: "★★★★½",
    text: "A record that gets better when you stop trying to rank every track.",
  },
  {
    user: "luiz",
    album: "UTOPIA",
    artist: "Travis Scott",
    rating: "★★★★½",
    text: "Huge production, strange moments and an atmosphere that carries the whole thing.",
  },
];

const featuredLists = [
  {
    title: "Albums everyone should hear",
    creator: "musicboxd",
    count: "128 albums",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700&q=90",
  },
  {
    title: "Late night essentials",
    creator: "musicboxd",
    count: "64 albums",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=700&q=90",
  },
  {
    title: "Modern classics",
    creator: "musicboxd",
    count: "93 albums",
    image:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=700&q=90",
  },
];

const browseYears = [
  "2026",
  "2025",
  "2024",
  "2023",
  "2020s",
  "2010s",
  "2000s",
  "1990s",
];

const genres = [
  "Hip-Hop",
  "R&B",
  "Pop",
  "Rock",
  "Jazz",
  "Electronic",
  "Indie",
  "Soul",
];

export default async function Home() {
  const popularAlbums = await getPopularAlbums();

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <SiteHeader />

      <main className="pt-[113px] md:pt-[68px]">
        {/* HERO */}

        <section className="border-b border-[#242424]">
          <div className="musicboxd-container py-14 md:py-20">
            <div className="max-w-4xl">
              <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.25em] text-[#1db954]">
                MUSICBOXD
              </p>

              <h1 className="text-4xl font-black leading-[1.02] tracking-[-0.045em] sm:text-5xl md:text-6xl lg:text-7xl">
                Discover music.
                <br />
                Keep your history.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-7 text-[#a7a7a7] md:text-lg">
                Rate albums, write reviews, create lists and discover
                what other people are listening to.
              </p>
            </div>
          </div>
        </section>

        {/* POPULAR */}

        <section className="musicboxd-container py-12 md:py-16">
          <SectionHeading
            eyebrow="TRENDING"
            title="Popular Music This Week"
            action="View all"
          />

          {popularAlbums.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {popularAlbums.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-[#292929] bg-[#181818] p-8 text-sm text-[#888]">
              Spotify não conseguiu carregar os álbuns agora.
            </div>
          )}
        </section>

        {/* REVIEWS */}

        <section className="border-y border-[#242424] bg-[#151515]">
          <div className="musicboxd-container py-12 md:py-16">
            <SectionHeading
              eyebrow="COMMUNITY"
              title="Just Reviewed"
              action="See all"
            />

            <div className="grid gap-4 md:grid-cols-3">
              {reviews.map((review) => (
                <ReviewCard
                  key={`${review.user}-${review.album}`}
                  {...review}
                />
              ))}
            </div>
          </div>
        </section>

        {/* LISTS */}

        <section className="musicboxd-container py-12 md:py-16">
          <SectionHeading
            eyebrow="CURATED"
            title="Featured Lists"
            action="View all"
          />

          <div className="grid gap-5 md:grid-cols-3">
            {featuredLists.map((list) => (
              <ListCard
                key={list.title}
                {...list}
              />
            ))}
          </div>
        </section>

        {/* BROWSE */}

        <section className="border-y border-[#242424] bg-[#151515]">
          <div className="musicboxd-container py-12 md:py-16">
            <SectionHeading
              eyebrow="EXPLORE"
              title="Browse Music"
              action=""
            />

            <div className="grid gap-10 md:grid-cols-2">
              <BrowseGroup
                title="By year"
                items={browseYears}
              />

              <BrowseGroup
                title="By genre"
                items={genres}
              />
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <BrowseButton label="Highest rated" />
              <BrowseButton label="Most popular" />
              <BrowseButton label="Recently released" />
              <BrowseButton label="Most reviewed" />
            </div>
          </div>
        </section>

        {/* FIND MUSIC */}

        <section className="musicboxd-container py-16 md:py-24">
          <div className="overflow-hidden rounded-3xl border border-[#292929] bg-[#181818]">
            <div className="p-7 md:p-12">
              <div className="max-w-2xl">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#1db954]">
                  FIND SOMETHING NEW
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.035em] md:text-5xl">
                  What are you listening to?
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-[#a7a7a7] md:text-base">
                  Search for an album, artist or track and start
                  building your music history.
                </p>

                <div className="mt-7">
                  <Link
                    href="/"
                    className="inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.02]"
                  >
                    Search Music
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}

      <footer className="border-t border-[#242424]">
        <div className="musicboxd-container flex flex-col gap-5 py-8 text-xs text-[#626262] sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <img
              src="/musicboxd-logo.png"
              alt=""
              className="h-6 w-6 object-contain opacity-60"
            />

            <span className="font-semibold">
              MUSICBOXD
            </span>
          </div>

          <div className="flex gap-5">
            <a
              href="#"
              className="transition-colors hover:text-[#a7a7a7]"
            >
              About
            </a>

            <a
              href="#"
              className="transition-colors hover:text-[#a7a7a7]"
            >
              Privacy
            </a>

            <a
              href="#"
              className="transition-colors hover:text-[#a7a7a7]"
            >
              Terms
            </a>
          </div>

          <span>© 2026 Musicboxd</span>
        </div>
      </footer>
    </div>
  );
}

/* -------------------------------- */
/* SECTION HEADING                   */
/* -------------------------------- */

function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action: string;
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1db954]">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-2xl font-black tracking-[-0.025em] md:text-3xl">
          {title}
        </h2>
      </div>

      {action && (
        <button
          type="button"
          className="shrink-0 text-xs font-bold text-[#888] transition-colors hover:text-white"
        >
          {action} →
        </button>
      )}
    </div>
  );
}

/* -------------------------------- */
/* ALBUM CARD                       */
/* -------------------------------- */

function AlbumCard({
  album,
}: {
  album: SpotifyAlbum;
}) {
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
            className="musicboxd-cover aspect-square w-full object-cover"
          />
        ) : (
          <div className="aspect-square w-full bg-[#222]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

        <div className="absolute bottom-3 left-3 rounded-full bg-black/80 px-2.5 py-1 text-[10px] font-bold opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
          View album →
        </div>
      </div>

      <div className="mt-3 min-w-0">
        <h3 className="truncate text-sm font-bold">
          {album.name}
        </h3>

        <p className="mt-1 truncate text-xs text-[#a0a0a0]">
          {artist}
        </p>

        <p className="mt-1 text-[11px] text-[#5f5f5f]">
          {year}
        </p>
      </div>
    </Link>
  );
}

/* -------------------------------- */
/* REVIEW CARD                      */
/* -------------------------------- */

function ReviewCard({
  user,
  album,
  artist,
  rating,
  text,
}: {
  user: string;
  album: string;
  artist: string;
  rating: string;
  text: string;
}) {
  return (
    <article className="musicboxd-card rounded-2xl border border-[#292929] bg-[#191919] p-5">
      <div>
        <p className="text-[11px] text-[#6e6e6e]">
          {user} reviewed
        </p>

        <h3 className="mt-1 text-sm font-bold">
          {album}
        </h3>

        <p className="mt-0.5 text-xs text-[#888]">
          {artist}
        </p>

        <p className="mt-2 text-[11px] tracking-wide text-[#1db954]">
          {rating}
        </p>
      </div>

      <p className="mt-5 text-sm leading-6 text-[#b0b0b0]">
        “{text}”
      </p>
    </article>
  );
}

/* -------------------------------- */
/* LIST CARD                        */
/* -------------------------------- */

function ListCard({
  title,
  creator,
  count,
  image,
}: {
  title: string;
  creator: string;
  count: string;
  image: string;
}) {
  return (
    <Link
      href="/lists"
      className="musicboxd-card group overflow-hidden rounded-2xl border border-[#292929] bg-[#181818]"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt=""
          className="musicboxd-cover h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

        <div className="absolute bottom-4 left-4">
          <span className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
            {count}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-base font-bold">
          {title}
        </h3>

        <p className="mt-2 text-xs text-[#777]">
          by {creator}
        </p>
      </div>
    </Link>
  );
}

/* -------------------------------- */
/* BROWSE GROUP                     */
/* -------------------------------- */

function BrowseGroup({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-[#777]">
        {title}
      </h3>

      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            className="rounded-full border border-[#303030] bg-[#181818] px-4 py-2 text-xs font-semibold text-[#b0b0b0] transition-colors hover:border-[#555] hover:bg-[#242424] hover:text-white"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- */
/* BROWSE BUTTON                    */
/* -------------------------------- */

function BrowseButton({
  label,
}: {
  label: string;
}) {
  return (
    <button
      type="button"
      className="rounded-xl border border-[#292929] bg-[#181818] px-4 py-4 text-xs font-bold text-[#aaa] transition-colors hover:bg-[#222] hover:text-white"
    >
      {label}
    </button>
  );
}