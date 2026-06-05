"use client";

import { useState, useEffect } from "react";
import type { AudioTrack, Reciter } from "@/types";

const resolvedCache = new Map<string, string>();

async function resolveSoundCloudUrl(trackId: string, clientId: string): Promise<string> {
  const cacheKey = `sc:${trackId}`;
  const cached = resolvedCache.get(cacheKey);
  if (cached) return cached;

  const trackRes = await fetch(
    `https://api-v2.soundcloud.com/tracks/${trackId}?client_id=${clientId}`
  );
  if (!trackRes.ok) throw new Error("Failed to fetch SoundCloud track");
  const trackData = await trackRes.json();

  const progressive = trackData.media?.transcodings?.find(
    (t: any) => t.format?.protocol === "progressive"
  );
  if (!progressive?.url) throw new Error("No progressive stream found");

  const streamRes = await fetch(`${progressive.url}?client_id=${clientId}`);
  if (!streamRes.ok) throw new Error("Failed to resolve stream URL");
  const streamData = await streamRes.json();

  resolvedCache.set(cacheKey, streamData.url);
  return streamData.url;
}

function buildDirectUrl(template: string, surahNumber: number): string {
  const padded = String(surahNumber).padStart(3, "0");
  return template.replace("{surah}", padded);
}

export function useResolvedUrl(track: AudioTrack | null, reciter: Reciter | null) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!track || !reciter) {
      setUrl(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setUrl(null);

    const resolve = async () => {
      try {
        if (reciter.type === "direct" && reciter.urlTemplate) {
          const resolved = buildDirectUrl(reciter.urlTemplate, track.surahNumber);
          if (!cancelled) setUrl(resolved);
        } else if (reciter.type === "soundcloud" && reciter.clientId && track.soundcloudTrackId) {
          const resolved = await resolveSoundCloudUrl(track.soundcloudTrackId, reciter.clientId);
          if (!cancelled) setUrl(resolved);
        } else {
          throw new Error("Cannot resolve URL: missing reciter or track info");
        }
      } catch (err: any) {
        if (!cancelled) setError(err.message ?? "Failed to resolve audio URL");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    resolve();

    return () => {
      cancelled = true;
    };
  }, [track?.id, reciter?.id]);

  return { url, loading, error };
}
