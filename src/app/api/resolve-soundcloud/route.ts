import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const trackId = request.nextUrl.searchParams.get("trackId");
  const clientId = request.nextUrl.searchParams.get("clientId");

  if (!trackId || !clientId) {
    return NextResponse.json({ error: "Missing trackId or clientId" }, { status: 400 });
  }

  try {
    const trackRes = await fetch(
      `https://api-v2.soundcloud.com/tracks/${trackId}?client_id=${clientId}`,
      { headers: { "User-Agent": "Mozilla/5.0" }, next: { revalidate: 3600 } }
    );
    if (!trackRes.ok) {
      return NextResponse.json(
        { error: `SoundCloud API error: ${trackRes.status}` },
        { status: trackRes.status }
      );
    }
    const trackData = await trackRes.json();

    const progressive = trackData.media?.transcodings?.find(
      (t: any) => t.format?.protocol === "progressive"
    );
    if (!progressive?.url) {
      return NextResponse.json({ error: "No progressive stream found" }, { status: 404 });
    }

    const streamRes = await fetch(`${progressive.url}?client_id=${clientId}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!streamRes.ok) {
      return NextResponse.json(
        { error: `Stream resolution error: ${streamRes.status}` },
        { status: streamRes.status }
      );
    }
    const streamData = await streamRes.json();

    return NextResponse.json({ url: streamData.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
