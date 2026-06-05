"use client";

import { useRef, useEffect, useCallback } from "react";
import type { VideoClip } from "@/types";

interface VideoBackgroundProps {
  videos: VideoClip[];
  currentIndex: number;
  isPlaying: boolean;
  onVideoEnded: () => void;
}

export default function VideoBackground({
  videos,
  currentIndex,
  isPlaying,
  onVideoEnded,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentVideo = videos[currentIndex];

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const handleEnded = () => onVideoEnded();
    el.addEventListener("ended", handleEnded);
    return () => el.removeEventListener("ended", handleEnded);
  }, [onVideoEnded]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (isPlaying) {
      el.play().catch(() => {
        // Autoplay may be blocked; parent handles this
      });
    } else {
      el.pause();
    }
  }, [isPlaying, currentIndex]);

  // Reset video when index changes
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = 0;
    if (isPlaying) {
      el.play().catch(() => {});
    }
  }, [currentIndex, isPlaying]);

  const handleError = useCallback(() => {
    onVideoEnded();
  }, [onVideoEnded]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        background: "var(--color-bg)",
      }}
    >
      <video
        ref={videoRef}
        key={currentVideo?.id}
        src={currentVideo?.url}
        muted
        loop={false}
        playsInline
        preload="auto"
        onError={handleError}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
