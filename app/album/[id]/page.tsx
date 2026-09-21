import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import { spotifyFetch } from "../../../lib/spotify";

type SpotifyImage = {
  url: string;
  width: number;
  height: number;
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
  album_type: string;
  total_tracks: number;
  release_date: string;
  release_date_precision: string;
  images: SpotifyImage[];
  artists: SpotifyArtist[];
  external_urls?: {
    spotify?: string;
  };
};

type SpotifyAlbumTracksResponse = {
  items: SpotifyTrack[];
  total: number;
  next: string | null;
};

async function getAlbum(id: string): Promise<SpotifyAlbum | null> {
  try {
    const album = await spotifyFetch(`/albums/${id}`, {
      market: "BR",
    });

    return album as SpotifyAlbum;
  } catch (error) {
    console.error("Album request error:", error);
    return null;
  }
}

async function getAlbumTracks(
  id: string
): Promise<SpotifyTrack[]> {
  try {
    const tracks: SpotifyTrack[] = [];

    let offset = 0;
    const limit = 50;

    while (true) {
      const data =
        (await spotifyFetch(
          `/albums/${id}/tracks`,
          {
            market: "BR",
            limit: String(limit),
            offset: String(offset),
          }
        )) as SpotifyAlbumTracksResponse;

      tracks.push(...data.items);

      if (!data.next || data.items.length === 0) {
        break;
      }

      offset += data.items.length;

      if (offset >= data.total) {
        break;
      }
    }

    return tracks;
  } catch (error) {
    console.error("Track request error:", error);
    return [];
  }
}

