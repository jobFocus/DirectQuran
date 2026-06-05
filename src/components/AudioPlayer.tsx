"use client";

import { useRef, useEffect, useCallback } from "react";
import type { AudioTrack } from "@/types";

interface AudioPlayerProps {
  track: AudioTrack;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  onTimeUpdate: (currentTime: number, duration: number) => void;
  onEnded: () => void;
  onError: (message: string) => void;
  onLoaded: (duration: number) => void;
}

export default function AudioPlayer({
  track,
  isPlaying,
  volume,
  isMuted,
  onTimeUpdate,
  onEnded,
  onError,
  onLoaded,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    el.volume = volume;
    el.muted = isMuted;
  }, [volume, isMuted]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const handleTimeUpdate = () => {
      onTimeUpdate(el.currentTime, el.duration || 0);
    };
    const handleEnded = () => onEnded();
    const handleError = () => {
      onError("Audio failed to load. Please check your connection.");
    };
    const handleLoadedMetadata = () => {
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
  }, [onTimeUpdate, onEnded, onError, onLoaded]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    if (isPlaying) {
      el.play().catch(() => {
        onError("Playback blocked. Please interact with the page.");
      });
    } else {
      el.pause();
    }
  }, [isPlaying, onError]);

  return (
    <audio
      ref={audioRef}
      key={track.id}
      src={track.url}
      preload="auto"
      style={{ display: "none" }}
    />
  );
}
