"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import LoadingScreen from "@/components/LoadingScreen";

const LeafletMap = dynamic(() => import("@/components/MapClient"), { ssr: false });

// ─── Icons ──────────────────────────────────────────────────────────────────
const I = {
  wave:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11V6a2 2 0 0 1 4 0v5M11 11V4a2 2 0 0 1 4 0v7M15 11V6a2 2 0 0 1 4 0v9a6 6 0 0 1-12 0v-3"/></svg>,
  pin:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-7-7.5-7-12a7 7 0 1 1 14 0c0 4.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>,
  spark:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/></svg>,
  link:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>,
  home:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l9-9 9 9M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/></svg>,
  image:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M3 17l5-5 5 5 3-3 5 5"/></svg>,
  music:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V6l12-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
  compass: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M16 8l-2 6-6 2 2-6 6-2z"/></svg>,
  map:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z"/><path d="M9 4v13M15 7v13"/></svg>,
  git:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.16.58.67.48A10 10 0 0 0 12 2z"/></svg>,
  tool:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 6l4-4 3 3-4 4-3-3zM2 22l7-7M14 6L2 18l4 4 12-12"/></svg>,
  mail:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 7 9-7"/></svg>,
  send:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>,
  apple:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 13a4 4 0 0 1 2-3.5 4 4 0 0 0-3.5-2c-1.5 0-2.5 1-3.5 1s-2-1-3.5-1A4.5 4.5 0 0 0 4 12c0 4 3 8 5 8 1 0 2-.5 3-.5s2 .5 3 .5c1 0 2-1 3-2.5A6 6 0 0 1 17 13zM12 6a3 3 0 0 1 3-3"/></svg>,
  linux:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="14" rx="6" ry="7"/><circle cx="10" cy="10" r="1" fill="currentColor"/><circle cx="14" cy="10" r="1" fill="currentColor"/><path d="M10 14c1 1 3 1 4 0"/></svg>,
  windows: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 4l8-1v9H3zM12 3l9-1v10h-9zM3 13h8v8l-8-1zM12 13h9v9l-9-1z"/></svg>,
  code:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l-6-6 6-6M15 6l6 6-6 6"/></svg>,
  py:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 4h6a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H9a3 3 0 0 0-3 3v3a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-3"/><circle cx="10" cy="7" r="0.5" fill="currentColor"/><circle cx="14" cy="17" r="0.5" fill="currentColor"/></svg>,
  cs:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M16 7a5 5 0 1 0 0 10M18 9v2h2M18 13v2h2M19 9v6M21 9v6"/></svg>,
  brand:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 12h8M12 8v8"/></svg>,
  discord: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 6a16 16 0 0 1 6-2l1 2a17 17 0 0 1 4 0l1-2a16 16 0 0 1 6 2c3 4 4 9 3 14a17 17 0 0 1-5 2l-1-2"/><circle cx="9" cy="14" r="1.5" fill="currentColor"/><circle cx="15" cy="14" r="1.5" fill="currentColor"/></svg>,
  mouse:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="7" y="2" width="10" height="16" rx="5"/><line x1="12" y1="6" x2="12" y2="10"/></svg>,
  kbd:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></svg>,
  lock:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  star:    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  heart:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  eye:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
};

// ─── About ────────────────────────────────────────────────────────────────────
function AboutCard() {
  const ascii = `         ╱╲\n        ╱  ╲\n       ╱ ╱╲ ╲\n      ╱ ╱  ╲ ╲\n     ╱_╱____╲_╲`;
  return (
    <div className="card about gd-about" data-card="About">
      <div className="card-h">{I.wave}About Me</div>
      <h1>Hi, I&apos;m<br /><span className="italic">Enis</span></h1>
      <p className="bio">
        17 — Kosovo roots, raised in Switzerland.
        Building with C# and TypeScript, competing in ICT, listening to Quran.
      </p>
      <div className="loc">{I.pin} Rudolfstetten, Switzerland</div>
      <div className="about-stats">
        <div className="about-stat">
          <span className="about-stat-val">17</span>
          <span className="about-stat-label">Jahre</span>
        </div>
        <div className="about-stat">
          <span className="about-stat-val">2+</span>
          <span className="about-stat-label">Yrs Dev</span>
        </div>
      </div>
      <pre className="about-ascii">{ascii}</pre>
    </div>
  );
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
const GALLERY_PHOTOS = [
  { src: "/gallery/istanbul-2.jpg", full: "/gallery/istanbul-2.jpg", alt: "Taksim Camii" },
  { src: "/gallery/istanbul-4.jpg", full: "/gallery/istanbul-4.jpg", alt: "Blue Mosque · Sultanahmet" },
  { src: "/gallery/istanbul-5.jpg", full: "/gallery/istanbul-5.jpg", alt: "İstiklal Caddesi" },
];

function GalleryCard() {
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open !== null) return;
    const t = setInterval(() => setIdx(i => (i + 1) % GALLERY_PHOTOS.length), 5000);
    return () => clearInterval(t);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open === null) return;
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen(o => (o! + 1) % GALLERY_PHOTOS.length);
      if (e.key === "ArrowLeft")  setOpen(o => (o! - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const p = GALLERY_PHOTOS[idx];

  return (
    <>
      <div className="card gallery gd-gallery" data-card="Gallery">
        <div className="gallery-single" onClick={() => setOpen(idx)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.src} alt={p.alt} />
          <div className="gallery-overlay">
            <span className="gallery-caption">{p.alt}</span>
            <span className="gallery-open">↗</span>
          </div>
        </div>
        <div className="gallery-dots">
          {GALLERY_PHOTOS.map((_, i) => (
            <button key={i} className={`gallery-dot${i === idx ? " active" : ""}`}
              onClick={() => setIdx(i)} aria-label={`Photo ${i + 1}`} />
          ))}
        </div>
      </div>

      {open !== null && (
        <div className="g-modal" onClick={() => setOpen(null)}>
          <div className="g-modal-inner" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_PHOTOS[open].full} alt={GALLERY_PHOTOS[open].alt} />
            <div className="g-modal-bar">
              <span className="g-modal-alt">{GALLERY_PHOTOS[open].alt}</span>
              <span className="g-modal-count">{open + 1} / {GALLERY_PHOTOS.length}</span>
            </div>
          </div>
          <button className="g-modal-nav g-prev" onClick={e => { e.stopPropagation(); setOpen(o => (o! - 1 + GALLERY_PHOTOS.length) % GALLERY_PHOTOS.length); }}>‹</button>
          <button className="g-modal-nav g-next" onClick={e => { e.stopPropagation(); setOpen(o => (o! + 1) % GALLERY_PHOTOS.length); }}>›</button>
          <button className="g-modal-close" onClick={() => setOpen(null)}>×</button>
        </div>
      )}
    </>
  );
}

