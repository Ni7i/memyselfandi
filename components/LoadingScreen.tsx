"use client";
import { useEffect, useState } from "react";

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1600);
    const t2 = setTimeout(onDone, 2300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className={`loading${fading ? " fade" : ""}`}>
      <div className="loading-center">
        <span className="loading-hi">Hi, I&apos;m</span>
        <em className="loading-name">Enis</em>
      </div>
      <div className="loading-bar"><div className="loading-bar-fill" /></div>
    </div>
  );
}
