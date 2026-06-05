"use client";
import { useEffect, useState } from "react";

export default function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [go, setGo] = useState(false);
  const [out, setOut] = useState(false);

  useEffect(() => {
    const t0 = setTimeout(() => setGo(true), 60);
    const t1 = setTimeout(() => setOut(true), 1500);
    const t2 = setTimeout(onDone, 2100);
    return () => { clearTimeout(t0); clearTimeout(t1); clearTimeout(t2); };
  }, [onDone]);

  return (
    <div className={`loading${out ? " fade" : ""}`}>
      <div className={`loading-body${go ? " go" : ""}`}>
        <div className="loading-mark" />
        <div className="loading-name">
          <span className="loading-first">ENIS</span>
          <span className="loading-last">SHORRA</span>
        </div>
        <div className="loading-sub">Software Engineer · CH</div>
        <div className="loading-track"><div className="loading-fill" /></div>
      </div>
    </div>
  );
}