function formatTime(milliseconds: number) {
  const totalSeconds = Math.floor(
    milliseconds / 1000
  );

  const minutes = Math.floor(
    totalSeconds / 60
  );

  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function formatReleaseDate(date: string) {
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

function getTotalDuration(tracks: SpotifyTrack[]) {
  const total = tracks.reduce(
    (sum, track) => sum + track.duration_ms,
    0
  );

  const totalMinutes = Math.floor(
    total / 60000
  );

  return `${totalMinutes} min`;
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [album, tracks] = await Promise.all([
    getAlbum(id),
    getAlbumTracks(id),
  ]);

  if (!album) {
    return (
      <div className="min-h-screen bg-[#121212] text-white">
        <SiteHeader />

        <main className="pt-[113px] md:pt-[68px]">
          <div className="musicboxd-container flex min-h-[70vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#202020] text-2xl">
                ?
              </div>

              <h1 className="mt-5 text-2xl font-black">
                Album not found
              </h1>

              <p className="mt-2 text-sm text-[#888]">
                We couldn't find this album on Spotify.
              </p>

              <Link
                href="/"
                className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-black"
              >
                Back to Musicboxd
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const cover = album.images?.[0]?.url;

  const artist =
    album.artists?.map((item) => item.name).join(", ") ||
    "Unknown Artist";

  const year =
    album.release_date?.slice(0, 4) || "Unknown";

  const releaseDate = formatReleaseDate(
    album.release_date
  );

  const spotifyUrl =
    album.external_urls?.spotify || "#";

  const totalDuration =
    getTotalDuration(tracks);

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <SiteHeader />

      <main className="pt-[113px] md:pt-[68px]">

        {/* ======================================== */}
        {/* ALBUM HEADER */}
        {/* ======================================== */}

        <section className="relative overflow-hidden border-b border-[#292929]">

          {/* BLURRED BACKGROUND */}

          {cover && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <img
                src={cover}
                alt=""
                className="absolute inset-0 h-full w-full scale-125 object-cover opacity-[0.12] blur-3xl"
              />

              <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/70 via-[#121212]/90 to-[#121212]" />
            </div>
          )}

          <div className="relative mx-auto max-w-[1480px] px-5 py-8 sm:px-6 md:px-8 md:py-12 lg:px-10">

            <div className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)_280px] lg:gap-10">

              {/* ================================= */}
              {/* LEFT: COVER */}
              {/* ================================= */}

              <div>
                <div className="overflow-hidden rounded-2xl bg-[#1b1b1b] shadow-2xl shadow-black/50">
                  {cover ? (
                    <img
                      src={cover}
                      alt={`${album.name} cover`}
                      className="aspect-square w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-square w-full bg-[#222]" />
                  )}
                </div>

                {/* BASIC STATS */}

                <div className="mt-5 grid grid-cols-2 gap-3">

                  <StatCard
                    value={String(album.total_tracks)}
                    label="Tracks"
                  />

                  <StatCard
                    value={year}
                    label="Released"
                  />

                </div>

                <div className="mt-3 rounded-xl border border-[#292929] bg-[#181818] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#666]">
                    Album type
                  </p>

                  <p className="mt-1 text-sm font-bold capitalize">
                    {album.album_type}
                  </p>
                </div>
              </div>

              {/* ================================= */}
              {/* CENTER: ALBUM INFO */}
              {/* ================================= */}

              <div className="flex min-w-0 flex-col justify-center">

                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1db954]">
                  {album.album_type}
                </p>

                <h1 className="mt-3 text-4xl font-black leading-[0.98] tracking-[-0.04em] sm:text-5xl md:text-6xl">
                  {album.name}
                </h1>

                <p className="mt-4 text-xl font-bold text-white">
                  {artist}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[#888]">
                  <span>{year}</span>

                  <span className="text-[#444]">
                    •
                  </span>

                  <span>
                    {album.total_tracks} tracks
                  </span>

                  {tracks.length > 0 && (
                    <>
                      <span className="text-[#444]">
                        •
                      </span>

                      <span>
                        {totalDuration}
                      </span>
                    </>
                  )}
                </div>

                <p className="mt-7 max-w-2xl text-sm leading-7 text-[#999]">
                  {album.name} by {artist}. Explore
                  the complete tracklist, listen on Spotify
                  and keep your own Musicboxd history for
                  this album.
                </p>

                {/* ARTIST */}

                <div className="mt-8 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#242424] text-sm font-black text-[#1db954]">
                    {artist.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-xs text-[#666]">
                      Artist
                    </p>

                    <p className="text-sm font-bold">
                      {artist}
                    </p>
                  </div>
                </div>

              </div>

              {/* ================================= */}
              {/* RIGHT: ACTIONS */}
              {/* ================================= */}

              <div className="lg:self-center">

                <div className="rounded-2xl border border-[#292929] bg-[#181818]/90 p-5 backdrop-blur-xl">

                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666]">
                    Your activity
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">

                    <button
                      type="button"
                      className="rounded-xl bg-white px-4 py-3 text-xs font-black text-black transition hover:bg-[#ddd]"
                    >
                      LOG
                    </button>

                    <button
                      type="button"
                      className="rounded-xl border border-[#383838] px-4 py-3 text-xs font-black text-white transition hover:bg-[#242424]"
                    >
                      ♡ LIKE
                    </button>

                  </div>

                  <button
                    type="button"
                    className="mt-2 w-full rounded-xl border border-[#383838] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#242424]"
                  >
                    + ADD TO LIST
                  </button>

                  <a
                    href={spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 flex w-full items-center justify-center rounded-xl bg-[#1db954] px-4 py-3 text-xs font-black text-black transition hover:bg-[#1ed760]"
                  >
                    ▶ PLAY ON SPOTIFY
                  </a>

                  <div className="my-5 h-px bg-[#292929]" />

                  {/* RATING */}

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#666]">
                      Musicboxd rating
                    </p>

                    <div className="mt-3 flex items-end gap-3">
                      <span className="text-4xl font-black">
                        —
                      </span>

                      <span className="pb-1 text-xs text-[#777]">
                        No ratings yet
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 space-y-2">
                    <RatingBar
                      stars="5"
                      percentage={0}
                    />

                    <RatingBar
                      stars="4"
                      percentage={0}
                    />

                    <RatingBar
                      stars="3"
                      percentage={0}
                    />

                    <RatingBar
                      stars="2"
                      percentage={0}
                    />

                    <RatingBar
                      stars="1"
                      percentage={0}
                    />
                  </div>

                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ======================================== */}
        {/* MAIN CONTENT */}
        {/* ======================================== */}

        <div className="musicboxd-container py-10 md:py-14">

          <div className="mx-auto max-w-[1000px]">

            {/* ================================= */}
            {/* TRACKLIST */}
            {/* ================================= */}

            <section>

              <div className="mb-5 flex items-end justify-between">

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1db954]">
                    THE ALBUM
                  </p>

                  <h2 className="mt-1 text-2xl font-black md:text-3xl">
                    Tracklist
                  </h2>
                </div>

                <span className="text-xs font-bold text-[#666]">
                  {tracks.length} tracks
                </span>

              </div>

              <div className="overflow-hidden rounded-2xl border border-[#292929] bg-[#181818]">

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
                        className="group flex items-center gap-4 border-b border-[#292929] px-4 py-4 transition-colors last:border-b-0 hover:bg-[#202020] sm:px-6"
                      >

                        {/* NUMBER */}

                        <span className="w-6 shrink-0 text-center text-xs font-bold tabular-nums text-[#555] group-hover:text-[#1db954]">
                          {String(
                            track.track_number
                          ).padStart(2, "0")}
                        </span>

                        {/* PLAY */}

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs text-[#555] transition-colors group-hover:bg-[#1db954] group-hover:text-black">
                          ▶
                        </div>

                        {/* NAME */}

                        <div className="min-w-0 flex-1">

                          <p className="truncate text-sm font-bold text-white">
                            {track.name}
                          </p>

                          <p className="mt-0.5 truncate text-xs text-[#666]">
                            {track.artists
                              .map(
                                (item) =>
                                  item.name
                              )
                              .join(", ")}

                            {track.explicit && (
                              <span className="ml-2 rounded bg-[#303030] px-1.5 py-0.5 text-[9px] font-bold">
                                E
                              </span>
                            )}
                          </p>

                        </div>

                        {/* DURATION */}

                        <span className="shrink-0 text-xs font-medium tabular-nums text-[#666]">
                          {formatTime(
                            track.duration_ms
                          )}
                        </span>

                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <p className="text-sm font-bold">
                      Tracklist unavailable
                    </p>

                    <p className="mt-2 text-xs text-[#666]">
                      Spotify couldn't return the tracks
                      for this album.
                    </p>
                  </div>
                )}

              </div>
            </section>

            {/* ================================= */}
            {/* COMMUNITY */}
            {/* ================================= */}

            <section className="mt-14 md:mt-20">

              <div className="mb-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1db954]">
                  COMMUNITY
                </p>

                <h2 className="mt-1 text-2xl font-black md:text-3xl">
                  Recent activity
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">

                <CommunityCard
                  username="musicboxd"
                  rating="★★★★★"
                  text="No reviews yet. Be the first person to log this album."
                />

                <CommunityCard
                  username="musicboxd"
                  rating="★★★★½"
                  text="Community reviews and listening activity will appear here."
                />

              </div>

            </section>

            {/* ================================= */}
            {/* ALBUM DETAILS */}
            {/* ================================= */}

            <section className="mt-14 border-t border-[#292929] pt-10 md:mt-20">

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1db954]">
                DETAILS
              </p>

              <h2 className="mt-1 text-2xl font-black">
                Album information
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

                <DetailCard
                  label="Release date"
                  value={releaseDate}
                />

                <DetailCard
                  label="Type"
                  value={album.album_type}
                />

                <DetailCard
                  label="Tracks"
                  value={String(
                    album.total_tracks
                  )}
                />

                <DetailCard
                  label="Duration"
                  value={totalDuration}
                />

              </div>

            </section>

          </div>

        </div>

        {/* ======================================== */}
        {/* FOOTER */}
        {/* ======================================== */}

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
              <Link
                href="/"
                className="transition-colors hover:text-[#a7a7a7]"
              >
                Home
              </Link>

              <Link
                href="/lists"
                className="transition-colors hover:text-[#a7a7a7]"
              >
                Lists
              </Link>

              <a
                href={spotifyUrl}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-[#a7a7a7]"
              >
                Spotify
              </a>
            </div>

            <span>
              © 2026 Musicboxd
            </span>

          </div>

        </footer>

      </main>
    </div>
  );
}

/* ======================================== */
/* STAT CARD                                */
/* ======================================== */

function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-[#292929] bg-[#181818] p-4">
      <p className="text-xl font-black">
        {value}
      </p>

      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#666]">
        {label}
      </p>
    </div>
  );
}

