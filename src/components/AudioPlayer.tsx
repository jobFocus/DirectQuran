"use client";

import { useRef, useEffect, useCallback } from "react";
import type { AudioTrack } from "@/types";

interface AudioPlayerProps {
  track: AudioTrack | null;
  src?: string;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onEnded: () => void;
  onError: (message: string) => void;
  onLoaded: (duration: number) => void;
}

const FALLBACK_URLS: Record<string, string[]> = {
  hazza: [
    "https://server11.mp3quran.net/download/hazza/{surah}.mp3",
    "https://server8.mp3quran.net/afs/{surah}.mp3",
    "https://server6.mp3quran.net/hazza/{surah}.mp3",
  ],
};

function formatSurah(num: number): string {
  return String(num).padStart(3, "0");
}

export default function AudioPlayer({
  track,
  src,
  isPlaying,
  volume,
  isMuted,
  onTimeUpdate,
  onEnded,
  onError,
  onLoaded,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const retryCountRef = useRef(0);
  const maxRetriesRef = useRef(3);
  const fallbackUrlsRef = useRef<string[]>([]);

  const getNextUrl = useCallback(() => {
    if (retryCountRef.current === 0 && src) return src;
    if (!track) return "";

    const fallbacks = FALLBACK_URLS[track.reciterId] ?? [];
    const idx = retryCountRef.current - 1;
    if (idx >= 0 && idx < fallbacks.length) {
      return fallbacks[idx].replace("{surah}", formatSurah(track.surahNumber));
    }
    return "";
  }, [track, src]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = volume;
    el.muted = isMuted;
  }, [volume, isMuted]);

  useEffect(() => {
    if (!src && !track) {
      retryCountRef.current = 0;
      return;
    }

    const el = audioRef.current;
    if (!el) return;

    retryCountRef.current = 0;

    const handleTimeUpdate = () => {
      onTimeUpdate(el.currentTime, el.duration || 0);
    };
    const handleEnded = () => onEnded();
    const handleError = () => {
      if (retryCountRef.current < maxRetriesRef.current) {
        retryCountRef.current++;
        const nextUrl = getNextUrl();
        if (nextUrl) {
          const delay = Math.min(300 * Math.pow(2, retryCountRef.current - 1), 3000);
          setTimeout(() => {
            el.src = nextUrl;
            el.load();
            if (isPlaying) {
              el.play().catch(() => {});
            }
          }, delay);
          return;
        }
      }
      onError("Audio failed to load. Please check your connection.");
    };
    const handleLoadedMetadata = () => {
      retryCountRef.current = 0;
      onLoaded(el.duration || 0);
    };

    el.addEventListener("timeupdate", handleTimeUpdate);
    el.addEventListener("ended", handleEnded);
    el.addEventListener("error", handleError);
    el.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      el.removeEventListener("timeupdate", handleTimeUpdate);
      el.removeEventListener("ended", handleEnded);
      el.removeEventListener("error", handleError);
      el.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [track, src, onTimeUpdate, onEnded, onError, onLoaded, isPlaying, getNextUrl]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    if (isPlaying) {
      el.play().catch(() => {
        if (retryCountRef.current === 0) {
          onError("Playback blocked. Please interact with the page.");
        }
      });
    } else {
      el.pause();
    }
  }, [isPlaying, onError]);

  const audioSrc = src ?? "";

  return (
    <audio
      ref={audioRef}
      key={track?.id ?? "no-track"}
      src={audioSrc}
      preload="auto"
      crossOrigin="anonymous"
      style={{ display: "none" }}
    />
  );
}
