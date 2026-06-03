const API_KEY = process.env.LASTFM_API_KEY ?? "2f391586ba209ea94615f9124a257191";
const USERNAME = process.env.LASTFM_USERNAME ?? "";

export interface LastFmResponse {
  playing: boolean;
  track?: {
    name: string;
    artist: string;
    album: string;
    image: string;
    url: string;
  };
}

export async function GET(): Promise<Response> {
  if (!USERNAME) {
    return Response.json({ playing: false, error: "LASTFM_USERNAME not set" });
  }

  try {
    const res = await fetch(
      `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      return Response.json({ playing: false });
    }

    const data = await res.json();
    const track = data?.recenttracks?.track?.[0];

    if (!track) {
      return Response.json({ playing: false });
    }

    const isPlaying = track["@attr"]?.nowplaying === "true";
    const images: Array<{ size: string; "#text": string }> = track.image ?? [];
    const image =
      images.find((img) => img.size === "extralarge")?.["#text"] ||
      images.find((img) => img.size === "large")?.["#text"] ||
      images.at(-1)?.["#text"] ||
      "";

    const result: LastFmResponse = {
      playing: isPlaying,
      track: {
        name: track.name ?? "",
        artist: track.artist?.["#text"] ?? "",
        album: track.album?.["#text"] ?? "",
        image,
        url: track.url ?? "",
      },
    };

    return Response.json(result);
  } catch {
    return Response.json({ playing: false });
  }
}
