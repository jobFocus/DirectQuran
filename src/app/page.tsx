"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import type { PlaylistManifest, PlayerStatus } from "@/types";
import manifestData from "@/data/manifest";
import { SURAH_NAMES } from "@/data/surahs";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useMediaSession } from "@/hooks/useMediaSession";
import { useResolvedUrl } from "@/hooks/useResolvedUrl";
import StartOverlay from "@/components/StartOverlay";
import VideoBackground from "@/components/VideoBackground";
import AudioPlayer from "@/components/AudioPlayer";
import Controls from "@/components/Controls";
import NowPlaying from "@/components/NowPlaying";
import ErrorFallback from "@/components/ErrorFallback";

const MANIFEST = manifestData as PlaylistManifest;

const RECITER_COLORS: Record<string, string> = {
  hazza: "#c8a45c",
  omar: "#4fc3f7",
};

function getTrackDisplay(track: typeof MANIFEST.audioTracks[number]) {
  if (track.displayTitle) {
    const info = SURAH_NAMES[track.surahNumber];
    return {
      title: track.displayTitle,
      subtitle: info ? `${track.surahNumber}. ${info.name}` : "",
      arabic: info?.nameArabic ?? "",
    };
  }
  const info = SURAH_NAMES[track.surahNumber];
  return {
    title: info ? `${track.surahNumber}. ${info.name}` : `Surah ${track.surahNumber}`,
    subtitle: "",
    arabic: info?.nameArabic ?? "",
  };
}

