"use client";

import { useEffect, useState } from "react";

const LINES = [
  "Initializing portfolio...",
  "Loading components...",
  "Connecting to GitHub...",
  "Rendering UI...",
  "Welcome.",
];

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const current = LINES[lineIndex];
    if (!current) return;

    if (charIndex < current.length) {
      const t = setTimeout(() => setCharIndex((c) => c + 1), 28);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setDisplayed((d) => [...d, current]);
        setProgress(Math.round(((lineIndex + 1) / LINES.length) * 100));
        if (lineIndex < LINES.length - 1) {
          setLineIndex((i) => i + 1);
          setCharIndex(0);
        } else {
          setTimeout(() => {
            setFading(true);
            setTimeout(onDone, 600);
          }, 400);
        }
      }, 120);
      return () => clearTimeout(t);
    }
  }, [charIndex, lineIndex, onDone]);

  const currentLine = LINES[lineIndex] || "";
  const typing = currentLine.slice(0, charIndex);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#0a0a0a",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.6s ease",
        opacity: fading ? 0 : 1,
        pointerEvents: fading ? "none" : "all",
      }}
    >
      {/* Big name */}
      <div style={{ marginBottom: 48, textAlign: "center" }}>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: "-2px",
            background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #f472b6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Enis Shorra
        </div>
        <div style={{ fontSize: 13, color: "#555", marginTop: 4, letterSpacing: "0.15em" }}>
          PORTFOLIO
        </div>
      </div>

      {/* Terminal */}
      <div
        style={{
          width: 360,
          background: "#111",
          border: "1px solid #222",
          borderRadius: 10,
          overflow: "hidden",
          fontFamily: "'Courier New', monospace",
          fontSize: 13,
        }}
      >
        {/* Title bar */}
        <div
          style={{
            background: "#1a1a1a",
            padding: "8px 12px",
            display: "flex",
            alignItems: "center",
            gap: 6,
            borderBottom: "1px solid #222",
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f57", display: "block" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e", display: "block" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#28c840", display: "block" }} />
          <span style={{ marginLeft: 8, fontSize: 11, color: "#444" }}>bash — 80×24</span>
        </div>

        {/* Content */}
        <div style={{ padding: "14px 16px", minHeight: 120 }}>
          {displayed.map((line, i) => (
            <div key={i} style={{ color: i === displayed.length - 1 && lineIndex >= LINES.length - 1 ? "#a78bfa" : "#4ade80", marginBottom: 4 }}>
              <span style={{ color: "#555" }}>$ </span>{line}
            </div>
          ))}
          {lineIndex < LINES.length && (
            <div style={{ color: "#e0e0e0" }}>
              <span style={{ color: "#555" }}>$ </span>
              {typing}
              <span
                style={{
                  display: "inline-block",
                  width: 7,
                  height: 13,
                  background: "#a78bfa",
                  marginLeft: 1,
                  verticalAlign: "text-bottom",
                  animation: "blink 1s step-end infinite",
                }}
              />
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ height: 3, background: "#1a1a1a" }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
              transition: "width 0.4s ease",
            }}
          />
        </div>
      </div>

      <div style={{ marginTop: 24, fontSize: 11, color: "#333" }}>
        {progress}% loaded
      </div>
    </div>
  );
}
