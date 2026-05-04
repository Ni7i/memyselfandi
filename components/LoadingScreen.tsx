"use client";

import { useEffect, useState } from "react";

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [nameVisible, setNameVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setNameVisible(true), 150);
    let p = 0;
    const interval = setInterval(() => {
      p += 2.2;
      setProgress(Math.min(p, 100));
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => { setExiting(true); setTimeout(onDone, 500); }, 250);
      }
    }, 18);
    return () => { clearTimeout(t1); clearInterval(interval); };
  }, [onDone]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#f2ece3",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      transition: "opacity 0.5s ease",
      opacity: exiting ? 0 : 1,
    }}>
      <div style={{
        textAlign: "center",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        opacity: nameVisible ? 1 : 0,
        transform: nameVisible ? "translateY(0)" : "translateY(10px)",
      }}>
        <div className="handwritten" style={{
          fontSize: "clamp(44px, 7vw, 80px)",
          fontWeight: 700,
          color: "#2a1e12",
          lineHeight: 1,
          letterSpacing: "-0.01em",
        }}>
          Enis{" "}
          <span style={{
            background: "linear-gradient(120deg, #7c5cbf, #d45e7a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Shorra
          </span>
        </div>
        {/* hand-drawn squiggle */}
        <svg width="160" height="12" viewBox="0 0 160 12" style={{ marginTop: 6, opacity: nameVisible ? 0.5 : 0, transition: "opacity 0.8s ease 0.3s" }}>
          <path d="M4 8 Q24 2 44 8 Q64 14 84 8 Q104 2 124 8 Q144 14 156 8" stroke="#7c5cbf" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </svg>
        <div style={{ fontSize: 11, color: "#b4a090", letterSpacing: "0.18em", marginTop: 14 }}>PORTFOLIO</div>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "#e4d8c8" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg, #7c5cbf, #d45e7a)", transition: "width 0.04s linear" }} />
      </div>
    </div>
  );
}
