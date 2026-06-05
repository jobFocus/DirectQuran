"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import type { PlaylistManifest, PlayerStatus } from "@/types";
import manifestData from "@/data/manifest.json";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useMediaSession } from "@/hooks/useMediaSession";
import StartOverlay from "@/components/StartOverlay";
import VideoBackground from "@/components/VideoBackground";
import AudioPlayer from "@/components/AudioPlayer";
import Controls from "@/components/Controls";
import NowPlaying from "@/components/NowPlaying";
import ErrorFallback from "@/components/ErrorFallback";

const MANIFEST = manifestData as PlaylistManifest;

export default function Home() {
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [progressSeconds, setProgressSeconds] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [status, setStatus] = useState<PlayerStatus>("idle");

  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seekingRef = useRef(false);

  const playingRef = useRef(playing);
  playingRef.current = playing;

  const trackIndexRef = useRef(currentTrackIndex);
  trackIndexRef.current = currentTrackIndex;

  const { isFullscreen, supported: fullscreenSupported, requestFullscreen, exitFullscreen } = useFullscreen();

  const currentTrack = MANIFEST.audioTracks[currentTrackIndex];
  const hasNext = currentTrackIndex < MANIFEST.audioTracks.length - 1;
  const hasPrev = currentTrackIndex > 0;

  // Video rotation timer
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % MANIFEST.videos.length);
    }, MANIFEST.videoRotationIntervalSeconds * 1000);
    return () => clearInterval(id);
  }, [playing]);

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
            if (prev < MANIFEST.audioTracks.length - 1) {
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
  }, [started, fullscreenSupported]);

  // Media Session API
  const mediaSessionHandlers = useMemo(
    () => ({
      onPlay: () => setPlaying(true),
      onPause: () => setPlaying(false),
      onNextTrack: () => {
        setCurrentTrackIndex((prev) => {
          if (prev < MANIFEST.audioTracks.length - 1) {
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
    []
  );
  useMediaSession(currentTrack, playing, mediaSessionHandlers);

  const handleStart = useCallback(() => {
    setStarted(true);
    setPlaying(true);
    setStatus("playing");
    requestFullscreen();
  }, [requestFullscreen]);

  const handlePlayPause = useCallback(() => {
    setPlaying((p) => !p);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentTrackIndex((prev) => {
      if (prev < MANIFEST.audioTracks.length - 1) {
        setCurrentVideoIndex(0);
        setProgressSeconds(0);
        setError(null);
        setStatus("playing");
        return prev + 1;
      }
      return prev;
    });
  }, []);

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
    setCurrentVideoIndex((prev) => (prev + 1) % MANIFEST.videos.length);
  }, []);

  const handleTimeUpdate = useCallback((currentTime: number, _duration: number) => {
    if (!seekingRef.current) {
      setProgressSeconds(currentTime);
    }
  }, []);

  const handleAudioEnded = useCallback(() => {
    setCurrentTrackIndex((prev) => {
      if (prev < MANIFEST.audioTracks.length - 1) {
        setCurrentVideoIndex(0);
        setProgressSeconds(0);
        return prev + 1;
      }
      // End of playlist - loop back
      setCurrentVideoIndex(0);
      setProgressSeconds(0);
      return 0;
    });
  }, []);

  const handleAudioError = useCallback((message: string) => {
    setError(message);
    setStatus("error");
  }, []);

  const handleAudioLoaded = useCallback((duration: number) => {
    setAudioDuration(duration);
  }, []);

  const handleSeek = useCallback((time: number) => {
    seekingRef.current = true;
    setProgressSeconds(time);
    const audio = document.querySelector("audio");
    if (audio) {
      audio.currentTime = time;
    }
    setTimeout(() => {
      seekingRef.current = false;
    }, 200);
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      exitFullscreen();
    } else {
      requestFullscreen();
    }
  }, [exitFullscreen, requestFullscreen]);

  const handleVolumeChange = useCallback((v: number) => {
    setVolume(v);
    if (v > 0) setIsMuted(false);
  }, []);

  if (!started) {
    return <StartOverlay onStart={handleStart} title={MANIFEST.title} />;
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
        currentIndex={currentVideoIndex}
        isPlaying={playing}
        onVideoEnded={handleNextVideo}
      />

      <AudioPlayer
        track={currentTrack}
        isPlaying={playing}
        volume={volume}
        isMuted={isMuted}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        onLoaded={handleAudioLoaded}
      />

      <NowPlaying track={currentTrack} visible={true} />

      <Controls
        isPlaying={playing}
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
