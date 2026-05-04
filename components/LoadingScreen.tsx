"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "!@#$%^&*<>?/\\|[]{}0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const rnd = () => CHARS[Math.floor(Math.random() * CHARS.length)];

const WORDS = ["ENIS", "SHORRA"];
const FLAT = WORDS.join(" "); // "ENIS SHORRA"

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [display, setDisplay] = useState<string[]>(() => FLAT.split("").map(rnd));
  const [locked, setLocked] = useState<boolean[]>(() => FLAT.split("").map(() => false));
  const [phase, setPhase] = useState<"scramble" | "glow" | "exit">("scramble");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Rapid scramble
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setDisplay((prev) =>
        prev.map((c, i) => (locked[i] || FLAT[i] === " " ? FLAT[i] : rnd()))
      );
    }, 40);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [locked]);

  // Staggered reveal
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    FLAT.split("").forEach((_, i) => {
      if (FLAT[i] === " ") return;
      const t = setTimeout(() => {
        setLocked((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 400 + i * 110);
      timers.push(t);
    });

    // After all revealed
    const total = FLAT.replace(/ /g, "").length;
    const doneTimer = setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPhase("glow");
      setTimeout(() => setPhase("exit"), 800);
      setTimeout(() => onDone(), 1400);
    }, 400 + total * 110 + 200);
    timers.push(doneTimer);

    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const allLocked = locked.every((l, i) => l || FLAT[i] === " ");
  const isExit = phase === "exit";

  const firstWord = FLAT.slice(0, WORDS[0].length);
  const space = " ";
  const secondWord = FLAT.slice(WORDS[0].length + 1);
  const offset = WORDS[0].length + 1;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#060608",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transition: isExit ? "opacity 0.6s ease, transform 0.6s ease" : "none",
        opacity: isExit ? 0 : 1,
        transform: isExit ? "scale(1.04)" : "scale(1)",
      }}
    >
      {/* Animated background grid */}
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#a78bfa" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Scan line effect */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent)",
          animation: "scanline 3s linear infinite",
          pointerEvents: "none",
        }}
      />

      {/* Corner brackets */}
      {[
        { top: 40, left: 40 },
        { top: 40, right: 40 },
        { bottom: 40, left: 40 },
        { bottom: 40, right: 40 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 24,
            height: 24,
            borderColor: "#a78bfa44",
            borderStyle: "solid",
            borderWidth: 0,
            ...(pos.top !== undefined ? { borderTopWidth: 2, top: pos.top } : { borderBottomWidth: 2, bottom: pos.bottom }),
            ...(pos.left !== undefined ? { borderLeftWidth: 2, left: pos.left } : { borderRightWidth: 2, right: pos.right }),
          }}
        />
      ))}

      {/* Main text */}
      <div style={{ textAlign: "center", position: "relative" }}>
        {/* "// PORTFOLIO" label */}
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.3em",
            color: "#a78bfa88",
            marginBottom: 32,
            fontFamily: "monospace",
            opacity: allLocked ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        >
          // PORTFOLIO
        </div>

        {/* Scrambled name */}
        <div
          style={{
            fontSize: "clamp(60px, 8vw, 100px)",
            fontWeight: 900,
            letterSpacing: "0.05em",
            lineHeight: 1,
            display: "flex",
            gap: "0.15em",
            justifyContent: "center",
            animation: phase === "glow" ? "pulse-glow 0.8s ease" : "none",
          }}
        >
          {/* First word */}
          {firstWord.split("").map((_, i) => (
            <span
              key={i}
              style={{
                color: locked[i] ? "#ffffff" : "#2a2a2a",
                transition: locked[i] ? "color 0.1s" : "none",
                display: "inline-block",
                minWidth: "0.6em",
                textAlign: "center",
                fontFamily: "monospace",
              }}
            >
              {display[i]}
            </span>
          ))}

          <span style={{ color: "transparent", minWidth: "0.4em" }}>{space}</span>

          {/* Second word */}
          {secondWord.split("").map((_, j) => {
            const i = offset + j;
            return (
              <span
                key={i}
                style={{
                  color: locked[i]
                    ? phase === "glow"
                      ? "#a78bfa"
                      : "#ffffff"
                    : "#2a2a2a",
                  transition: locked[i] ? "color 0.15s" : "none",
                  display: "inline-block",
                  minWidth: "0.6em",
                  textAlign: "center",
                  fontFamily: "monospace",
                }}
              >
                {display[i]}
              </span>
            );
          })}
        </div>

        {/* Underline */}
        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, #a78bfa, transparent)",
            marginTop: 20,
            opacity: allLocked ? 0.6 : 0,
            transition: "opacity 0.5s ease",
          }}
        />

        {/* Status line */}
        <div
          style={{
            marginTop: 20,
            fontFamily: "monospace",
            fontSize: 11,
            color: "#333",
            letterSpacing: "0.15em",
            height: 16,
          }}
        >
          {!allLocked && (
            <span>
              DECRYPTING
              <span style={{ animation: "pulse-glow 0.6s infinite" }}>...</span>
            </span>
          )}
          {allLocked && phase !== "exit" && (
            <span style={{ color: "#a78bfa88" }}>ACCESS GRANTED</span>
          )}
        </div>
      </div>
    </div>
  );
}
