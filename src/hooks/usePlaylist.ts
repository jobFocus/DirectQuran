"use client";

import { useState, useCallback, useRef } from "react";
import type { AudioTrack, VideoClip, PlayerStatus } from "@/types";

interface UsePlaylistOptions {
  audioTracks: AudioTrack[];
  videos: VideoClip[];
}

interface UsePlaylistReturn {
  currentTrackIndex: number;
  currentVideoIndex: number;
  status: PlayerStatus;
  error: string | null;
  nextTrack: () => void;
  prevTrack: () => void;
  nextVideo: () => void;
  setStatus: (status: PlayerStatus) => void;
  setError: (error: string | null) => void;
  hasNextTrack: boolean;
  hasPrevTrack: boolean;
}

export function usePlaylist({
  audioTracks,
  videos,
}: UsePlaylistOptions): UsePlaylistReturn {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const videoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearVideoTimer = useCallback(() => {
    if (videoTimerRef.current !== null) {
      clearInterval(videoTimerRef.current);
      videoTimerRef.current = null;
    }
  }, []);

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => {
      if (prev < audioTracks.length - 1) {
        setError(null);
        return prev + 1;
      }
      return prev;
    });
  }, [audioTracks.length]);

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex((prev) => {
      if (prev > 0) {
        setError(null);
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const nextVideo = useCallback(() => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  }, [videos.length]);

  const hasNextTrack = currentTrackIndex < audioTracks.length - 1;
  const hasPrevTrack = currentTrackIndex > 0;

  return {
    currentTrackIndex,
    currentVideoIndex,
    status,
    error,
    nextTrack,
    prevTrack,
    nextVideo,
    setStatus,
    setError,
    hasNextTrack,
    hasPrevTrack,
  };
}
