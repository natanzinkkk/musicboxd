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
  ];

  const albums = await Promise.all(
    queries.map((query) => getAlbum(query))
  );

  return albums.filter(Boolean) as SpotifyAlbum[];
}

const reviews = [
  {
    user: "natan",
    album: "blonde",
    artist: "frank ocean",
    rating: "★★★★★",
    text: "one of those albums that feels different every time you come back to it.",
  },
  {
    user: "vinicius",
    album: "gnx",
    artist: "kendrick lamar",
    rating: "★★★★½",
    text: "a record that gets better when you stop trying to rank every track.",
  },
  {
    user: "luiz",
    album: "utopia",
    artist: "travis scott",
    rating: "★★★★½",
    text: "huge production, strange moments and an atmosphere that carries the whole thing.",
  },
];

const featuredLists = [
  {
    title: "albums everyone should hear",
    creator: "musicboxd",
    count: "128 albums",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=700&q=90",
  },
  {
    title: "late night essentials",
    creator: "musicboxd",
    count: "64 albums",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=700&q=90",
  },
  {
    title: "modern classics",
    creator: "musicboxd",
    count: "93 albums",
    image:
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=700&q=90",
  },
];

export default async function Home() {
  const popularAlbums = await getPopularAlbums();

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <SiteHeader />

      <main className="pt-[113px] md:pt-[62px]">

        {/* hero */}

        <section className="border-b border-[#242424]">
          <div className="musicboxd-container max-w-[1080px] py-12 md:py-16">
            <div className="max-w-3xl">

              <p className="mb-3 text-[10px] font-bold tracking-[0.22em] text-[#1db954]">
                musicboxd
              </p>

              <h1 className="text-4xl font-black leading-[1.02] tracking-[-0.045em] sm:text-5xl md:text-6xl">
                discover music.
                <br />
                keep your history.
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-6 text-[#969696] md:text-base">
                rate albums, write reviews, create lists and discover what
                other people are listening to.
              </p>

            </div>
          </div>
        </section>

        {/* popular */}

        <section className="musicboxd-container max-w-[1080px] py-10 md:py-12">

          <SectionHeading
            title="popular music this week"
            action="more"
            href="/musics"
          />

          {popularAlbums.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-4">
              {popularAlbums.map((album) => (
                <HomeAlbumCard
                  key={album.id}
                  album={album}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}

        </section>

        {/* reviews */}

        <section className="border-y border-[#242424] bg-[#151515]">
          <div className="musicboxd-container max-w-[1080px] py-10 md:py-12">

            <SectionHeading
              title="just reviewed"
              action="more"
              href="/reviews"
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

        {/* featured lists */}

        <section className="musicboxd-container max-w-[1080px] py-10 md:py-12">

          <SectionHeading
            title="featured lists"
            action="more"
            href="/lists"
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

      </main>

      {/* footer */}

      <footer className="border-t border-[#242424]">
        <div className="musicboxd-container max-w-[1080px] flex flex-col gap-4 py-7 text-xs text-[#626262] sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">
            <img
              src="/musicboxd-logo.png"
              alt=""
              className="h-6 w-6 object-contain opacity-60"
            />

            <span className="font-semibold">
              musicboxd
            </span>
          </div>

          <div className="flex gap-5">
            <Link
              href="/"
              className="transition-colors hover:text-[#a7a7a7]"
            >
              home
            </Link>

            <Link
              href="/musics"
              className="transition-colors hover:text-[#a7a7a7]"
            >
              musics
            </Link>

            <Link
              href="/lists"
              className="transition-colors hover:text-[#a7a7a7]"
            >
              lists
            </Link>
          </div>

          <span>© 2026 musicboxd</span>

        </div>
      </footer>

    </div>
  );
}

function SectionHeading({
  title,
  action,
  href,
}: {
  title: string;
  action?: string;
  href?: string;
}) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">

      <h2 className="text-[20px] font-black tracking-[-0.025em] sm:text-[21px]">
        {title}
      </h2>

      {action && href ? (
        <Link
          href={href}
          className="text-[10px] font-bold tracking-[0.1em] text-[#777] transition-colors hover:text-white"
        >
          {action}
        </Link>
      ) : null}

    </div>
  );
}

function HomeAlbumCard({
  album,
}: {
  album: SpotifyAlbum;
}) {
  const image = album.images?.[0]?.url;
  const artist = album.artists?.[0]?.name ?? "unknown artist";

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
            className="aspect-square w-full object-cover"
          />
        ) : (
          <div className="aspect-square w-full bg-[#222]" />
        )}

      </div>

      <div className="mt-3 min-w-0">

        <h3 className="truncate text-[13px] font-bold text-white">
          {album.name.toLowerCase()}
        </h3>

        <p className="mt-1 truncate text-[11px] text-[#777]">
          {artist.toLowerCase()}
        </p>

      </div>
    </Link>
  );
}

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
    <article className="rounded-xl border border-[#292929] bg-[#191919] p-5">

      <p className="text-[11px] text-[#666]">
        {user} reviewed
      </p>

      <h3 className="mt-1 text-sm font-bold">
        {album}
      </h3>

      <p className="mt-0.5 text-xs text-[#777]">
        {artist}
      </p>

      <p className="mt-2 text-[11px] tracking-wide text-[#1db954]">
        {rating}
      </p>

      <p className="mt-5 text-sm leading-6 text-[#aaa]">
        “{text}”
      </p>

    </article>
  );
}

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
      className="group overflow-hidden rounded-xl border border-[#292929] bg-[#181818] transition-colors hover:border-[#383838]"
    >

      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt=""
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
            {count}
          </span>
        </div>
      </div>

      <div className="p-4">

        <h3 className="text-sm font-bold">
          {title}
        </h3>

        <p className="mt-1.5 text-[11px] text-[#777]">
          by {creator}
        </p>

      </div>

    </Link>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-[#292929] bg-[#181818] p-7 text-sm text-[#777]">
      music could not be loaded right now.
    </div>
  );
}