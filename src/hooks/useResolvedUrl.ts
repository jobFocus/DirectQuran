"use client";

import { useState, useEffect } from "react";
import type { AudioTrack, Reciter } from "@/types";

const resolvedCache = new Map<string, string>();

async function resolveSoundCloudUrlViaProxy(trackId: string, clientId: string): Promise<string> {
  const cacheKey = `sc:${trackId}`;
  const cached = resolvedCache.get(cacheKey);
  if (cached) return cached;

  const res = await fetch(
    `/api/resolve-soundcloud?trackId=${trackId}&clientId=${clientId}`
  );
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Failed to resolve SoundCloud URL (${res.status})`);
  }
  const data = await res.json();
  resolvedCache.set(cacheKey, data.url);
  return data.url;
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
          const resolved = await resolveSoundCloudUrlViaProxy(track.soundcloudTrackId, reciter.clientId);
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
