import { NextRequest, NextResponse } from "next/server";
import { getSpotifyToken } from "../../../lib/spotify";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({
      results: [],
    });
  }

  try {
    const token = await getSpotifyToken();

    const spotifyUrl = new URL(
      "https://api.spotify.com/v1/search"
    );

    spotifyUrl.searchParams.set("q", query);
    spotifyUrl.searchParams.set(
      "type",
      "album,artist,track"
    );
    spotifyUrl.searchParams.set("market", "BR");
    spotifyUrl.searchParams.set("limit", "5");

    const response = await fetch(spotifyUrl.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "Spotify search error:",
        response.status,
        errorText
      );

      return NextResponse.json(
        {
          error: "Spotify search failed",
          results: [],
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    const albums = (data.albums?.items ?? []).map(
      (album: any) => ({
        id: album.id,
        title: album.name,
        artist: album.artists
          ?.map((artist: any) => artist.name)
          .join(", "),
        year: album.release_date?.slice(0, 4) ?? "",
        type: "Album",
        image:
          album.images?.[1]?.url ??
          album.images?.[0]?.url ??
          "",
        resultType: "album",
        spotifyUrl:
          album.external_urls?.spotify ?? "",
      })
    );

    const tracks = (data.tracks?.items ?? []).map(
      (track: any) => ({
        id: track.id,
        title: track.name,
        artist: track.artists
          ?.map((artist: any) => artist.name)
          .join(", "),
        year:
          track.album?.release_date?.slice(0, 4) ?? "",
        type: "Track",
        image:
          track.album?.images?.[1]?.url ??
          track.album?.images?.[0]?.url ??
          "",
        resultType: "track",
        albumId: track.album?.id ?? "",
        spotifyUrl:
          track.external_urls?.spotify ?? "",
      })
    );

    const artists = (data.artists?.items ?? []).map(
      (artist: any) => ({
        id: artist.id,
        title: artist.name,
        artist: "Artist",
        year: "",
        type: "Artist",
        image:
          artist.images?.[1]?.url ??
          artist.images?.[0]?.url ??
          "",
        resultType: "artist",
        spotifyUrl:
          artist.external_urls?.spotify ?? "",
      })
    );

    return NextResponse.json({
      results: [
        ...albums,
        ...tracks,
        ...artists,
      ],
    });
  } catch (error) {
    console.error("Musicboxd Spotify search error:", error);

    return NextResponse.json(
      {
        error: "Search failed",
        results: [],
      },
      { status: 500 }
    );
  }
}