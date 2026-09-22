import Link from "next/link";
import Image from "next/image";
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
};

type SpotifyTrack = {
  id: string;
  name: string;
  track_number: number;
  duration_ms: number;
  artists: SpotifyArtist[];
};

type SpotifyAlbum = {
  id: string;
  name: string;
  album_type: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  images: SpotifyImage[];
  artists: SpotifyArtist[];
  tracks?: {
    items: SpotifyTrack[];
    total: number;
  };
  external_urls?: {
    spotify?: string;
  };
};

async function getAlbum(
  id: string
): Promise<SpotifyAlbum | null> {
  try {
    const data = (await spotifyFetch(`/albums/${id}`, {
      market: "BR",
    })) as SpotifyAlbum;

    return data;
  } catch (error) {
    console.error("Spotify album request failed:", error);
    return null;
  }
}

function formatTrackDuration(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function getTotalDuration(tracks: SpotifyTrack[]) {
  const totalMilliseconds = tracks.reduce(
    (total, track) => total + track.duration_ms,
    0
  );

  return formatTrackDuration(totalMilliseconds);
}

function formatReleaseDate(date: string) {
  if (!date) return "";

  const parts = date.split("-");

  if (parts.length === 1) {
    return parts[0];
  }

  if (parts.length === 2) {
    return `${parts[1]}/${parts[0]}`;
  }

  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function getArtistNames(artists: SpotifyArtist[]) {
  return artists.map((artist) => artist.name).join(", ");
}

function getAlbumType(type: string) {
  if (type === "album") return "Album";
  if (type === "single") return "Single";
  if (type === "compilation") return "Compilation";

  return type;
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const album = await getAlbum(id);

  if (!album) {
    return (
      <div className="min-h-screen bg-[#121212] text-white">
        <SiteHeader />

        <main className="pt-[62px]">
          <div className="musicboxd-container flex min-h-[70vh] items-center justify-center py-20">
            <div className="max-w-md text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#1db954]">
                MUSICBOXD
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight">
                Album not found
              </h1>

              <p className="mt-4 text-sm leading-6 text-[#888]">
                We couldn't load this album from Spotify.
              </p>

              <Link
                href="/musics"
                className="mt-7 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-[1.02]"
              >
                Back to Musics
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const tracks = album.tracks?.items ?? [];

  const cover =
    album.images?.[0]?.url ?? "/musicboxd-logo.png";

  const artist = getArtistNames(album.artists);

  const year =
    album.release_date?.slice(0, 4) ?? "";

  const releaseDate =
    formatReleaseDate(album.release_date);

  const duration =
    tracks.length > 0
      ? getTotalDuration(tracks)
      : "--:--";

  const albumType = getAlbumType(
    album.album_type
  );

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <SiteHeader />

      <main className="pt-[62px]">

        {/* ================================================== */}
        {/* ALBUM HERO                                         */}
        {/* ================================================== */}

        <section className="relative overflow-hidden border-b border-[#242424]">

          {/* BACKGROUND */}

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <img
              src={cover}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-[0.12] blur-[70px]"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-[#121212]/45 via-[#121212]/85 to-[#121212]" />
          </div>

          {/* CONTENT */}

          <div className="musicboxd-container relative py-10 md:py-14 lg:py-16">

            <div className="grid gap-8 md:grid-cols-[300px_minmax(0,1fr)] md:items-end md:gap-10 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-12">

              {/* COVER */}

              <div className="mx-auto w-full max-w-[300px] md:mx-0 md:max-w-none lg:w-[340px]">

                <div className="group relative overflow-hidden rounded-2xl bg-[#1b1b1b] shadow-2xl shadow-black/40">

                  <img
                    src={cover}
                    alt={`${album.name} cover`}
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />

                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />

                </div>

              </div>

              {/* ALBUM INFO */}

              <div className="min-w-0 pb-1">

                {/* TYPE */}

                <div className="mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1db954]">
                    {albumType}
                  </span>
                </div>

                {/* TITLE */}

                <h1 className="max-w-4xl text-4xl font-black leading-[0.96] tracking-[-0.045em] sm:text-5xl md:text-6xl">
                  {album.name}
                </h1>

                {/* ARTIST */}

                <p className="mt-4 text-lg font-semibold text-[#b3b3b3] md:text-xl">
                  {artist}
                </p>

                {/* METADATA */}

                <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-[#8c8c8c]">

                  <span>{year}</span>

                  <span className="text-[#4c4c4c]">
                    •
                  </span>

                  <span>
                    {album.total_tracks}{" "}
                    {album.total_tracks === 1
                      ? "track"
                      : "tracks"}
                  </span>

                  <span className="text-[#4c4c4c]">
                    •
                  </span>

                  <span>{duration}</span>

                  <span className="text-[#4c4c4c]">
                    •
                  </span>

                  <span>{releaseDate}</span>

                </div>

                {/* RATING */}

                <div className="mt-7 flex flex-wrap items-center gap-5">

                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-black">
                        —
                      </span>

                      <span className="text-xs font-bold text-[#555]">
                        / 5
                      </span>
                    </div>

                    <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-[#555]">
                      Community rating
                    </p>
                  </div>

                  <div className="h-9 w-px bg-[#333]" />

                  <div>
                    <p className="text-xs font-semibold text-[#ddd]">
                      No ratings yet
                    </p>

                    <p className="mt-1 text-[11px] text-[#666]">
                      Be the first to rate this album.
                    </p>
                  </div>

                </div>

                {/* ACTIONS */}

                <div className="mt-7 flex flex-wrap gap-2.5">

                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-full bg-white px-5 text-xs font-bold text-black transition-transform hover:scale-[1.02]"
                  >
                    ★ Rate
                  </button>

                  <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-full border border-[#3a3a3a] bg-[#181818]/80 px-5 text-xs font-bold text-white transition-colors hover:border-[#666] hover:bg-[#212121]"
                  >
                    + Add to list
                  </button>

                  {album.external_urls?.spotify && (
                    <a
                      href={album.external_urls.spotify}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-10 items-center justify-center rounded-full border border-[#3a3a3a] bg-[#181818]/80 px-5 text-xs font-bold text-white transition-colors hover:border-[#666] hover:bg-[#212121]"
                    >
                      Open Spotify
                    </a>
                  )}

                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ================================================== */}
        {/* MAIN CONTENT                                       */}
        {/* ================================================== */}

        <div className="musicboxd-container py-10 md:py-14">

          {/* TRACKLIST */}

          <section>

            <div className="mb-6 flex items-end justify-between gap-4">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1db954]">
                  THE ALBUM
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-[-0.025em]">
                  Tracklist
                </h2>
              </div>

              <span className="text-xs font-medium text-[#666]">
                {tracks.length} tracks
              </span>

            </div>

            <div className="overflow-hidden rounded-2xl border border-[#292929] bg-[#181818]">

              {tracks.length > 0 ? (
                tracks.map((track, index) => (
                  <div
                    key={track.id}
                    className="group flex items-center gap-4 border-b border-[#252525] px-4 py-3.5 transition-colors last:border-b-0 hover:bg-[#1d1d1d] md:px-5"
                  >

                    {/* NUMBER */}

                    <span className="w-6 shrink-0 text-center text-xs tabular-nums text-[#555] group-hover:text-[#1db954]">
                      {track.track_number || index + 1}
                    </span>

                    {/* NAME */}

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-semibold text-[#eee]">
                        {track.name}
                      </p>

                      {track.artists?.length > 0 &&
                        getArtistNames(track.artists) !== artist && (
                          <p className="mt-0.5 truncate text-[10px] text-[#666]">
                            {getArtistNames(track.artists)}
                          </p>
                        )}

                    </div>

                    {/* DURATION */}

                    <span className="shrink-0 text-xs tabular-nums text-[#555]">
                      {formatTrackDuration(
                        track.duration_ms
                      )}
                    </span>

                  </div>
                ))
              ) : (
                <div className="px-6 py-10 text-center text-sm text-[#777]">
                  Tracklist unavailable.
                </div>
              )}

            </div>

          </section>

          {/* REVIEWS */}

          <section className="mt-14 md:mt-16">

            <div className="mb-6">

              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1db954]">
                COMMUNITY
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-[-0.025em]">
                Reviews
              </h2>

            </div>

            <div className="rounded-2xl border border-[#292929] bg-[#181818] p-7 md:p-9">

              <div className="mx-auto max-w-xl text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#212121] text-[#777]">
                  ✎
                </div>

                <h3 className="mt-4 text-base font-bold">
                  No reviews yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#777]">
                  Be the first person to write a review
                  for this album.
                </p>

                <button
                  type="button"
                  className="mt-5 rounded-full bg-[#212121] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#292929]"
                >
                  Write a review
                </button>

              </div>

            </div>

          </section>

          {/* ACTIVITY */}

          <section className="mt-14 md:mt-16">

            <div className="mb-6">

              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1db954]">
                COMMUNITY
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-[-0.025em]">
                Activity
              </h2>

            </div>

            <div className="rounded-2xl border border-[#292929] bg-[#181818] px-6 py-8">

              <p className="text-center text-sm text-[#666]">
                Ratings, reviews and listening activity
                will appear here.
              </p>

            </div>

          </section>

        </div>

        {/* ================================================== */}
        {/* FOOTER                                             */}
        {/* ================================================== */}

        <footer className="border-t border-[#242424]">

          <div className="musicboxd-container flex flex-col gap-5 py-8 text-xs text-[#626262] sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2">

              <Image
                src="/musicboxd-logo.png"
                alt="Musicboxd"
                width={24}
                height={24}
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
                About
              </Link>

              <Link
                href="/"
                className="transition-colors hover:text-[#a7a7a7]"
              >
                Privacy
              </Link>

              <Link
                href="/"
                className="transition-colors hover:text-[#a7a7a7]"
              >
                Terms
              </Link>

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