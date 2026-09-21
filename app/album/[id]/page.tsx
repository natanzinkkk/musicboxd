import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import Sidebar from "../../components/Sidebar";
import { spotifyFetch } from "../../../lib/spotify";

type SpotifyImage = {
  url: string;
  height?: number;
  width?: number;
};

type SpotifyArtist = {
  id: string;
  name: string;
  external_urls?: {
    spotify?: string;
  };
};

type SpotifyTrack = {
  id: string;
  name: string;
  track_number: number;
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  artists: SpotifyArtist[];
  external_urls?: {
    spotify?: string;
  };
};

type SpotifyAlbum = {
  id: string;
  name: string;
  album_type: "album" | "single" | "compilation";
  release_date: string;
  release_date_precision?: string;
  total_tracks: number;
  images: SpotifyImage[];
  artists: SpotifyArtist[];
  external_urls?: {
    spotify?: string;
  };
  label?: string;
  copyrights?: {
    text: string;
    type: string;
  }[];
};

type SpotifyTracksResponse = {
  items: SpotifyTrack[];
  total: number;
  limit: number;
  offset: number;
  next: string | null;
};

function formatTime(milliseconds?: number) {
  if (
    milliseconds === undefined ||
    milliseconds === null ||
    milliseconds <= 0
  ) {
    return "--:--";
  }

  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatDate(date?: string) {
  if (!date) {
    return "Unknown";
  }

  const parts = date.split("-");

  if (parts.length === 1) {
    return parts[0];
  }

  if (parts.length === 2) {
    return `${parts[1]}/${parts[0]}`;
  }

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function getArtistName(artists?: SpotifyArtist[]) {
  if (!artists || artists.length === 0) {
    return "Unknown Artist";
  }

  return artists.map((artist) => artist.name).join(", ");
}

async function getAlbum(id: string): Promise<SpotifyAlbum | null> {
  try {
    const album = await spotifyFetch(`/albums/${id}`, {
      market: "BR",
    });

    return album as SpotifyAlbum;
  } catch (error) {
    console.error("Spotify album request error:", error);
    return null;
  }
}

async function getAlbumTracks(id: string): Promise<SpotifyTrack[]> {
  try {
    const firstPage =
      (await spotifyFetch(`/albums/${id}/tracks`, {
        market: "BR",
        limit: "50",
        offset: "0",
      })) as SpotifyTracksResponse;

    const tracks = [...(firstPage.items ?? [])];

    let next = firstPage.next;

    while (next) {
      const nextUrl = new URL(next);

      const nextPage =
        (await spotifyFetch(`/albums/${id}/tracks`, {
          market: "BR",
          limit: nextUrl.searchParams.get("limit") ?? "50",
          offset: nextUrl.searchParams.get("offset") ?? "0",
        })) as SpotifyTracksResponse;

      tracks.push(...(nextPage.items ?? []));
      next = nextPage.next;
    }

    return tracks;
  } catch (error) {
    console.error("Spotify tracks request error:", error);
    return [];
  }
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  /*
   * Buscamos o álbum e as faixas ao mesmo tempo.
   * Isso deixa a página mais rápida.
   */
  const [album, tracks] = await Promise.all([
    getAlbum(id),
    getAlbumTracks(id),
  ]);

  if (!album) {
    return (
      <div className="min-h-screen bg-[#121212] text-white">
        <SiteHeader />
        <Sidebar />

        <main className="min-h-screen pt-[72px] lg:pl-[265px]">
          <div className="flex min-h-[70vh] items-center justify-center px-6">
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#212121] text-2xl">
                ?
              </div>

              <h1 className="text-2xl font-black">
                Album not found
              </h1>

              <p className="mt-2 text-sm text-[#b3b3b3]">
                We couldn't find this album on Spotify.
              </p>

              <Link
                href="/"
                className="mt-6 inline-flex rounded-full bg-[#1db954] px-6 py-3 text-sm font-black text-black transition hover:scale-[1.02]"
              >
                Back to Musicboxd
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const artist = getArtistName(album.artists);

  const year =
    album.release_date?.slice(0, 4) || "Unknown";

  const albumType =
    album.album_type === "album"
      ? "Album"
      : album.album_type === "single"
        ? "Single"
        : "Compilation";

  const coverUrl =
    album.images?.[0]?.url || "";

  const spotifyUrl =
    album.external_urls?.spotify || "";

  const totalTracks =
    tracks.length || album.total_tracks || 0;

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <SiteHeader />
      <Sidebar />

      <main className="pt-[72px] lg:pl-[265px]">

        {/* HERO */}

        <section className="relative overflow-hidden border-b border-[#2a2a2a] bg-[#121212]">

          <div className="absolute inset-0 bg-gradient-to-b from-[#181818] via-[#121212] to-[#121212]" />

          <div className="relative mx-auto max-w-[1400px] px-5 py-8 sm:px-6 md:px-10 md:py-14">
            <div className="flex flex-col gap-7 md:flex-row md:items-end md:gap-9">

              {/* COVER */}

              <div className="shrink-0">
                <div className="group relative mx-auto overflow-hidden rounded-2xl bg-[#181818] shadow-2xl shadow-black/50 md:mx-0">

                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={`${album.name} cover`}
                      className="h-[280px] w-[280px] object-contain transition duration-500 md:h-[340px] md:w-[340px]"
                    />
                  ) : (
                    <div className="flex h-[280px] w-[280px] items-center justify-center text-4xl text-[#535353] md:h-[340px] md:w-[340px]">
                      ♪
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
                </div>
              </div>

              {/* INFO */}

              <div className="min-w-0 flex-1 pb-1">

                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#1db954]/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#1db954]">
                    {albumType}
                  </span>

                  <span className="rounded-full bg-[#212121] px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#b3b3b3]">
                    Spotify
                  </span>
                </div>

                <h1 className="max-w-4xl text-4xl font-black leading-[0.95] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  {album.name}
                </h1>

                <p className="mt-5 text-xl font-bold text-[#b3b3b3] md:text-2xl">
                  {artist}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#b3b3b3]">
                  <span>{year}</span>

                  <span className="text-[#535353]">
                    •
                  </span>

                  <span>
                    {totalTracks}{" "}
                    {totalTracks === 1 ? "track" : "tracks"}
                  </span>

                  {album.label && (
                    <>
                      <span className="text-[#535353]">
                        •
                      </span>

                      <span>{album.label}</span>
                    </>
                  )}
                </div>

                {/* RATING */}

                <div className="mt-7 flex flex-wrap items-center gap-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-black text-white">
                        —
                      </span>

                      <span className="text-xs font-bold uppercase tracking-wider text-[#535353]">
                        / 5
                      </span>
                    </div>

                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#535353]">
                      Community rating
                    </p>
                  </div>

                  <div className="h-10 w-px bg-[#535353]" />

                  <div>
                    <p className="text-sm font-bold text-white">
                      Be the first to rate
                    </p>

                    <p className="mt-1 text-xs text-[#b3b3b3]">
                      Tell the community what you think.
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}

                <div className="mt-7 flex flex-wrap gap-3">

                  <button className="rounded-full bg-[#1db954] px-6 py-3 text-sm font-black text-black transition hover:scale-[1.02] hover:bg-[#1ed760]">
                    ★ Rate album
                  </button>

                  <button className="rounded-full border border-[#535353] bg-[#181818]/80 px-6 py-3 text-sm font-bold text-white transition hover:border-white hover:bg-[#212121]">
                    + Add to list
                  </button>

                  {spotifyUrl && (
                    <a
                      href={spotifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-[#535353] bg-[#181818]/80 px-6 py-3 text-sm font-bold text-white transition hover:border-[#1db954] hover:text-[#1db954]"
                    >
                      Open in Spotify ↗
                    </a>
                  )}

                  <button
                    aria-label="More options"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#535353] bg-[#181818]/80 text-lg text-[#b3b3b3] transition hover:border-white hover:text-white"
                  >
                    ···
                  </button>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}

        <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-6 md:px-10 md:py-10">

          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-10">

            {/* MAIN */}

            <div>

              {/* TRACKLIST */}

              <section>

                <div className="mb-5 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1db954]">
                      The album
                    </p>

                    <h2 className="mt-1 text-2xl font-black">
                      Tracklist
                    </h2>
                  </div>

                  {tracks.length > 0 && (
                    <span className="text-xs font-bold text-[#535353]">
                      {tracks.length} tracks
                    </span>
                  )}
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#181818]">

                  {tracks.length > 0 ? (
                    <div>

                      {tracks.map((track, index) => (
                        <a
                          key={`${track.id}-${index}`}
                          href={
                            track.external_urls?.spotify ||
                            spotifyUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="group flex items-center gap-3 border-b border-[#2a2a2a] px-4 py-4 transition hover:bg-[#212121] last:border-b-0 sm:gap-4 sm:px-5"
                        >

                          <span className="w-6 shrink-0 text-center text-xs font-bold tabular-nums text-[#535353] group-hover:text-[#1db954]">
                            {track.track_number || index + 1}
                          </span>

                          <div className="min-w-0 flex-1">

                            <p className="truncate text-sm font-bold text-white">
                              {track.name}
                            </p>

                            {track.artists &&
                              track.artists.length > 0 && (
                                <p className="mt-1 truncate text-xs text-[#535353]">
                                  {getArtistName(track.artists)}
                                </p>
                              )}

                          </div>

                          {track.explicit && (
                            <span className="shrink-0 rounded bg-[#535353] px-1.5 py-0.5 text-[9px] font-black uppercase text-[#121212]">
                              E
                            </span>
                          )}

                          <span className="shrink-0 text-xs font-medium tabular-nums text-[#535353]">
                            {formatTime(track.duration_ms)}
                          </span>

                          <span className="hidden text-xs text-[#535353] transition group-hover:text-[#1db954] sm:block">
                            Spotify ↗
                          </span>

                        </a>
                      ))}

                    </div>
                  ) : (
                    <div className="px-6 py-12 text-center">

                      <p className="text-sm font-bold text-white">
                        Tracklist unavailable
                      </p>

                      <p className="mt-2 text-xs text-[#b3b3b3]">
                        Musicboxd couldn't find the tracks for this album yet.
                      </p>

                    </div>
                  )}

                </div>
              </section>

              {/* REVIEWS */}

              <section className="mt-12 md:mt-14">

                <div className="mb-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1db954]">
                    Community
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    Reviews
                  </h2>
                </div>

                <div className="rounded-2xl border border-[#2a2a2a] bg-[#181818] p-6 md:p-8">

                  <div className="mx-auto max-w-lg text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#212121] text-xl">
                      ✎
                    </div>

                    <h3 className="mt-5 text-lg font-black">
                      No reviews yet
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#b3b3b3]">
                      Write the first review and start the conversation around this album.
                    </p>

                    <button className="mt-6 rounded-full bg-[#212121] px-5 py-2.5 text-xs font-black text-white transition hover:bg-[#2a2a2a]">
                      Write a review
                    </button>

                  </div>
                </div>
              </section>

              {/* ACTIVITY */}

              <section className="mt-12 md:mt-14">

                <div className="mb-5">

                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1db954]">
                    Social
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    Activity
                  </h2>

                </div>

                <div className="rounded-2xl border border-[#2a2a2a] bg-[#181818] p-6 md:p-8">

                  <div className="text-center">

                    <p className="text-sm font-bold text-white">
                      No activity yet
                    </p>

                    <p className="mt-2 text-xs text-[#b3b3b3]">
                      Ratings, reviews and listening activity will appear here.
                    </p>

                  </div>

                </div>
              </section>

            </div>

            {/* SIDEBAR */}

            <aside className="space-y-5">

              {/* ALBUM INFO */}

              <div className="rounded-2xl border border-[#2a2a2a] bg-[#181818] p-5">

                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Album info
                </h3>

                <div className="mt-5 space-y-4">

                  <InfoRow
                    label="Release date"
                    value={formatDate(album.release_date)}
                  />

                  <InfoRow
                    label="Type"
                    value={albumType}
                  />

                  <InfoRow
                    label="Tracks"
                    value={String(totalTracks)}
                  />

                  {album.label && (
                    <InfoRow
                      label="Label"
                      value={album.label}
                    />
                  )}

                </div>
              </div>

              {/* ARTIST */}

              <div className="rounded-2xl border border-[#2a2a2a] bg-[#181818] p-5">

                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Artist
                </h3>

                <div className="mt-5 flex items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#212121] text-lg font-black text-[#1db954]">
                    {artist.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-black text-white">
                      {artist}
                    </p>

                    <p className="mt-1 text-xs text-[#b3b3b3]">
                      Artist
                    </p>

                  </div>

                </div>

                {album.artists?.[0]?.external_urls?.spotify && (
                  <a
                    href={album.artists[0].external_urls.spotify}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 flex w-full items-center justify-center rounded-xl border border-[#535353] py-2.5 text-xs font-black text-white transition hover:border-[#1db954] hover:text-[#1db954]"
                  >
                    View artist on Spotify ↗
                  </a>
                )}

              </div>

              {/* USER ACTIVITY */}

              <div className="rounded-2xl border border-[#2a2a2a] bg-[#181818] p-5">

                <h3 className="text-sm font-black uppercase tracking-wider text-white">
                  Your activity
                </h3>

                <div className="mt-5 rounded-xl bg-[#212121] p-4">

                  <p className="text-xs font-bold text-[#b3b3b3]">
                    You haven't rated this album yet.
                  </p>

                  <button className="mt-4 w-full rounded-lg bg-[#1db954] py-2.5 text-xs font-black text-black transition hover:bg-[#1ed760]">
                    Rate this album
                  </button>

                </div>

              </div>

            </aside>

          </div>
        </div>

        {/* FOOTER */}

        <footer className="border-t border-[#2a2a2a] bg-[#0e0e0e]">

          <div className="mx-auto max-w-[1400px] px-5 py-8 sm:px-6 md:px-10 md:py-10">

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

              <div>

                <div className="flex items-center gap-3">

                  <img
                    src="/musicboxd-logo.png"
                    alt="Musicboxd"
                    width={32}
                    height={32}
                    className="h-8 w-8 object-contain"
                  />

                  <span className="text-sm font-black tracking-tight text-white">
                    MUSICBOXD
                  </span>

                </div>

                <p className="mt-3 max-w-md text-xs leading-5 text-[#535353]">
                  Your music. Your history. Your taste.
                </p>

              </div>

              <div className="flex flex-wrap gap-5 text-xs font-bold text-[#535353]">

                <Link
                  href="/"
                  className="transition hover:text-white"
                >
                  About
                </Link>

                <Link
                  href="/"
                  className="transition hover:text-white"
                >
                  Features
                </Link>

                <Link
                  href="/"
                  className="transition hover:text-white"
                >
                  Privacy
                </Link>

                <Link
                  href="/"
                  className="transition hover:text-white"
                >
                  Terms
                </Link>

              </div>

            </div>

            <div className="mt-8 border-t border-[#212121] pt-6 text-[10px] font-bold uppercase tracking-wider text-[#535353]">
              Musicboxd · Built for people who care about music
            </div>

          </div>

        </footer>

      </main>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#2a2a2a] pb-3 last:border-0 last:pb-0">

      <span className="text-xs font-bold text-[#535353]">
        {label}
      </span>

      <span className="text-right text-xs font-bold text-white">
        {value}
      </span>

    </div>
  );
}