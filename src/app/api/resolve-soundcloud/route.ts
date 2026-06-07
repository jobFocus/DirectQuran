import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID_REGEX = /client_id=([a-zA-Z0-9_-]+)/;

let cachedClientId: string | null = null;

async function getSoundCloudClientId(): Promise<string | null> {
  if (cachedClientId) return cachedClientId;

  try {
    const res = await fetch("https://soundcloud.com", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    const html = await res.text();
    const match = html.match(CLIENT_ID_REGEX);
    if (match) {
      cachedClientId = match[1];
      return cachedClientId;
    }
  } catch {}

  return null;
}

async function resolveTrack(trackId: string, clientId: string): Promise<string | null> {
  const trackRes = await fetch(
    `https://api-v2.soundcloud.com/tracks/${trackId}?client_id=${clientId}`,
    { headers: { "User-Agent": "Mozilla/5.0" } }
  );
  if (!trackRes.ok) return null;

  const trackData = await trackRes.json();
  const progressive = trackData.media?.transcodings?.find(
    (t: any) => t.format?.protocol === "progressive"
  );
  if (!progressive?.url) return null;

  const streamRes = await fetch(`${progressive.url}?client_id=${clientId}`, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!streamRes.ok) return null;

  const streamData = await streamRes.json();
  return streamData.url ?? null;
}

export async function GET(request: NextRequest) {
  const trackId = request.nextUrl.searchParams.get("trackId");
  const clientId = request.nextUrl.searchParams.get("clientId");

  if (!trackId) {
    return NextResponse.json({ error: "Missing trackId" }, { status: 400 });
  }

  // Try the provided client ID first
  if (clientId) {
    const url = await resolveTrack(trackId, clientId);
    if (url) {
      return NextResponse.json({ url });
    }
  }

  // Fallback: scrape a fresh client ID from SoundCloud and retry
  const freshId = await getSoundCloudClientId();
  if (freshId && freshId !== clientId) {
    const url = await resolveTrack(trackId, freshId);
    if (url) {
      return NextResponse.json({ url });
    }
  }

  return NextResponse.json(
    { error: "Could not resolve SoundCloud track. The client ID may have expired." },
    { status: 502 }
  );
}
