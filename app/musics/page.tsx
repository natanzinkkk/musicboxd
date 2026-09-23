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

async function searchAlbum(query: string) {
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

async function getAlbums(queries: string[]) {
  const results = await Promise.all(
    queries.map((query) => searchAlbum(query))
  );

  return results.filter(Boolean) as SpotifyAlbum[];
}

async function getPopularAlbums() {
  return getAlbums([
    "Blonde Frank Ocean",
    "GNX Kendrick Lamar",
    "SOS SZA",
    "UTOPIA Travis Scott",
  ]);
}

async function getRecentlyAdded() {
  return getAlbums([
    "Channel Orange Frank Ocean",
    "IGOR Tyler The Creator",
    "Currents Tame Impala",
    "After Hours The Weeknd",
  ]);
}

export default async function MusicsPage() {
  const [popularAlbums, recentlyAdded] = await Promise.all([
    getPopularAlbums(),
    getRecentlyAdded(),
  ]);

  const staffAlbums = popularAlbums.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#121212] text-white">

      <SiteHeader />

      <main className="pt-[113px] md:pt-[62px]">

        {/* browse */}

        <section className="border-b border-[#242424]">
          <div className="musicboxd-container max-w-[1080px] py-6 md:py-7">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div className="flex flex-wrap items-center gap-2">

                <span className="mr-1 text-[10px] font-bold tracking-[0.12em] text-[#666]">
                  browse by
                </span>

                <BrowseButton label="year" />
                <BrowseButton label="rating" />
                <BrowseButton label="popular" />
                <BrowseButton label="genre" />
                <BrowseButton label="type" />
                <BrowseButton label="other" />

              </div>

              <div className="w-full lg:w-[250px]">

                <div className="relative">

                  <input
                    type="text"
                    placeholder="find music..."
                    className="h-9 w-full rounded-full border border-[#303030] bg-[#181818] px-4 pr-10 text-xs text-white placeholder:text-[#5f5f5f] transition-colors focus:border-[#4a4a4a]"
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#666]">
                    ⌕
                  </span>

                </div>

              </div>

            </div>

          </div>
        </section>

        {/* popular */}

        <section className="musicboxd-container max-w-[1080px] py-9 md:py-11">

          <SectionHeading
            title="popular music this week"
            action="more"
            href="/lists"
          />

          {popularAlbums.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-4">

              {popularAlbums.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                />
              ))}

            </div>
          ) : (
            <EmptyState />
          )}

        </section>

        {/* staff pick */}

        <section className="border-y border-[#242424] bg-[#151515]">

          <div className="musicboxd-container max-w-[1080px] py-9 md:py-11">

            <SectionHeading
              title="musicboxd staff pick"
              action="more"
              href="/lists"
            />

            <div className="overflow-hidden rounded-xl border border-[#292929] bg-[#181818]">

              <div className="grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">

                {/* 2x2 covers */}

                <div className="grid grid-cols-2 gap-px bg-[#292929]">

                  {staffAlbums.length > 0 ? (
                    staffAlbums.map((album) => (
                      <Link
                        key={album.id}
                        href={`/album/${album.id}`}
                        className="group relative aspect-square overflow-hidden bg-[#1b1b1b]"
                      >

                        <img
                          src={album.images?.[0]?.url}
                          alt={album.name}
                          className="h-full w-full object-cover"
                        />

                        <div className="pointer-events-none absolute bottom-2 left-2 right-2 rounded-lg border border-white/10 bg-black/90 px-3 py-2 opacity-0 shadow-xl backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100">

                          <div className="flex items-center justify-between gap-3">

                            <p className="min-w-0 truncate text-[11px] font-bold text-white">
                              {album.name.toLowerCase()}
                            </p>

                            <span className="shrink-0 text-[10px] text-[#888]">
                              {album.release_date?.slice(0, 4)}
                            </span>

                          </div>

                        </div>

                      </Link>
                    ))
                  ) : (
                    <div className="col-span-2 aspect-square bg-[#1b1b1b]" />
                  )}

                </div>

                {/* editorial */}

                <div className="flex flex-col justify-center p-7 md:p-9">

                  <p className="text-[10px] font-bold tracking-[0.16em] text-[#1db954]">
                    editor&apos;s choice
                  </p>

                  <h3 className="mt-3 text-2xl font-black leading-tight tracking-[-0.035em] md:text-3xl">
                    albums worth coming back to
                  </h3>

                  <p className="mt-4 max-w-lg text-sm leading-6 text-[#929292]">
                    a selection of albums chosen by the musicboxd team.
                    records that stay interesting long after the first listen.
                  </p>

                  <div className="mt-6 flex items-center gap-3">

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#292929] text-[11px] font-bold">
                      n
                    </div>

                    <div>

                      <p className="text-xs font-bold text-white">
                        selected by musicboxd
                      </p>

                      <p className="mt-0.5 text-[10px] text-[#666]">
                        staff selection
                      </p>

                    </div>

                  </div>

                  <Link
                    href="/lists"
                    className="mt-7 inline-flex w-fit rounded-full bg-white px-5 py-2.5 text-xs font-bold !text-black transition-colors hover:bg-[#e8e8e8]"
                 >
                    explore list
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* recently added */}

        <section className="musicboxd-container max-w-[1080px] py-9 md:py-11">

          <SectionHeading
            title="recently added"
            action="more"
            href="/musics"
          />

          {recentlyAdded.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-4">

              {recentlyAdded.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                />
              ))}

            </div>
          ) : (
            <EmptyState />
          )}

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

          <span>
            © 2026 musicboxd
          </span>

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

      <h2 className="text-[19px] font-black tracking-[-0.025em] sm:text-[21px]">
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

function BrowseButton({
  label,
}: {
  label: string;
}) {
  return (
    <button
      type="button"
      className="inline-flex h-9 items-center gap-2 rounded-full border border-[#303030] bg-[#181818] px-4 text-[10px] font-bold tracking-[0.04em] text-[#858585] transition-all duration-150 hover:border-[#464646] hover:bg-[#202020] hover:text-white"
    >
      {label}

      <span className="text-[9px] text-[#5f5f5f]">
        ⌄
      </span>

    </button>
  );
}

function AlbumCard({
  album,
}: {
  album: SpotifyAlbum;
}) {
  const image = album.images?.[0]?.url;
  const year = album.release_date?.slice(0, 4) ?? "";

  return (
    <Link
      href={`/album/${album.id}`}
      className="group block min-w-0"
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

        {/* hover bubble */}

        <div className="pointer-events-none absolute bottom-2 left-2 right-2 translate-y-1 rounded-lg border border-white/10 bg-black/90 px-3 py-2.5 opacity-0 shadow-xl backdrop-blur-md transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">

          <div className="flex items-center justify-between gap-3">

            <p className="min-w-0 truncate text-[11px] font-bold text-white">
              {album.name.toLowerCase()}
            </p>

            <span className="shrink-0 text-[10px] text-[#888]">
              {year}
            </span>

          </div>

        </div>

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