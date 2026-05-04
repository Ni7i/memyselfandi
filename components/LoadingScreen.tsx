"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [nameVisible, setNameVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Name erscheint sofort
    const t1 = setTimeout(() => setNameVisible(true), 100);

    // Progress bar füllt sich
    let p = 0;
    const interval = setInterval(() => {
      p += 2;
      setProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setExiting(true);
          setTimeout(onDone, 500);
        }, 300);
      }
    }, 18);

    return () => { clearTimeout(t1); clearInterval(interval); };
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#0d0d0d",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      transition: "opacity 0.5s ease",
      opacity: exiting ? 0 : 1,
    }}>
      {/* Name */}
      <div style={{
        transition: "opacity 0.6s ease, transform 0.6s ease",
        opacity: nameVisible ? 1 : 0,
        transform: nameVisible ? "translateY(0)" : "translateY(10px)",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: "clamp(40px, 6vw, 72px)",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: "#fff",
          lineHeight: 1,
        }}>
          Enis{" "}
          <span style={{
            background: "linear-gradient(120deg, #a78bfa, #f472b6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Shorra
          </span>
        </div>
        <div style={{ fontSize: 12, color: "#444", letterSpacing: "0.2em", marginTop: 10 }}>
          PORTFOLIO
        </div>
      </div>

      {/* Progress bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 2, background: "#1a1a1a",
      }}>
        <div style={{
          height: "100%",
          width: `${progress}%`,
          background: "linear-gradient(90deg, #a78bfa, #f472b6)",
          transition: "width 0.05s linear",
        }} />
      </div>
    </div>
  );
}