/* ======================================== */
/* RATING BAR                               */
/* ======================================== */

function RatingBar({
  stars,
  percentage,
}: {
  stars: string;
  percentage: number;
}) {
  return (
    <div className="flex items-center gap-2">

      <span className="w-3 text-[10px] font-bold text-[#777]">
        {stars}
      </span>

      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#292929]">
        <div
          className="h-full rounded-full bg-[#777]"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

    </div>
  );
}

/* ======================================== */
/* COMMUNITY CARD                           */
/* ======================================== */

function CommunityCard({
  username,
  rating,
  text,
}: {
  username: string;
  rating: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#292929] bg-[#181818] p-5">

      <div className="flex items-center gap-3">

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#252525] text-xs font-black text-[#1db954]">
          {username.charAt(0).toUpperCase()}
        </div>

        <div>
          <p className="text-xs font-bold">
            {username}
          </p>

          <p className="mt-0.5 text-[11px] tracking-wide text-[#1db954]">
            {rating}
          </p>
        </div>

      </div>

      <p className="mt-4 text-sm leading-6 text-[#999]">
        {text}
      </p>

    </div>
  );
}

/* ======================================== */
/* DETAIL CARD                              */
/* ======================================== */

function DetailCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#292929] bg-[#181818] p-4">

      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#666]">
        {label}
      </p>

      <p className="mt-2 text-sm font-bold capitalize">
        {value}
      </p>

    </div>
  );
}