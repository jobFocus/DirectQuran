"use client";

import { useEffect } from "react";

interface TrackInfo {
  surahName: string;
  reciter: string;
}

interface MediaSessionHandlers {
  onPlay: () => void;
  onPause: () => void;
  onNextTrack: () => void;
  onPreviousTrack: () => void;
}

export function useMediaSession(
  track: TrackInfo | null,
  isPlaying: boolean,
  handlers: MediaSessionHandlers
) {
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    if (track) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.surahName,
        artist: track.reciter,
        album: "Quran",
      });
    }

    navigator.mediaSession.setActionHandler("play", () => handlers.onPlay());
    navigator.mediaSession.setActionHandler("pause", () => handlers.onPause());
    navigator.mediaSession.setActionHandler("nexttrack", () => handlers.onNextTrack());
    navigator.mediaSession.setActionHandler("previoustrack", () => handlers.onPreviousTrack());

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
      navigator.mediaSession.setActionHandler("previoustrack", null);
    };
  }, [track, isPlaying, handlers]);
}