export default function Home() {
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [selectedReciter, setSelectedReciter] = useState(MANIFEST.reciters[0].id);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [progressSeconds, setProgressSeconds] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [status, setStatus] = useState<PlayerStatus>("idle");

  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seekingRef = useRef(false);

  const playingRef = useRef(playing);
  playingRef.current = playing;

  const { isFullscreen, supported: fullscreenSupported, requestFullscreen } = useFullscreen();

  const reciterTracks = useMemo(
    () => MANIFEST.audioTracks.filter((t) => t.reciterId === selectedReciter),
    [selectedReciter]
  );

  const currentTrack = reciterTracks[currentTrackIndex] ?? null;
  const currentReciter = useMemo(
    () => MANIFEST.reciters.find((r) => r.id === selectedReciter) ?? null,
    [selectedReciter]
  );

  const { url: resolvedUrl, loading: urlLoading, error: urlError } = useResolvedUrl(
    currentTrack,
    currentReciter
  );

  const hasNext = currentTrackIndex < reciterTracks.length - 1;
  const hasPrev = currentTrackIndex > 0;

  useEffect(() => {
    if (urlError) setError(urlError);
  }, [urlError]);

  // Set loading status when resolving URL
  useEffect(() => {
    if (urlLoading) setStatus("loading");
    else if (currentTrack && resolvedUrl && playing) setStatus("playing");
  }, [urlLoading, resolvedUrl, currentTrack, playing]);

  // Video rotation timer
  const totalVisuals = MANIFEST.videos.length + (MANIFEST.slideshowClips?.length ?? 0);
  useEffect(() => {
    if (!playing || totalVisuals === 0) return;
    const id = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % totalVisuals);
    }, MANIFEST.videoRotationIntervalSeconds * 1000);
    return () => clearInterval(id);
  }, [playing, totalVisuals]);

  // Auto-hide controls
  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    if (playingRef.current) {
      controlsTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 4000);
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = () => showControls();
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [showControls]);

  useEffect(() => {
    if (playing) {
      showControls();
    } else {
      setControlsVisible(true);
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    }
  }, [playing, showControls]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!started) return;
      switch (e.key) {
        case " ":
          e.preventDefault();
          setPlaying((p) => !p);
          break;
        case "ArrowRight":
          setCurrentTrackIndex((prev) => {
            if (prev < reciterTracks.length - 1) {
              setCurrentVideoIndex(0);
              setProgressSeconds(0);
              setError(null);
              return prev + 1;
            }
            return prev;
          });
          break;
        case "ArrowLeft":
          setCurrentTrackIndex((prev) => {
            if (prev > 0) {
              setCurrentVideoIndex(0);
              setProgressSeconds(0);
              setError(null);
              return prev - 1;
            }
            return prev;
          });
          break;
        case "f":
          if (fullscreenSupported) {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              document.documentElement.requestFullscreen();
            }
          }
          break;
        case "m":
          setIsMuted((m) => !m);
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started, fullscreenSupported, reciterTracks.length]);

  // Build a track-like object for NowPlaying/Controls that includes the display info
  const displayTrack = useMemo(() => {
    if (!currentTrack) return null;
    const reciter = MANIFEST.reciters.find((r) => r.id === currentTrack.reciterId);
    const display = getTrackDisplay(currentTrack);
    return {
      surahName: display.title,
      surahNameArabic: display.arabic,
      surahNumber: currentTrack.surahNumber,
      reciter: reciter?.name ?? "",
      reciterArabic: reciter?.nameArabic ?? "",
      id: currentTrack.id,
    };
  }, [currentTrack]);

  // Media Session API
  const mediaSessionHandlers = useMemo(
    () => ({
      onPlay: () => setPlaying(true),
      onPause: () => setPlaying(false),
      onNextTrack: () => {
        setCurrentTrackIndex((prev) => {
          if (prev < reciterTracks.length - 1) {
            setCurrentVideoIndex(0);
            setProgressSeconds(0);
            setError(null);
            return prev + 1;
          }
          return prev;
        });
      },
      onPreviousTrack: () => {
        setCurrentTrackIndex((prev) => {
          if (prev > 0) {
            setCurrentVideoIndex(0);
            setProgressSeconds(0);
            setError(null);
            return prev - 1;
          }
          return prev;
        });
      },
    }),
    [reciterTracks.length]
  );
  useMediaSession(displayTrack, playing, mediaSessionHandlers);

  const handleStart = useCallback(() => {
    setStarted(true);
    setPlaying(true);
    setStatus("playing");
  }, []);

  const handlePlayPause = useCallback(() => {
    setPlaying((p) => !p);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentTrackIndex((prev) => {
      if (prev < reciterTracks.length - 1) {
        setCurrentVideoIndex(0);
        setProgressSeconds(0);
        setError(null);
        setStatus("playing");
        return prev + 1;
      }
      return prev;
    });
  }, [reciterTracks.length]);

  const handlePrev = useCallback(() => {
    setCurrentTrackIndex((prev) => {
      if (prev > 0) {
        setCurrentVideoIndex(0);
        setProgressSeconds(0);
        setError(null);
        setStatus("playing");
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const handleNextVideo = useCallback(() => {
    setCurrentVideoIndex((prev) => (prev + 1) % totalVisuals);
  }, [totalVisuals]);

  const handleTimeUpdate = useCallback((currentTime: number, _duration: number) => {
    if (!seekingRef.current) {
      setProgressSeconds(currentTime);
    }
  }, []);

  const handleAudioEnded = useCallback(() => {
    setCurrentTrackIndex((prev) => {
      if (prev < reciterTracks.length - 1) {
        setCurrentVideoIndex(0);
        setProgressSeconds(0);
        return prev + 1;
      }
      setCurrentVideoIndex(0);
      setProgressSeconds(0);
      return 0;
    });
  }, [reciterTracks.length]);

  const handleAudioError = useCallback((message: string) => {
    setError(message);
    setStatus("error");
  }, []);

  const handleAudioLoaded = useCallback((duration: number) => {
    setAudioDuration(duration);
  }, []);

  const handleSeek = useCallback(
    (time: number) => {
      seekingRef.current = true;
      setProgressSeconds(time);
      const audio = document.querySelector("audio");
      if (audio) {
        audio.currentTime = time;
      }
      setTimeout(() => {
        seekingRef.current = false;
      }, 200);
    },
    []
  );

  const handleToggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      requestFullscreen();
    }
  }, [requestFullscreen]);

  const handleVolumeChange = useCallback((v: number) => {
    setVolume(v);
    if (v > 0) setIsMuted(false);
  }, []);

  const handleReciterChange = useCallback((reciterId: string) => {
    setSelectedReciter(reciterId);
    setCurrentTrackIndex(0);
    setCurrentVideoIndex(0);
    setProgressSeconds(0);
    setError(null);
    setStatus("idle");
  }, []);

  if (!started) {
    return <StartOverlay onStart={handleStart} onTap={requestFullscreen} title={MANIFEST.title} />;
  }

  return (
    <main
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        background: "var(--color-bg)",
      }}
    >
      <VideoBackground
        videos={MANIFEST.videos}
        slideshowClips={MANIFEST.slideshowClips}
        currentIndex={currentVideoIndex}
        isPlaying={playing}
        onVideoEnded={handleNextVideo}
      />

      <AudioPlayer
        track={currentTrack}
        src={resolvedUrl ?? undefined}
        isPlaying={playing && !urlLoading && !!resolvedUrl}
        volume={volume}
        isMuted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        onLoaded={handleAudioLoaded}
      />

      <NowPlaying track={displayTrack} visible={controlsVisible} />

      {/* Loading indicator */}
      {urlLoading && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 45,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              border: "3px solid rgba(255,255,255,0.15)",
              borderTopColor: "var(--color-accent)",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <span style={{ fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
            Loading audio...
          </span>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Reciter selector */}
      <div
        style={{
          position: "fixed",
          top: "1.5rem",
          right: "1.5rem",
          zIndex: 45,
          display: "flex",
          gap: "0.5rem",
          opacity: controlsVisible ? 1 : 0,
          transform: controlsVisible ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          pointerEvents: controlsVisible ? "auto" : "none",
        }}
      >
        {MANIFEST.reciters.map((r) => {
          const active = r.id === selectedReciter;
          return (
            <button
              key={r.id}
              onClick={() => handleReciterChange(r.id)}
              aria-label={`Switch to ${r.name}`}
              style={{
                padding: "0.4rem 1rem",
                fontSize: "0.8rem",
                fontWeight: active ? 700 : 400,
                color: active ? "#fff" : "var(--color-text-muted)",
                background: active ? RECITER_COLORS[r.id] ?? "var(--color-accent)" : "rgba(255,255,255,0.08)",
                border: active
                  ? "none"
                  : "1px solid rgba(255,255,255,0.15)",
                borderRadius: 20,
                cursor: "pointer",
                transition: "all 0.2s ease",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                fontFamily: "var(--font-display)",
              }}
            >
              {r.nameArabic}
            </button>
          );
        })}
      </div>

      <Controls
        isPlaying={playing && !urlLoading}
        volume={volume}
        isMuted={isMuted}
        progressSeconds={progressSeconds}
        durationSeconds={audioDuration}
        hasNext={hasNext}
        hasPrev={hasPrev}
        isFullscreen={isFullscreen}
        fullscreenSupported={fullscreenSupported}
        onPlayPause={handlePlayPause}
        onVolumeChange={handleVolumeChange}
        onToggleMute={() => setIsMuted((m) => !m)}
        onNext={handleNext}
        onPrev={handlePrev}
        onSeek={handleSeek}
        onToggleFullscreen={handleToggleFullscreen}
        visible={controlsVisible}
      />

      {error && (
        <ErrorFallback
          message={error}
          onRetry={() => {
            setError(null);
            setPlaying(true);
            setStatus("playing");
          }}
        />
      )}
    </main>
  );
}
