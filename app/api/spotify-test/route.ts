import { NextResponse } from "next/server";
import { getSpotifyToken } from "../../../lib/spotify";

export async function GET() {
  try {
    const token = await getSpotifyToken();

    return NextResponse.json({
      success: true,
      message: "Spotify conectado com sucesso!",
      tokenReceived: Boolean(token),
    });
  } catch (error) {
    console.error("Spotify test error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Falha ao conectar com o Spotify.",
      },
      { status: 500 }
    );
  }
}