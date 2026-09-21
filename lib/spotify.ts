let cachedToken: {
  accessToken: string;
  expiresAt: number;
} | null = null;

export async function getSpotifyToken() {
  if (
    cachedToken &&
    cachedToken.expiresAt > Date.now() + 60_000
  ) {
    return cachedToken.accessToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Spotify credentials are missing");
  }

  const credentials = Buffer.from(
    `${clientId}:${clientSecret}`
  ).toString("base64");

  const response = await fetch(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Spotify authentication failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  cachedToken = {
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return cachedToken.accessToken;
}

export async function spotifyFetch(
  path: string,
  params?: Record<string, string>
) {
  const token = await getSpotifyToken();

  const url = new URL(
    `https://api.spotify.com/v1${path}`
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    next: {
      revalidate: 3600,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Spotify request failed with status ${response.status}: ${errorText}`
    );
  }

  return response.json();
}