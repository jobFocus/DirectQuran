"use client";

import { useEffect, useState } from "react";

interface StartOverlayProps {
  onStart: () => void;
  title: string;
}

export default function StartOverlay({ onStart, title }: StartOverlayProps) {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (!fading) return;
    const timer = setTimeout(() => setVisible(false), 600);
    return () => clearTimeout(timer);
  }, [fading]);

  const handleStart = () => {
    setFading(true);
    setTimeout(onStart, 100);
  };

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
          &#x0628;&#x0633;&#x0645; &#x0627;&#x0644;&#x0644;&#x0647; &#x0627;&#x0644;&#x0631;&#x062d;&#x0645;&#x0646; &#x0627;&#x0644;&#x0631;&#x062d;&#x064a;&#x0645;
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
        <button
          onClick={handleStart}
          style={{
            padding: "1rem 3rem",
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "#0a0a0f",
            background: "var(--color-accent)",
            border: "none",
            borderRadius: 50,
            cursor: "pointer",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            boxShadow: "0 4px 20px rgba(200, 164, 92, 0.4)",
            letterSpacing: "0.05em",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 6px 30px rgba(200, 164, 92, 0.6)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 4px 20px rgba(200, 164, 92, 0.4)";
          }}
        >
          Tap to Begin
        </button>
      </div>
    </div>
  );
}
