"use client";

import { useEffect, useState, useRef } from "react";

interface DisplayTrack {
  id: string;
  surahName: string;
  surahNameArabic?: string;
  surahNumber: number;
  reciter: string;
  reciterArabic?: string;
}

interface NowPlayingProps {
  track: DisplayTrack | null;
  visible: boolean;
}

export default function NowPlaying({ track, visible }: NowPlayingProps) {
  const [prevTrack, setPrevTrack] = useState(track);
  const [animating, setAnimating] = useState(false);
  const [animOut, setAnimOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (track?.id !== prevTrack?.id && prevTrack) {
      setAnimOut(true);
      timerRef.current = setTimeout(() => {
        setPrevTrack(track);
        setAnimOut(false);
        setAnimating(true);
        setTimeout(() => setAnimating(false), 500);
      }, 300);
    } else if (!prevTrack) {
      setPrevTrack(track);
      setAnimating(true);
      setTimeout(() => setAnimating(false), 500);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [track]);

  const currentTrack = track?.id === prevTrack?.id ? track : prevTrack;
  const isAnimating = track?.id !== prevTrack?.id && (animOut || animating);

  if (!currentTrack) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        padding: "2rem 1.5rem",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 100%)",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.5s ease",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          transform: isAnimating
            ? animOut
              ? "translateY(-10px)"
              : "translateY(10px)"
            : "translateY(0)",
          opacity: isAnimating ? (animOut ? 0 : 0) : 1,
          transition: "transform 0.3s ease, opacity 0.3s ease",
        }}
      >
        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--color-accent)",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: "0.25rem",
          }}
        >
          Now Playing
        </div>
        <h2
          style={{
            fontSize: "clamp(1rem, 3vw, 1.5rem)",
            fontWeight: 600,
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
            marginBottom: "0.15rem",
          }}
        >
          {currentTrack.surahName}
        </h2>
        {currentTrack.surahNameArabic && (
          <div
            style={{
              fontSize: "1.3rem",
              color: "var(--color-text-muted)",
              marginBottom: "0.15rem",
              fontFamily: "var(--font-display)",
            }}
          >
            {currentTrack.surahNameArabic}
          </div>
        )}
        <div
          style={{
            fontSize: "0.85rem",
            color: "var(--color-text-muted)",
          }}
        >
          {currentTrack.reciterArabic || currentTrack.reciter}
        </div>
      </div>
    </div>
  );
}
