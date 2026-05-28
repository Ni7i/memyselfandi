"use client";
import { useEffect, useState } from "react";

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 3400);
    const t2 = setTimeout(onDone, 4300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  const rays = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div className={`loading${fading ? " fade" : ""}`}>
      <div className="loading-inner">
        <div className="loading-art">
          <svg viewBox="-100 -100 200 200">
            <polygon className="stroke"
              points="80,0 56.6,56.6 0,80 -56.6,56.6 -80,0 -56.6,-56.6 0,-80 56.6,-56.6" />
            <polygon className="stroke" style={{ animationDelay: "0.2s" }}
              points="60,24.9 24.9,60 -24.9,60 -60,24.9 -60,-24.9 -24.9,-60 24.9,-60 60,-24.9" />
            <polygon className="stroke" style={{ animationDelay: "0.5s" }}
              points="0,-72 16,-16 72,0 16,16 0,72 -16,16 -72,0 -16,-16" />
            <polygon className="stroke" style={{ animationDelay: "0.8s" }}
              points="0,-28 28,0 0,28 -28,0" />
            {rays.map((a, i) => {
              const rad = (a * Math.PI) / 180;
              return (
                <line key={a} className="stroke"
                  style={{ animationDelay: `${1.0 + i * 0.04}s` }}
                  x1={28 * Math.cos(rad)} y1={28 * Math.sin(rad)}
                  x2={80 * Math.cos(rad)} y2={80 * Math.sin(rad)} />
              );
            })}
            <circle className="dot" cx="0" cy="0" r="3" />
          </svg>
        </div>
        <div className="loading-text">
          Hi, I&apos;m<span className="italic">Enis</span>
        </div>
        <div className="loading-sub">﷽ &nbsp;·&nbsp; quietly loading</div>
        <div className="loading-progress" />
      </div>
    </div>
  );
}