// ─── Werdegang (Career Timeline) ──────────────────────────────────────────────
type Milestone = {
  year: string;
  title: string;
  sub: string;
  kind: "school" | "work" | "win";
};

const WERDEGANG: Milestone[] = [
  { year: "2014", title: "Primarschule",         sub: "Rudolfstetten · 1.–6. Klasse",      kind: "school" },
  { year: "2020", title: "Sekundarschule",       sub: "Bezirksschule · Realgymnasialweg",  kind: "school" },
  { year: "2023", title: "IMS Baden",             sub: "Informatikmittelschule · Start",    kind: "school" },
  { year: "2025", title: "ICT Regios",           sub: "Regionalwettkampf · Top 10",        kind: "win"    },
  { year: "2026", title: "Praktikum",            sub: "Software Engineering · 1 Jahr",     kind: "work"   },
  { year: "2027", title: "IMS-Abschluss",        sub: "Berufsmatura Informatik",           kind: "school" },
];

function WerdegangCard() {
  const [active, setActive] = useState<number | null>(null);

  // Dramatic asymmetric heights: low start → high → deep → PEAK (win) → settle → rise
  const Y_POSITIONS = [145, 42, 158, 18, 98, 46];

  const nodes = WERDEGANG.map((m, i) => {
    const x = 40 + (520 / (WERDEGANG.length - 1)) * i;
    const y = Y_POSITIONS[i] ?? 100;
    return { ...m, x, y };
  });

  // "Late-hold" cubic Beziers: path stays near prev height for 35%, then snaps to new height
  const path = nodes.reduce((acc, n, i) => {
    if (i === 0) return `M ${n.x} ${n.y}`;
    const prev = nodes[i - 1];
    const dx = n.x - prev.x;
    const cp1x = prev.x + dx * 0.32;
    const cp2x = prev.x + dx * 0.68;
    return `${acc} C ${cp1x} ${prev.y}, ${cp2x} ${n.y}, ${n.x} ${n.y}`;
  }, "");

  return (
    <div className="card werdegang gd-werdegang" data-card="Werdegang">
      <div className="card-h">
        {I.compass}Werdegang
        <span className="wer-hint">click a milestone</span>
      </div>
      <div className="wer-stage">
        <svg className="wer-svg" viewBox="0 0 600 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="wer-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ff7a2f" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#ff7a2f" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#ff7a2f" stopOpacity="0.15" />
            </linearGradient>
            <filter id="wer-glow">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <path d={path} fill="none" stroke="url(#wer-grad)" strokeWidth="2" strokeLinecap="round" />
          {nodes.map((n, i) => {
            const isActive = active === i;
            const nodeColor = n.kind === "win" ? "#ffd655" : "#ff7a2f";
            const labelY = n.y < 85 ? n.y + 30 : n.y - 18;
            return (
              <g key={i} className={`wer-node${isActive ? " active" : ""}`}
                onClick={() => setActive(isActive ? null : i)}
                style={{ cursor: "pointer" }}>
                <circle cx={n.x} cy={n.y} r="22" fill="transparent" />
                {n.kind === "win" && (
                  <circle cx={n.x} cy={n.y} r={isActive ? 18 : 14} fill="none" stroke={nodeColor} strokeWidth="0.8" strokeOpacity="0.35" strokeDasharray="3 3" />
                )}
                <circle cx={n.x} cy={n.y} r={isActive ? 11 : 8} fill="#1b1b21" stroke={nodeColor} strokeWidth="1.6" filter="url(#wer-glow)" />
                <circle cx={n.x} cy={n.y} r={isActive ? 4 : 2.5} fill={nodeColor} />
                <text x={n.x} y={labelY} textAnchor="middle" className="wer-year">{n.year}</text>
              </g>
            );
          })}
        </svg>
        <div className="wer-info">
          {active !== null ? (
            <>
              <div className="wer-info-year">
                {nodes[active].year}
                <span className={`wer-kind k-${nodes[active].kind}`}>
                  {nodes[active].kind === "school" ? "Schule" : nodes[active].kind === "work" ? "Beruf" : "Wettkampf"}
                </span>
              </div>
              <div className="wer-info-title">{nodes[active].title}</div>
              <div className="wer-info-sub">{nodes[active].sub}</div>
            </>
          ) : (
            <div className="wer-info-empty">2014 → heute · {WERDEGANG.length} Stationen — klick einen Punkt</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Constellation (Projects as Star Map) ────────────────────────────────────
const REPOS = [
  { name: "StockRendite",        lang: "C# / Blazor",  year: "2026 →", desc: "Track holdings, see actual returns",       url: "https://stock-rendite.vercel.app/", stars: 5 },
  { name: "whiteplayer",         lang: "C# / WPF",     year: "2026",   desc: "Minimal music player with custom WPF UI",  stars: 4 },
  { name: "memyselfandi",        lang: "TypeScript",   year: "2026",   desc: "This portfolio — enisshorra.ch",            url: "https://github.com/Ni7i/memyselfandi", stars: 4 },
  { name: "Quizlot",             lang: "TypeScript",   year: "2026",   desc: "Quiz platform",                            stars: 3 },
  { name: "ICT-Regios-2026",     lang: "JavaScript",   year: "2026",   desc: "ICT Regios competition project",           stars: 3 },
  { name: "TrackMyFoodFrontend", lang: "JavaScript",   year: "2026",   desc: "Food tracking app frontend",               stars: 2 },
  { name: "Impostergame-WhoAmI", lang: "JavaScript",   year: "2026",   desc: "First professional project",               stars: 2 },
  { name: "screentime-blocker",  lang: "JavaScript",   year: "2026",   desc: "Screen time management",                   stars: 2 },
  { name: "OaseJugendraum",      lang: "Python",       year: "2026",   desc: "Youth room web app",                       stars: 2 },
  { name: "Swissskills25",       lang: "—",            year: "2026",   desc: "Swiss Skills 2025 competition",            stars: 2 },
  { name: "BudgetBudddy",        lang: "Python",       year: "2025",   desc: "Budget tracking app",                      stars: 2 },
  { name: "ReactProjekt",        lang: "JavaScript",   year: "2025",   desc: "UI & code progress showcase",              stars: 2 },
  { name: "midnight-calculator", lang: "C#",           year: "2025",   desc: "Calculator for a local SME",               stars: 3 },
  { name: "LCR",                 lang: "C#",           year: "2025",   desc: "Little random OOP game",                   stars: 2 },
  { name: "Zitate",              lang: "Python",       year: "2025",   desc: "Quotes collection app",                    stars: 2 },
];

const LANG_COLOR: Record<string, string> = {
  "C#": "#7b3fcf", "C# / WPF": "#7b3fcf", "C# / Blazor": "#7b3fcf",
  "TypeScript": "#3178c6", "JavaScript": "#d4a017",
  "Python": "#3572a5", "HTML": "#e34c26", "—": "#555",
};

const GOLDEN_ANGLE = 2.399963;

const STAR_DATA = REPOS.map((r, i) => {
  const angle = i * GOLDEN_ANGLE;
  const radius = Math.sqrt((i + 0.5) / REPOS.length) * 0.40;
  return {
    ...r,
    nx: 0.5 + radius * Math.cos(angle),
    ny: 0.5 + radius * Math.sin(angle),
    phase: (i * 1.618) % (Math.PI * 2),
    color: LANG_COLOR[r.lang] ?? "#555",
  };
});

// Pre-computed nebula clouds (deterministic, drawn once per draw)
const NEBULAE = [
  { nx: 0.22, ny: 0.30, r: 0.42, color: "#3a1a5a" },
  { nx: 0.75, ny: 0.65, r: 0.48, color: "#1a2a55" },
  { nx: 0.55, ny: 0.20, r: 0.32, color: "#5a2a1a" },
  { nx: 0.18, ny: 0.78, r: 0.36, color: "#2a4a55" },
];

// Pre-computed background star field (deterministic positions)
const BG_STARS = Array.from({ length: 320 }).map((_, i) => {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  const s2 = Math.sin(i * 78.233) * 12345.6789;
  return {
    nx: s - Math.floor(s),
    ny: s2 - Math.floor(s2),
    size: i % 9 === 0 ? 1.4 : i % 4 === 0 ? 0.9 : 0.55,
    twinklePhase: (i * 0.7) % (Math.PI * 2),
    baseAlpha: 0.35 + ((i * 0.131) % 0.45),
  };
});

function ConstellationCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef<number | null>(null);
  const mouseRef = useRef<{ nx: number; ny: number } | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    let raf = 0;
    let t = 0;
    let stopped = false;

    const syncSize = () => {
      const rect = wrap.getBoundingClientRect();
      // Fallback to offsetWidth/Height (still works even when getBoundingClientRect returns 0 in some layout quirks)
      const cssW = rect.width || wrap.offsetWidth || 1;
      const cssH = rect.height || wrap.offsetHeight || 1;
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(cssW * dpr));
      const h = Math.max(1, Math.round(cssH * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    syncSize();
    const obs = new ResizeObserver(syncSize);
    obs.observe(wrap);
    window.addEventListener("resize", syncSize);

    const draw = () => {
      if (stopped) return;
      syncSize();
      const ctx = canvas.getContext("2d");
      if (!ctx) { raf = requestAnimationFrame(draw); return; }
      const W = canvas.width;
      const H = canvas.height;
      const dpr = Math.max(1, window.devicePixelRatio || 1);

      // Deep-space background gradient
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#0b0a14");
      bg.addColorStop(1, "#07060c");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Nebulae (soft colored clouds)
      NEBULAE.forEach((n, i) => {
        const cx = n.nx * W;
        const cy = n.ny * H;
        const r = n.r * Math.max(W, H);
        const pulse = 1 + 0.04 * Math.sin(t * 0.4 + i);
        const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * pulse);
        grd.addColorStop(0, n.color + "55");
        grd.addColorStop(0.45, n.color + "1a");
        grd.addColorStop(1, "transparent");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      });

      // Background ambient stars (denser, brighter)
      BG_STARS.forEach((s) => {
        const sx = s.nx * W;
        const sy = s.ny * H;
        const tw = 0.55 + 0.45 * Math.sin(t * 0.6 + s.twinklePhase);
        const a = Math.max(0.18, s.baseAlpha * tw);
        ctx.beginPath();
        ctx.arc(sx, sy, s.size * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,250,240,${a})`;
        ctx.fill();
        // Subtle halo on the biggest ones
        if (s.size > 1.2) {
          const hg = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.size * 5 * dpr);
          hg.addColorStop(0, `rgba(255,250,240,${a * 0.5})`);
          hg.addColorStop(1, "transparent");
          ctx.fillStyle = hg;
          ctx.beginPath();
          ctx.arc(sx, sy, s.size * 5 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Connection lines (same language family)
      STAR_DATA.forEach((star, i) => {
        STAR_DATA.forEach((other, j) => {
          if (j <= i) return;
          const fam = (l: string) => l.split("/")[0].trim().split(" ")[0];
          if (fam(star.lang) !== fam(other.lang) || star.lang === "—") return;
          const x1 = star.nx * W, y1 = star.ny * H;
          const x2 = other.nx * W, y2 = other.ny * H;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = `${star.color}35`;
          ctx.lineWidth = 1 * dpr;
          ctx.stroke();
        });
      });

      // Project stars
      STAR_DATA.forEach((star, i) => {
        const x = star.nx * W;
        const y = star.ny * H;
        const twinkle = 0.85 + 0.15 * Math.sin(t * 0.9 + star.phase);
        const isHov = hoveredRef.current === i;
        const isSel = selected === i;
        const baseR = (star.stars + 3) * dpr;
        const r = baseR * (isHov || isSel ? 2.2 : 1) * twinkle;

        const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
        grd.addColorStop(0, star.color + "ee");
        grd.addColorStop(0.3, star.color + "55");
        grd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(x, y, r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = isHov || isSel ? "#ffffff" : star.color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${isHov || isSel ? 0.95 : 0.7})`;
        ctx.fill();

        // Diffraction spikes (only on hover/selected to keep it clean)
        if (isHov || isSel) {
          ctx.strokeStyle = `rgba(255,255,255,0.55)`;
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath();
          ctx.moveTo(x - r * 3, y); ctx.lineTo(x + r * 3, y);
          ctx.moveTo(x, y - r * 3); ctx.lineTo(x, y + r * 3);
          ctx.stroke();
        }
      });

      // Cursor dot + hover URL pill (small, on hover only when nothing selected)
      const mouse = mouseRef.current;
      if (mouse && selected === null) {
        const mx = mouse.nx * W;
        const my = mouse.ny * H;
        ctx.beginPath();
        ctx.arc(mx, my, 2.5 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.28)";
        ctx.fill();

        if (hoveredRef.current !== null) {
          const star = STAR_DATA[hoveredRef.current];
          const label = star.name;
          const fontSize = 11 * dpr;
          ctx.font = `${fontSize}px monospace`;
          const textW = ctx.measureText(label).width;
          const padX = 11 * dpr;
          const pillH = 24 * dpr;
          const pillW = textW + padX * 2;

          let px = mx + 14 * dpr;
          let py = my - pillH / 2;
          if (px + pillW > W - 4 * dpr) px = mx - pillW - 14 * dpr;
          if (px < 4 * dpr) px = 4 * dpr;
          if (py < 4 * dpr) py = 4 * dpr;
          if (py + pillH > H - 4 * dpr) py = H - pillH - 4 * dpr;

          ctx.fillStyle = "rgba(13,13,17,0.95)";
          ctx.beginPath();
          ctx.roundRect(px, py, pillW, pillH, pillH / 2);
          ctx.fill();
          ctx.strokeStyle = `${star.color}60`;
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath();
          ctx.roundRect(px, py, pillW, pillH, pillH / 2);
          ctx.stroke();
          ctx.fillStyle = "#e8e4dc";
          ctx.font = `${fontSize}px monospace`;
          ctx.fillText(label, px + padX, py + pillH * 0.67);
        }
      }

      t += 0.016;
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      mouseRef.current = { nx, ny };
      let closest: number | null = null;
      let minD = Infinity;
      STAR_DATA.forEach((star, i) => {
        const dx = star.nx - nx;
        const dy = star.ny - ny;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 0.07 && d < minD) { closest = i; minD = d; }
      });
      hoveredRef.current = closest;
      setHovered(closest);
    };
    const onLeave = () => {
      hoveredRef.current = null;
      mouseRef.current = null;
      setHovered(null);
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      stopped = true;
      obs.disconnect();
      window.removeEventListener("resize", syncSize);
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, [selected]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hoveredRef.current !== null) {
      setSelected(hoveredRef.current);
    } else {
      setSelected(null);
    }
  };

  const sel = selected !== null ? STAR_DATA[selected] : null;
  const selUrl = sel ? ((sel as { url?: string }).url ?? `https://github.com/Ni7i/${sel.name}`) : null;

  return (
    <div className="card constellation gd-sta" data-card="Projects" onClick={handleClick}>
      <div className="card-h">
        {I.spark}Projects · Constellation
        <span className="con-hint">{selected !== null ? "click to deselect" : "click a star"}</span>
      </div>
      <div ref={wrapRef} className="constellation-wrap">
        <canvas
          ref={canvasRef}
          className="constellation-canvas"
          style={{ cursor: hovered !== null ? "pointer" : "crosshair" }}
        />
        {sel && (
          <div className="con-info" onClick={(e) => e.stopPropagation()}>
            <button className="con-info-close" onClick={() => setSelected(null)} aria-label="Close">×</button>
            <div className="con-info-top">
              <span className="con-info-dot" style={{ background: sel.color }} />
              <span className="con-info-lang">{sel.lang}</span>
              <span className="con-info-year">{sel.year}</span>
            </div>
            <div className="con-info-name">{sel.name}</div>
            <div className="con-info-desc">{sel.desc}</div>
            {selUrl && (
              <a className="con-info-link" href={selUrl} target="_blank" rel="noopener noreferrer">
                ↗ {selUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Map ──────────────────────────────────────────────────────────────────────
function MapCard({ countries: _ }: { countries: Record<string, number> }) {
  return (
    <div className="card map gd-map" data-card="Map">
      <div className="map-tag">Switzerland · Home</div>
      <div className="leaflet-stage"><LeafletMap /></div>
    </div>
  );
}

// ─── GitHub ───────────────────────────────────────────────────────────────────
type GHEvent = { type: string; created_at: string; payload?: { commits?: unknown[] } };

function GithubCard() {
  const [weeks, setWeeks] = useState<number[][] | null>(null);
  const [totalReal, setTotalReal] = useState<number | null>(null);

  const fallback = useMemo(() => {
    const arr: number[][] = [];
    let seed = 11;
    for (let w = 0; w < 26; w++) {
      const week: number[] = [];
      for (let d = 0; d < 7; d++) {
        seed = (seed * 9301 + 49297) % 233280;
        const r = seed / 233280;
        const recency = w / 26;
        const base = r + recency * 0.75;
        let level = 1;
        if (base > 0.25) level = 2;
        if (base > 0.50) level = 3;
        if (base > 0.72) level = 4;
        if (r < 0.08) level = 0;
        week.push(level);
      }
      arr.push(week);
    }
    return arr;
  }, []);

  useEffect(() => {
    fetch("https://api.github.com/users/Ni7i/events?per_page=100")
      .then(r => r.json())
      .then((events: GHEvent[]) => {
        if (!Array.isArray(events)) return;
        const counts: Record<string, number> = {};
        let total = 0;
        events
          .filter(e => e.type === "PushEvent")
          .forEach(e => {
            const day = e.created_at?.slice(0, 10);
            const c = e.payload?.commits?.length || 1;
            if (day) { counts[day] = (counts[day] || 0) + c; total += c; }
          });
        const today = new Date();
        const grid: number[][] = [];
        for (let w = 25; w >= 0; w--) {
          const week: number[] = [];
          for (let d = 6; d >= 0; d--) {
            const dt = new Date(today);
            dt.setDate(today.getDate() - (w * 7 + d));
            const key = dt.toISOString().slice(0, 10);
            const c = counts[key] || 0;
            let level = 0;
            if (c >= 1) level = 1;
            if (c >= 3) level = 2;
            if (c >= 6) level = 3;
            if (c >= 10) level = 4;
            week.push(level);
          }
          grid.push(week);
        }
        setWeeks(grid);
        setTotalReal(total);
      })
      .catch(() => {});
  }, []);

  const display = weeks ?? fallback;

  const getMonthLabels = () => {
    const labels: string[] = [];
    const today = new Date();
    for (let w = 25; w >= 0; w -= 4) {
      const dt = new Date(today);
      dt.setDate(today.getDate() - w * 7);
      labels.push(dt.toLocaleString("en", { month: "short" }));
    }
    return labels.slice(0, 7);
  };

  return (
    <div className="card github gd-github" data-card="GitHub"
      style={{ cursor: "pointer" }}
      onClick={() => window.open("https://github.com/Ni7i", "_blank", "noopener")}>
      <div className="label-row">
        <div className="card-h" style={{ margin: 0 }}>{I.git}GitHub</div>
        <span className="handle">@Ni7i</span>
        <span className="commit-count">{Math.max(totalReal ?? 0, 540)}+ commits</span>
      </div>
      <div className="month-row">
        {getMonthLabels().map((m, i) => <span key={i}>{m}</span>)}
      </div>
      <div className="heatmap">
        {display.map((week, wi) => (
          <div className="hweek" key={wi}>
            {week.map((lvl, di) => (
              <div className="hday" key={di} data-l={lvl} />
            ))}
          </div>
        ))}
      </div>
      <div className="legend">
        less
        <span className="l" style={{ background: "#1a1c1e" }} />
        <span className="l" style={{ background: "#4a2e2a" }} />
        <span className="l" style={{ background: "#8a4a3c" }} />
        <span className="l" style={{ background: "#c96856" }} />
        <span className="l" style={{ background: "#f08e7f" }} />
        more
      </div>
    </div>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function TestimonialsCard() {
  return (
    <div className="card testimonials gd-tes" data-card="Testimonials">
      <div className="card-h">{I.spark}Stimmen</div>
      <div className="tes-body visible">
        <p className="tes-text">&ldquo;Gute Planung und saubere Arbeitsart.&rdquo;</p>
        <div className="tes-meta">
          <span className="tes-name">Herr Schneider</span>
          <span className="tes-role">Lehrperson · IMS Aarau</span>
        </div>
      </div>
    </div>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function ContactCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sub = encodeURIComponent(`Kontakt von ${name}`);
    const body = encodeURIComponent(`Von: ${name}\nE-Mail: ${email}\n\n${msg}`);
    window.open(`mailto:enis.shorra3@hotmail.com?subject=${sub}&body=${body}`);
    setSent(true);
    setTimeout(() => { setName(""); setEmail(""); setMsg(""); setSent(false); }, 4000);
  };

  return (
    <div className="card contact gd-board" data-card="Kontakt">
      <div className="card-h">{I.mail}Kontakt</div>
      {sent ? (
        <div className="contact-sent">Danke — E-Mail wird geöffnet.</div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-Mail" required />
          <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Nachricht…" required rows={2} />
          <button type="submit">
            <span className="btn-icon">{I.send}</span>Senden
          </button>
        </form>
      )}
    </div>
  );
}

// ─── Device Popups ────────────────────────────────────────────────────────────
function MacBookVisual({ rotation }: { rotation: number }) {
  const r = rotation % 360;
  const abs = ((r % 360) + 360) % 360;
  const showBack = abs > 90 && abs < 270;
  return (
    <div className="macbook-3d" style={{ transform: `rotateY(${r}deg)` }}>
      <div className="mb-lid">
        {showBack ? (
          <div className="mb-back-face">
            <div className="mb-apple-back">✦</div>
          </div>
        ) : (
          <div className="mb-screen-face">
            <div className="mb-notch" />
            <div className="mb-screen-inner">
              <div className="mb-screen-lines">
                <div className="mb-sl mb-sl-1" /><div className="mb-sl mb-sl-2" />
                <div className="mb-sl mb-sl-3" /><div className="mb-sl mb-sl-4" />
              </div>
              <div className="mb-screen-label">M4 Pro</div>
            </div>
          </div>
        )}
      </div>
      <div className="mb-hinge" />
      <div className="mb-base">
        <div className="mb-keyboard">
          {Array.from({ length: 30 }).map((_, i) => <div key={i} className="mb-key" />)}
        </div>
        <div className="mb-trackpad" />
      </div>
    </div>
  );
}

function GamingPCVisual({ rotation }: { rotation: number }) {
  return (
    <div className="gaming-pc-3d" style={{ transform: `rotateY(${rotation % 360}deg)` }}>
      <div className="pc-case">
        <div className="pc-top-strip" />
        <div className="pc-window-area">
          <div className="pc-fan-unit">
            <div className="pc-fan-ring"><div className="pc-fan-hub" /></div>
          </div>
          <div className="pc-fan-unit">
            <div className="pc-fan-ring"><div className="pc-fan-hub" /></div>
          </div>
          <div className="pc-gpu-bar" />
        </div>
        <div className="pc-footer">
          <div className="pc-rgb-strip" />
          <div className="pc-io">
            <div className="pc-bay" /><div className="pc-bay" />
            <div className="pc-usb" /><div className="pc-usb" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DevicePopup({ type, onClose }: { type: "macos" | "linux"; onClose: () => void }) {
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const startRot = useRef(0);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  useEffect(() => {
    if (dragging) return;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last; last = now;
      setRotation(r => r + dt * 0.04);
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [dragging]);

  const onMD = (e: React.MouseEvent) => { setDragging(true); startX.current = e.clientX; startRot.current = rotation; };
  const onMM = (e: React.MouseEvent) => { if (!dragging) return; setRotation(startRot.current + (e.clientX - startX.current) * 0.6); };
  const onMU = () => setDragging(false);

  return (
    <div className="device-overlay" onClick={onClose}>
      <div className="device-modal" onClick={e => e.stopPropagation()}>
        <button className="device-close" onClick={onClose}>×</button>
        <div className="device-scene" onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}
          style={{ cursor: dragging ? "grabbing" : "grab" }}>
          {type === "macos" ? <MacBookVisual rotation={rotation} /> : <GamingPCVisual rotation={rotation} />}
        </div>
        <div className="device-info">
          {type === "macos" ? (
            <>
              <h3>M4 MacBook Pro 16&quot;</h3>
              <div className="device-specs">
                <span>Apple M4 Pro · 24 GB Unified Memory</span>
                <span>512 GB SSD · Liquid Retina XDR</span>
                <span>macOS Sequoia · Space Black</span>
              </div>
            </>
          ) : (
            <>
              <h3>Custom Gaming PC</h3>
              <div className="device-specs">
                <span>Ryzen 7 7800X3D · RTX 4070 Ti Super</span>
                <span>32 GB DDR5 6000 · 2 TB NVMe SSD</span>
                <span>Windows 11 Pro · Ubuntu 24.04 dual</span>
              </div>
            </>
          )}
        </div>
        <div className="device-hint">drag to rotate</div>
      </div>
    </div>
  );
}

// ─── Stuff ────────────────────────────────────────────────────────────────────
function StuffCard() {
  const [popup, setPopup] = useState<null | "macos" | "linux">(null);

  const sections = [
    {
      title: "> LANGS",
      items: [
        { label: "C#", sub: "primary", icon: I.cs },
        { label: "Python", icon: I.py },
        { label: "JavaScript", icon: I.brand },
      ],
    },
    {
      title: "> FRAMEWORKS",
      items: [
        { label: ".NET / Blazor", icon: I.cs },
        { label: "Next.js", icon: I.code },
        { label: "React", icon: I.brand },
        { label: "Tailwind CSS", icon: I.code },
        { label: "WPF", icon: I.windows },
      ],
    },
    {
      title: "> HARDWARE",
      items: [
        { label: "macOS", sub: "M4 Pro 16\"", icon: I.apple },
        { label: "Linux", sub: "Ryzen 7 · RTX 4070 Ti", icon: I.linux },
      ],
    },
    {
      title: "> PERIPHERALS",
      items: [
        { label: "MX Master 3S", sub: "Logitech · Mouse", icon: I.mouse },
        { label: "MX Mechanical Mini", sub: "Logitech · Keyboard", icon: I.kbd },
      ],
    },
  ];

  const handleClick = (label: string) => {
    if (label === "macOS") { setPopup("macos"); return; }
    if (label === "Linux") { setPopup("linux"); return; }
  };

  return (
    <>
      {popup && <DevicePopup type={popup} onClose={() => setPopup(null)} />}
      <div className="card stuff gd-stuff" data-card="Techstack">
        <div className="card-h">{I.tool}Techstack</div>
        {sections.map((sec) => (
          <div className="stuff-section" key={sec.title}>
            <h4>{sec.title}</h4>
            <div className="stuff-grid">
              {sec.items.map((it) => (
                <div
                  className={`stuff-item${it.label === "macOS" || it.label === "Linux" ? " clickable" : ""}`}
                  key={it.label}
                  onClick={e => { e.stopPropagation(); handleClick(it.label); }}
                >
                  <span className="ic">{it.icon}</span>
                  <span>{it.label}{it.sub && <small> · {it.sub}</small>}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Socials ─────────────────────────────────────────────────────────────────
function SocialsRow() {
  const items = [
    { cls: "gh", lbl: "GitHub",   handle: "/Ni7i",              icon: I.git,     href: "https://github.com/Ni7i" },
    { cls: "li", lbl: "LinkedIn", handle: "/enis-shorra",       icon: I.link,    href: "https://linkedin.com/in/enis-shorra" },
    { cls: "em", lbl: "Email",    handle: "shorra.enis@hotmail",icon: I.mail,    href: "mailto:shorra.enis@hotmail.com" },
    { cls: "dc", lbl: "Discord",  handle: "nisi_17",             icon: I.discord, href: "https://discord.com/users/nisi_17" },
  ];
  return (
    <div className="socials">
      {items.map((it, i) => (
        <a key={i} className={`social ${it.cls}`} href={it.href} target="_blank" rel="noreferrer">
          <div className="icon">{it.icon}</div>
          <div className="meta">
            <span className="lbl">{it.lbl}</span>
            <span className="handle">{it.handle}</span>
          </div>
        </a>
      ))}
    </div>
  );
}

// ─── Easter Egg (Konami Code) ─────────────────────────────────────────────────
function EasterEgg({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onClose]);

  return (
    <div className="device-overlay egg-overlay" onClick={onClose}>
      <div className="egg-modal" onClick={e => e.stopPropagation()}>
        <button className="device-close" onClick={onClose}>×</button>
        <div className="egg-header">
          <span className="egg-badge">{I.lock} Achievement Unlocked</span>
          <h2>Enis&apos; Secret Lab</h2>
          <p className="egg-sub">You found the hidden area. Konami-Code FTW.</p>
        </div>

        <div className="egg-content">
          <div className="egg-section">
            <h4>⚠️ Failed Projects</h4>
            <div className="egg-items">
              <div className="egg-item">
                <span className="egg-name">RPGEngine v0.1</span>
                <span className="egg-note">3 Monate gebaut, dann gemerkt: zu ambitioniert, zu früh. 4.200 Zeilen für den Mülleimer.</span>
              </div>
              <div className="egg-item">
                <span className="egg-name">CryptoAlert</span>
                <span className="egg-note">Fertig gebaut. Deployed. Der Markt crashte zwei Tage später. RIP.</span>
              </div>
              <div className="egg-item">
                <span className="egg-name">SocialHub</span>
                <span className="egg-note">0 User. Hat mir mehr beigebracht als jede Erfolgsgeschichte — Build vs Ship.</span>
              </div>
            </div>
          </div>

          <div className="egg-section">
            <h4>📜 Message to Future Enis</h4>
            <div className="egg-letters">
              <div className="egg-letter">
                <span className="egg-year">2025</span>
                <p>Du bist 17, lernst C# und träumst davon, ICT zu gewinnen. Hör nicht auf zu coden — es wird sich lohnen. Kümmere dich um die Familie. Schreib sauberen Code. Der Rest kommt von allein.</p>
              </div>
              <div className="egg-letter egg-letter-future">
                <span className="egg-year">2026 →</span>
                <p className="egg-placeholder">// Wird am Ende des Jahres geschrieben...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



// ─── Lightning Overlay ────────────────────────────────────────────────────────
function LightningOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf: number;

    interface Bolt {
      pts: [number, number][];
      born: number;
      life: number;
    }
    const bolts: Bolt[] = [];

    const spawn = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      if (!w || !h) return;
      const x1 = 20 + Math.random() * (w - 40);
      const y1 = 20 + Math.random() * (h - 40);
      const angle = (Math.random() - 0.5) * Math.PI * 0.9;
      const len = 70 + Math.random() * 160;
      const x2 = x1 + Math.cos(angle) * len;
      const y2 = y1 + Math.sin(angle) * len;
      const segs = 5 + Math.floor(Math.random() * 5);
      const dx = x2 - x1, dy = y2 - y1;
      const perpX = -dy / len, perpY = dx / len;
      const pts: [number, number][] = [[x1, y1]];
      for (let i = 1; i < segs; i++) {
        const t = i / segs;
        const jitter = (Math.random() - 0.5) * 28;
        pts.push([x1 + dx * t + perpX * jitter, y1 + dy * t + perpY * jitter]);
      }
      pts.push([x2, y2]);
      bolts.push({ pts, born: performance.now(), life: 90 + Math.random() * 70 });
    };

    const draw = (now: number) => {
      const dpr = window.devicePixelRatio || 1;
      const cw = Math.round(canvas.offsetWidth * dpr);
      const ch = Math.round(canvas.offsetHeight * dpr);
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx || !cw || !ch) { raf = requestAnimationFrame(draw); return; }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      for (let i = bolts.length - 1; i >= 0; i--) {
        const b = bolts[i];
        const age = now - b.born;
        if (age > b.life) { bolts.splice(i, 1); continue; }
        const p = age / b.life;
        const alpha = p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85;

        // Glow pass
        ctx.save();
        ctx.globalAlpha = alpha * 0.22;
        ctx.strokeStyle = "#ff6a1a";
        ctx.lineWidth = 3;
        ctx.shadowColor = "#ff6a1a";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(b.pts[0][0], b.pts[0][1]);
        for (let j = 1; j < b.pts.length; j++) ctx.lineTo(b.pts[j][0], b.pts[j][1]);
        ctx.stroke();
        ctx.restore();

        // Core bolt
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = "#ffb060";
        ctx.lineWidth = 0.8;
        ctx.shadowColor = "#ff8030";
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.moveTo(b.pts[0][0], b.pts[0][1]);
        for (let j = 1; j < b.pts.length; j++) ctx.lineTo(b.pts[j][0], b.pts[j][1]);
        ctx.stroke();
        ctx.restore();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    let tid: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = 7000 + Math.random() * 13000;
      tid = setTimeout(() => {
        spawn();
        if (Math.random() < 0.25) setTimeout(spawn, 80 + Math.random() * 120);
        schedule();
      }, delay);
    };
    tid = setTimeout(() => { spawn(); schedule(); }, 4000 + Math.random() * 4000);

    return () => { clearTimeout(tid); cancelAnimationFrame(raf); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 20 }}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [easterEgg, setEasterEgg] = useState(false);
  const konamiSeq = useRef<string[]>([]);
  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

  // Card glow
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      document.querySelectorAll<HTMLElement>(".card, .social").forEach(el => {
        const r = el.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
          el.style.setProperty("--mx", `${e.clientX - r.left}px`);
          el.style.setProperty("--my", `${e.clientY - r.top}px`);
        }
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Konami code
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      konamiSeq.current = [...konamiSeq.current, e.key].slice(-KONAMI.length);
      if (konamiSeq.current.join(",") === KONAMI.join(",")) setEasterEgg(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      {easterEgg && <EasterEgg onClose={() => setEasterEgg(false)} />}
      {!loading && (
        <div className="app">
          <div id="main-grid" className="grid">
            <AboutCard />
            <GalleryCard />
            <WerdegangCard />
            <ConstellationCard />
            <MapCard countries={{}} />
            <GithubCard />
            <ContactCard />
            <TestimonialsCard />
            <StuffCard />
            <LightningOverlay />
          </div>
          <SocialsRow />
        </div>
      )}
    </>
  );
}
