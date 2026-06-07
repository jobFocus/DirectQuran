"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import type { VideoClip, SlideshowClip } from "@/types";

interface VideoBackgroundProps {
  videos: VideoClip[];
  slideshowClips?: SlideshowClip[];
  currentIndex: number;
  isPlaying: boolean;
  onVideoEnded: () => void;
}

export default function VideoBackground({
  videos,
  slideshowClips = [],
  currentIndex,
  isPlaying,
  onVideoEnded,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [prevImageKey, setPrevImageKey] = useState<string | null>(null);

  const totalSlides = videos.length + slideshowClips.length;
  const isVideo = currentIndex < videos.length;
  const videoIndex = isVideo ? currentIndex : 0;
  const slideIndex = isVideo ? -1 : currentIndex - videos.length;

  const currentVideo = isVideo ? videos[videoIndex] : null;
  const currentSlide = !isVideo ? slideshowClips[slideIndex] : null;

  // Video event handlers
  useEffect(() => {
    if (!isVideo) return;
    const el = videoRef.current;
    if (!el) return;

    const handleEnded = () => onVideoEnded();
    el.addEventListener("ended", handleEnded);
    return () => el.removeEventListener("ended", handleEnded);
  }, [isVideo, onVideoEnded]);

  useEffect(() => {
    if (!isVideo) return;
    const el = videoRef.current;
    if (!el) return;

    if (isPlaying) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [isPlaying, currentIndex, isVideo]);

  useEffect(() => {
    if (!isVideo) return;
    const el = videoRef.current;
    if (!el) return;
    el.currentTime = 0;
    if (isPlaying) {
      el.play().catch(() => {});
    }
  }, [currentIndex, isVideo, isPlaying]);

  // Slideshow timer
  useEffect(() => {
    if (isVideo || !isPlaying || !currentSlide) return;
    const timer = setTimeout(() => {
      onVideoEnded();
    }, currentSlide.durationSeconds * 1000);
    return () => clearTimeout(timer);
  }, [isVideo, isPlaying, currentSlide, onVideoEnded]);

  // Reset image loaded state on slide change
  useEffect(() => {
    setImageLoaded(false);
    setPrevImageKey(currentSlide?.id ?? null);
  }, [currentIndex, currentSlide?.id]);

  const handleVideoError = useCallback(() => {
    onVideoEnded();
  }, [onVideoEnded]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const containerStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    background: "var(--color-bg)",
  };

  const overlayStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.7) 100%)",
    pointerEvents: "none",
    zIndex: 2,
  };

  if (!isVideo && currentSlide) {
    return (
      <div style={containerStyle}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          <img
            key={currentSlide.id}
            src={currentSlide.imageUrl}
            alt={currentSlide.mosqueName}
            onLoad={handleImageLoad}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: imageLoaded ? 1 : 0,
              transition: "opacity 0.8s ease",
              animation: imageLoaded ? "kenBurns 20s ease-in-out forwards" : "none",
            }}
          />
          <style>{`
            @keyframes kenBurns {
              0% { transform: scale(1) translate(0, 0); }
              50% { transform: scale(1.08) translate(-1%, -0.5%); }
              100% { transform: scale(1) translate(0, 0); }
            }
          `}</style>
        </div>
        <div style={overlayStyle} />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <video
        ref={videoRef}
        key={currentVideo?.id}
        src={currentVideo?.url}
        muted
        loop={false}
        playsInline
        preload="auto"
        onError={handleVideoError}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div style={overlayStyle} />
    </div>
  );
}
