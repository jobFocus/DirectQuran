"use client";

import { useState, useCallback, useEffect } from "react";

interface FullscreenAPI {
  requestFullscreen: () => Promise<void>;
  exitFullscreen: () => Promise<void>;
  isFullscreen: boolean;
  supported: boolean;
}

export function useFullscreen(): FullscreenAPI {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(
      typeof document !== "undefined" &&
      !!document.documentElement.requestFullscreen
    );
  }, []);

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  const requestFullscreen = useCallback(async () => {
    if (!supported) return;
    try {
      await document.documentElement.requestFullscreen();
    } catch {
      // Fullscreen denied by user or browser policy
    }
  }, [supported]);

  const exitFullscreen = useCallback(async () => {
    if (!supported || !document.fullscreenElement) return;
    try {
      await document.exitFullscreen();
    } catch {
      // Ignore
    }
  }, [supported]);

  return { requestFullscreen, exitFullscreen, isFullscreen, supported };
}
