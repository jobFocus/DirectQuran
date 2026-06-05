"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface ControlsProps {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  progressSeconds: number;
  durationSeconds: number;
  hasNext: boolean;
  hasPrev: boolean;
  isFullscreen: boolean;
  fullscreenSupported: boolean;
  onPlayPause: () => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
  onToggleFullscreen: () => void;
  visible: boolean;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface IconProps {
  size?: number;
}

function PlayIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function SkipPrevIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
    </svg>
  );
}

function SkipNextIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  );
}

function VolumeIcon({ size = 24, muted }: IconProps & { muted: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      {muted ? (
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
      ) : (
        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
      )}
    </svg>
  );
}

function FullscreenIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
    </svg>
  );
}

function ExitFullscreenIcon({ size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
    </svg>
  );
}

export default function Controls({
  isPlaying,
  volume,
  isMuted,
  progressSeconds,
  durationSeconds,
  hasNext,
  hasPrev,
  isFullscreen,
  fullscreenSupported,
  onPlayPause,
  onVolumeChange,
  onToggleMute,
  onNext,
  onPrev,
  onSeek,
  onToggleFullscreen,
  visible,
}: ControlsProps) {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = progressRef.current?.getBoundingClientRect();
      if (!rect) return;
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onSeek(ratio * (durationSeconds || 0));
    },
    [durationSeconds, onSeek]
  );

  const progress = durationSeconds > 0 ? (progressSeconds / durationSeconds) * 100 : 0;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
        padding: "2.5rem 1.5rem 1.5rem",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        pointerEvents: show ? "auto" : "none",
      }}
    >
      {/* Progress bar */}
      <div
        ref={progressRef}
        onClick={handleProgressClick}
        style={{
          width: "100%",
          height: 4,
          background: "rgba(255,255,255,0.15)",
          borderRadius: 2,
          cursor: "pointer",
          marginBottom: "1rem",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "var(--color-accent)",
            borderRadius: 2,
            transition: "width 0.3s linear",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: `${progress}%`,
            width: 12,
            height: 12,
            background: "var(--color-accent)",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            opacity: show ? 1 : 0,
            transition: "opacity 0.2s",
          }}
        />
      </div>

      {/* Time display */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.75rem",
          color: "var(--color-text-muted)",
          marginBottom: "0.75rem",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <span>{formatTime(progressSeconds)}</span>
        <span>{formatTime(durationSeconds)}</span>
      </div>

      {/* Buttons row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        {/* Previous */}
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          aria-label="Previous track"
          style={{
            opacity: hasPrev ? 1 : 0.3,
            transition: "opacity 0.2s",
            padding: "0.5rem",
          }}
        >
          <SkipPrevIcon size={22} />
        </button>

        {/* Play/Pause */}
        <button
          onClick={onPlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "var(--color-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {isPlaying ? <PauseIcon size={26} /> : <PlayIcon size={26} />}
        </button>

        {/* Next */}
        <button
          onClick={onNext}
          disabled={!hasNext}
          aria-label="Next track"
          style={{
            opacity: hasNext ? 1 : 0.3,
            transition: "opacity 0.2s",
            padding: "0.5rem",
          }}
        >
          <SkipNextIcon size={22} />
        </button>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Volume */}
        <div
          style={{ position: "relative", display: "flex", alignItems: "center" }}
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          <button onClick={onToggleMute} aria-label={isMuted ? "Unmute" : "Mute"}>
            <VolumeIcon size={20} muted={isMuted} />
          </button>
          <div
            style={{
              width: showVolumeSlider ? 80 : 0,
              overflow: "hidden",
              transition: "width 0.2s ease",
              marginLeft: showVolumeSlider ? "0.5rem" : 0,
            }}
          >
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              aria-label="Volume"
              style={{ width: 80, accentColor: "var(--color-accent)" }}
            />
          </div>
        </div>

        {/* Fullscreen */}
        {fullscreenSupported && (
          <button
            onClick={onToggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <ExitFullscreenIcon size={20} /> : <FullscreenIcon size={20} />}
          </button>
        )}
      </div>
    </div>
  );
}
