"use client";

interface ErrorFallbackProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorFallback({ message, onRetry }: ErrorFallbackProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "5rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 60,
        background: "rgba(239, 68, 68, 0.15)",
        border: "1px solid rgba(239, 68, 68, 0.3)",
        borderRadius: 12,
        padding: "0.75rem 1.25rem",
        maxWidth: "90vw",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <span style={{ fontSize: "0.9rem", color: "var(--color-text)", lineHeight: 1.4 }}>
        {message}
      </span>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: "0.4rem 1rem",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "#fff",
            background: "rgba(239, 68, 68, 0.6)",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          Retry
        </button>
      )}
    </div>
  );
}
