"use client";

import { useEffect, useState } from "react";

export default function InternshipAd() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 1800);
    const t2 = setTimeout(() => dismiss(), 7000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => setShow(false), 400);
  };

  if (!show) return null;

  return (
    <div
      onClick={dismiss}
      style={{
        position: "fixed", bottom: 20, left: 20, zIndex: 9990,
        background: "#111",
        border: "1px solid #a78bfa55",
        borderRadius: 12,
        padding: "10px 14px",
        display: "flex", alignItems: "center", gap: 12,
        boxShadow: "0 0 24px rgba(167,139,250,0.12), 0 4px 20px rgba(0,0,0,0.5)",
        cursor: "pointer",
        maxWidth: 240,
        transition: "opacity 0.4s, transform 0.4s",
        opacity: leaving ? 0 : 1,
        transform: leaving ? "translateY(10px)" : "translateY(0)",
      }}
    >
      <div style={{ fontSize: 22, flexShrink: 0 }}>👋</div>
      <div>
        <div style={{ fontSize: 9, letterSpacing: "0.12em", fontWeight: 700, color: "#a78bfa", marginBottom: 2 }}>
          AD · SELF-SPONSORED
        </div>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#e0e0e0", lineHeight: 1.3 }}>
          Looking for an internship
        </div>
        <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>
          Open to CS / dev opportunities
        </div>
      </div>
      <div style={{ fontSize: 11, color: "#333", flexShrink: 0, alignSelf: "flex-start" }}>✕</div>
    </div>
  );
}
