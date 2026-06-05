"use client";

import { useEffect, useState } from "react";

interface StartOverlayProps {
  onStart: () => void;
  title: string;
}

export default function StartOverlay({ onStart, title }: StartOverlayProps) {
  const [countdown, setCountdown] = useState(3);
  const [fading, setFading] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (countdown <= 0) {
      setFading(true);
      setTimeout(() => {
        setVisible(false);
        onStart();
      }, 600);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onStart]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(ellipse at center, #1a1a2e 0%, #0a0a0f 100%)",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.6s ease",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 520 }}>
        <div
          style={{
            fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            color: "var(--color-accent)",
            lineHeight: 1.2,
            marginBottom: "0.5rem",
            letterSpacing: "0.02em",
          }}
        >
          &#x0628;&#x0633;&#x0645; &#x0627;&#x0644;&#x0644;&#x0647; &#x0627;&#x0644;&#x631;&#x062d;&#x645;&#x646; &#x0627;&#x0644;&#x631;&#x062d;&#x64A;&#x645;
        </div>
        <h1
          style={{
            fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
            fontWeight: 300,
            fontFamily: "var(--font-display)",
            color: "var(--color-text)",
            marginBottom: "1rem",
            letterSpacing: "0.1em",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: "0.95rem",
            color: "var(--color-text-muted)",
            marginBottom: "2.5rem",
            lineHeight: 1.7,
            maxWidth: 400,
            margin: "0 auto 2.5rem",
          }}
        >
          Experience the Holy Quran with serene visuals of iconic mosques from around the world.
        </p>
        <div
          style={{
            fontSize: "clamp(2rem, 6vw, 3.5rem)",
            fontWeight: 700,
            color: "var(--color-accent)",
            fontFamily: "var(--font-display)",
            animation: "pulse 1s ease-in-out infinite",
          }}
        >
          {countdown}
        </div>
        <div
          style={{
            marginTop: "0.75rem",
            fontSize: "0.85rem",
            color: "var(--color-text-muted)",
            letterSpacing: "0.1em",
          }}
        >
          Starting automatically...
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
