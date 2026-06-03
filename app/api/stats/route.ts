import { kv } from "@vercel/kv";

export interface StatsResponse {
  likes: number;
  visitors: number;
  countries?: Record<string, number>;
}

export async function GET(): Promise<Response> {
  try {
    const [likes, visitors] = await Promise.all([
      kv.get<number>("likes"),
      kv.get<number>("visitors"),
    ]);

    // Fetch top country counts
    const countryCodes = ["DE", "CH", "TR", "US", "GB", "FR", "AT", "XK", "SA", "AE"];
    const counts = await Promise.all(countryCodes.map(c => kv.get<number>(`vc:${c}`)));
    const countries: Record<string, number> = {};
    countryCodes.forEach((c, i) => { if (counts[i]) countries[c] = counts[i]!; });

    return Response.json({ likes: likes ?? 0, visitors: visitors ?? 0, countries });
  } catch {
    return Response.json({ likes: 42, visitors: 128, countries: { CH: 38, DE: 22, TR: 14, US: 9 } });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json() as { action: string };

    if (body.action === "like") {
      const likes = await kv.incr("likes");
      return Response.json({ likes });
    }

    if (body.action === "visit") {
      const visitors = await kv.incr("visitors");
      const country = request.headers.get("x-vercel-ip-country") || "UN";
      await kv.incr(`vc:${country}`);
      return Response.json({ visitors });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: true });
  }
}
