"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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

// ─── Quran Tile Pattern ──────────────────────────────────────────────────────
function QuranTilePattern({ variant }: { variant: string }) {
  const patterns: Record<string, React.ReactNode> = {
    star8: (
      <svg viewBox="-50 -50 100 100" preserveAspectRatio="xMidYMid meet">
        <g fill="none" stroke="#fff" strokeWidth="0.4">
          <polygon points="0,-40 11,-11 40,0 11,11 0,40 -11,11 -40,0 -11,-11" />
          <polygon points="0,-30 8,-8 30,0 8,8 0,30 -8,8 -30,0 -8,-8" />
          <circle r="22" /><circle r="14" /><circle r="8" />
        </g>
      </svg>
    ),
    rings: (
      <svg viewBox="-50 -50 100 100">
        <g fill="none" stroke="#fff" strokeWidth="0.35">
          {[8, 16, 24, 32, 40].map((r, i) => <circle key={i} r={r} />)}
          {[0, 45, 90, 135].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            return <line key={i} x1={-44 * Math.cos(rad)} y1={-44 * Math.sin(rad)} x2={44 * Math.cos(rad)} y2={44 * Math.sin(rad)} />;
          })}
        </g>
      </svg>
    ),
    weave: (
      <svg viewBox="-50 -50 100 100">
        <g fill="none" stroke="#fff" strokeWidth="0.35">
          {[-30, -10, 10, 30].map((y, i) => <path key={i} d={`M -50 ${y} Q -25 ${y - 8}, 0 ${y} T 50 ${y}`} />)}
          {[-30, -10, 10, 30].map((x, i) => <path key={i} d={`M ${x} -50 Q ${x - 8} -25, ${x} 0 T ${x} 50`} />)}
        </g>
      </svg>
    ),
    grid: (
      <svg viewBox="-50 -50 100 100">
        <g fill="none" stroke="#fff" strokeWidth="0.3">
          <polygon points="0,-44 38,-22 38,22 0,44 -38,22 -38,-22" />
          <polygon points="0,-22 19,-11 19,11 0,22 -19,11 -19,-11" />
          {[0, 60, 120, 180, 240, 300].map((a, i) => {
            const rad = (a * Math.PI) / 180;
            return <line key={i} x1={0} y1={0} x2={44 * Math.cos(rad)} y2={44 * Math.sin(rad)} />;
          })}
        </g>
      </svg>
    ),
    bloom: (
      <svg viewBox="-50 -50 100 100">
        <g fill="none" stroke="#fff" strokeWidth="0.35">
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * 45 * Math.PI) / 180;
            return <ellipse key={i} cx={20 * Math.cos(a)} cy={20 * Math.sin(a)} rx="20" ry="8" transform={`rotate(${i * 45} ${20 * Math.cos(a)} ${20 * Math.sin(a)})`} />;
          })}
          <circle r="6" />
        </g>
      </svg>
    ),
    minimal: (
      <svg viewBox="-50 -50 100 100">
        <g fill="none" stroke="#fff" strokeWidth="0.4">
          <rect x="-40" y="-40" width="80" height="80" />
          <rect x="-30" y="-30" width="60" height="60" transform="rotate(45)" />
          <circle r="22" />
        </g>
      </svg>
    ),
  };
  return <div className="pattern">{patterns[variant] ?? patterns.star8}</div>;
}

// ─── Quran View ──────────────────────────────────────────────────────────────
function QuranView({ onClose }: { onClose: () => void }) {
  const [filter, setFilter] = useState<"surahs" | "reciters">("surahs");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const surahs = [
    { num: "01", tr: "Al-Fātiḥah",   reciter: "M. Ayyub",     pat: "star8",   c: 7,  size: "tall" },
    { num: "67", tr: "Al-Mulk",      reciter: "Y. Al-Dosari", pat: "rings",   c: 1,  size: "tall" },
    { num: "55", tr: "Ar-Raḥmān",    reciter: "M. Ayyub",     pat: "bloom",   c: 2,  size: "mid"  },
    { num: "18", tr: "Al-Kahf",      reciter: "Ali Jabir",    pat: "weave",   c: 3,  size: "tall" },
    { num: "02", tr: "Al-Baqarah",   reciter: "Y. Al-Dosari", pat: "grid",    c: 6,  size: "mid"  },
    { num: "36", tr: "Yā-Sīn",       reciter: "M. Ayyub",     pat: "star8",   c: 8,  size: "short"},
    { num: "112",tr: "Al-Ikhlāṣ",   reciter: "Ali Jabir",    pat: "minimal", c: 9,  size: "short"},
    { num: "113",tr: "Al-Falaq",     reciter: "Ali Jabir",    pat: "rings",   c: 10, size: "wide" },
    { num: "114",tr: "An-Nās",       reciter: "Ali Jabir",    pat: "minimal", c: 6,  size: "short"},
    { num: "78", tr: "An-Naba'",     reciter: "Y. Al-Dosari", pat: "weave",   c: 4,  size: "tall" },
    { num: "56", tr: "Al-Wāqi'ah",   reciter: "M. Ayyub",     pat: "bloom",   c: 5,  size: "mid"  },
    { num: "12", tr: "Yūsuf",        reciter: "M. Ayyub",     pat: "grid",    c: 1,  size: "mid"  },
    { num: "19", tr: "Maryam",       reciter: "Y. Al-Dosari", pat: "rings",   c: 3,  size: "tall" },
    { num: "20", tr: "Ṭā-Hā",        reciter: "M. Ayyub",     pat: "star8",   c: 9,  size: "short"},
    { num: "32", tr: "As-Sajdah",    reciter: "Ali Jabir",    pat: "weave",   c: 2,  size: "mid"  },
    { num: "44", tr: "Ad-Dukhān",    reciter: "Y. Al-Dosari", pat: "grid",    c: 5,  size: "short"},
    { num: "76", tr: "Al-Insān",     reciter: "M. Ayyub",     pat: "bloom",   c: 7,  size: "mid"  },
    { num: "85", tr: "Al-Burūj",     reciter: "Ali Jabir",    pat: "minimal", c: 10, size: "short"},
    { num: "97", tr: "Al-Qadr",      reciter: "Y. Al-Dosari", pat: "star8",   c: 4,  size: "short"},
    { num: "99", tr: "Az-Zalzalah",  reciter: "M. Ayyub",     pat: "rings",   c: 8,  size: "wide" },
  ];

  const reciters = [
    { num: "01", tr: "Muhammad Ayyub",       reciter: "Madinah", pat: "rings",   c: 5, size: "tall"  },
    { num: "02", tr: "Yasser Al-Dosari",     reciter: "Makkah",  pat: "star8",   c: 2, size: "mid"   },
    { num: "03", tr: "Ali Jabir",            reciter: "Madinah", pat: "bloom",   c: 7, size: "tall"  },
    { num: "04", tr: "Abdurrahman As-Sudais",reciter: "Makkah",  pat: "weave",   c: 1, size: "mid"   },
    { num: "05", tr: "Sa'ad Al-Ghamidi",     reciter: "Makkah",  pat: "grid",    c: 4, size: "short" },
    { num: "06", tr: "Maher Al-Muaiqly",     reciter: "Makkah",  pat: "minimal", c: 8, size: "short" },
  ];

  const data = filter === "surahs" ? surahs : reciters;

  return (
    <div className="quran-view">
      <button className="qv-home" onClick={onClose} aria-label="Go home">{I.home}</button>
      <div className="qv-toolbar">
        <div className="qv-pills">
          <button className={filter === "surahs" ? "active" : ""} onClick={() => setFilter("surahs")}>Surahs</button>
          <button className={filter === "reciters" ? "active" : ""} onClick={() => setFilter("reciters")}>Reciters</button>
        </div>
      </div>
      <div className="qv-grid">
        {data.map((s, i) => (
          <div key={`${filter}-${s.num}`} className={`qv-tile c-${s.c} t-${s.size}`} style={{ animationDelay: `${i * 35}ms` }}>
            <div className="inner">
              <QuranTilePattern variant={s.pat} />
              <span className="num">Surah · {s.num}</span>
              <div className="tr">{s.tr}</div>
              <span className="reciter">{s.reciter}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function AboutCard() {
  const stats = [
    { val: "17",  label: "Jahre" },
    { val: "2+",  label: "Yrs Dev" },
  ];
  const facts = [
    "Coden", "Islam", "Velo fahren", "Familie",
    "Gym", "Quran", "Kosovo", "Schweiz",
    "C# first", "ICT", "Bilal Sonses",
  ];
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
        {stats.map(s => (
          <div className="about-stat" key={s.label}>
            <span className="about-stat-val">{s.val}</span>
            <span className="about-stat-label">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="label-row">{I.spark} Things I love</div>
      <div className="about-facts">
        {facts.map((f, i) => (
          <span className="about-fact" key={i}>{f}</span>
        ))}
      </div>
      <pre className="about-ascii">{ascii}</pre>
    </div>
  );
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
const GALLERY_PHOTOS = [
  { src: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=600&h=400&fit=crop", full: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1600&q=90", alt: "Masjid al-Haram, Mecca" },
  { src: "https://images.unsplash.com/photo-1541862438-f02c53e4eced?w=600&h=400&fit=crop", full: "https://images.unsplash.com/photo-1541862438-f02c53e4eced?w=1600&q=90", alt: "Blue Mosque, Istanbul" },
  { src: "https://images.unsplash.com/photo-1553484771-898ed465e931?w=600&h=400&fit=crop", full: "https://images.unsplash.com/photo-1553484771-898ed465e931?w=1600&q=90", alt: "Camel, Arabian Desert" },
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

// ─── Reciting / Now Playing ───────────────────────────────────────────────────
const RECITERS = [
  {
    name: "Muhammad Ayyub",
    mosque: "Al-Nabawi · Madinah",
    surahs: [{ tr: "Al-Mulk", num: "67" }, { tr: "Al-Wāqiʿah", num: "56" }, { tr: "An-Naba'", num: "78" }],
    bg: "linear-gradient(135deg, #1e3a2a 0%, #0d1f16 100%)",
    thumbBg: "#2a4a3a",
  },
  {
    name: "Yasser Al-Dosari",
    mosque: "King Khalid · Riyadh",
    surahs: [{ tr: "Ar-Raḥmān", num: "55" }, { tr: "Al-Baqarah", num: "2" }, { tr: "Al-Kahf", num: "18" }],
    bg: "linear-gradient(135deg, #1e2a3a 0%, #0d1520 100%)",
    thumbBg: "#2a3a4a",
  },
  {
    name: "Ali Jabir",
    mosque: "Al-Haram · Makkah",
    surahs: [{ tr: "Al-Fātiḥah", num: "1" }, { tr: "Al-Ikhlāṣ", num: "112" }, { tr: "As-Sajdah", num: "32" }],
    bg: "linear-gradient(135deg, #3a1e1e 0%, #200d0d 100%)",
    thumbBg: "#4a2a2a",
  },
  {
    name: "Maher Al-Muaiqly",
    mosque: "Al-Haram · Makkah",
    surahs: [{ tr: "Yā-Sīn", num: "36" }, { tr: "Al-Mulk", num: "67" }, { tr: "Al-Fātiḥah", num: "1" }],
    bg: "linear-gradient(135deg, #2a1e3a 0%, #160d20 100%)",
    thumbBg: "#3a2a4a",
  },
];

interface NowPlaying {
  playing: boolean;
  track?: { name: string; artist: string; album: string; image: string; url: string };
}

function useLastFm(): NowPlaying {
  const [data, setData] = useState<NowPlaying>({ playing: false });
  useEffect(() => {
    const poll = () => {
      fetch("/api/lastfm")
        .then(r => r.json())
        .then((d: NowPlaying) => setData(d))
        .catch(() => {});
    };
    poll();
    const t = setInterval(poll, 30_000);
    return () => clearInterval(t);
  }, []);
  return data;
}

function RecitingCard({ onOpen }: { onOpen: () => void }) {
  const [idx, setIdx] = useState(0);
  const lastfm = useLastFm();

  useEffect(() => {
    if (lastfm.playing) return;
    const t = setInterval(() => setIdx(i => (i + 1) % RECITERS.length), 6000);
    return () => clearInterval(t);
  }, [lastfm.playing]);

  const r = RECITERS[idx];

  if (lastfm.playing && lastfm.track) {
    const t = lastfm.track;
    return (
      <div className="card reciting gd-reciting" data-card="Now Playing">
        <div className="card-h">
          {I.music}What I&apos;m Hearing
          <span className="np-badge">live</span>
        </div>
        <a className="rec-art np-art" href={t.url} target="_blank" rel="noopener noreferrer"
          style={{ backgroundImage: t.image ? `url(${t.image})` : undefined }}
          onClick={e => e.stopPropagation()}>
          {!t.image && <div className="np-art-placeholder">{I.music}</div>}
          <div className="rec-art-overlay">
            <div className="rec-name-big">{t.name}</div>
            <div className="rec-mosque-label">{t.artist}</div>
          </div>
        </a>
        <div className="np-meta"><span className="np-album">{t.album || "—"}</span></div>
        <div className="rec-thumbs">
          {RECITERS.map((rc, i) => (
            <div key={i} className={`rec-thumb${i === idx ? " active" : ""}`}
              style={{ background: rc.thumbBg }}
              onClick={e => { e.stopPropagation(); onOpen(); }}
              title={rc.name}>
              <span className="rec-thumb-init">{rc.name.split(" ").slice(0, 2).map(w => w[0]).join("")}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card reciting gd-reciting" data-card="What I'm Hearing" onClick={onOpen}>
      <div className="card-h">{I.music}What I&apos;m Hearing</div>
      <div className="rec-art" style={{ background: r.bg }}>
        <div className="rec-art-pattern">
          <svg viewBox="0 0 200 200" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" opacity="0.07">
            {[20,40,60,80,100].map(r2 => <circle key={r2} cx="100" cy="160" r={r2} fill="none" stroke="#fff" strokeWidth="1"/>)}
            {[0,30,60,90,120,150].map((a,i) => {
              const rad = a * Math.PI / 180;
              return <line key={i} x1="100" y1="160" x2={100 + 110*Math.cos(rad)} y2={160 + 110*Math.sin(rad)} stroke="#fff" strokeWidth="0.5"/>;
            })}
          </svg>
        </div>
        <div className="rec-art-overlay">
          <div className="rec-name-big">{r.name}</div>
          <div className="rec-mosque-label">{r.mosque}</div>
        </div>
      </div>
      <div className="rec-chips">
        {r.surahs.map(s => (
          <span key={s.num} className="rec-chip">{s.tr}<span className="rec-chip-num"> · {s.num}</span></span>
        ))}
      </div>
      <div className="rec-thumbs">
        {RECITERS.map((rc, i) => (
          <div key={i} className={`rec-thumb${i === idx ? " active" : ""}`}
            style={{ background: rc.thumbBg }}
            onClick={e => { e.stopPropagation(); setIdx(i); }}
            title={rc.name}>
            <span className="rec-thumb-init">{rc.name.split(" ").slice(0, 2).map(w => w[0]).join("")}</span>
          </div>
        ))}
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

function ConstellationCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const hoveredRef = useRef<number | null>(null);
  const mouseRef = useRef<{ nx: number; ny: number } | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    let raf: number;
    let t = 0;

    const syncSize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    syncSize();
    const obs = new ResizeObserver(syncSize);
    obs.observe(wrap);

    const draw = () => {
      syncSize();
      const ctx = canvas.getContext("2d");
      if (!ctx) { raf = requestAnimationFrame(draw); return; }
      const W = canvas.width;
      const H = canvas.height;
      if (W === 0 || H === 0) { raf = requestAnimationFrame(draw); return; }
      const dpr = window.devicePixelRatio || 1;

      ctx.clearRect(0, 0, W, H);

      // Background ambient stars
      for (let i = 0; i < 60; i++) {
        const sx = ((i * 137.5 * 19) % W);
        const sy = ((i * 137.5 * 31) % H);
        const sa = 0.3 + 0.15 * Math.sin(t * 0.3 + i);
        ctx.beginPath();
        ctx.arc(sx, sy, 1.2 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${sa})`;
        ctx.fill();
      }

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
          ctx.strokeStyle = `${star.color}25`;
          ctx.lineWidth = 1 * dpr;
          ctx.stroke();
        });
      });

      // Stars
      STAR_DATA.forEach((star, i) => {
        const x = star.nx * W;
        const y = star.ny * H;
        const twinkle = 0.8 + 0.2 * Math.sin(t * 0.9 + star.phase);
        const isHov = hoveredRef.current === i;
        const baseR = (star.stars + 3) * dpr;
        const r = baseR * (isHov ? 2.2 : 1) * twinkle;

        const grd = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
        grd.addColorStop(0, star.color + "cc");
        grd.addColorStop(0.35, star.color + "44");
        grd.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(x, y, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = isHov ? "#ffffff" : star.color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${isHov ? 0.9 : 0.55})`;
        ctx.fill();
      });

      // Cursor dot + URL-style tooltip
      const mouse = mouseRef.current;
      if (mouse) {
        const mx = mouse.nx * W;
        const my = mouse.ny * H;

        // Subtle cursor dot
        ctx.beginPath();
        ctx.arc(mx, my, 2.5 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.28)";
        ctx.fill();

        if (hoveredRef.current !== null) {
          const star = STAR_DATA[hoveredRef.current];
          const rawUrl = (star as { url?: string }).url;
          const label = rawUrl
            ? rawUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
            : `github.com/Ni7i/${star.name}`;

          const fontSize = 11 * dpr;
          ctx.font = `${fontSize}px monospace`;
          const textW = ctx.measureText(label).width;
          const padX = 11 * dpr;
          const pillH = 24 * dpr;
          const pillW = textW + padX * 2;

          let px = mx - pillW / 2;
          let py = my - pillH - 14 * dpr;
          if (px < 4 * dpr) px = 4 * dpr;
          if (px + pillW > W - 4 * dpr) px = W - pillW - 4 * dpr;
          if (py < 4 * dpr) py = my + 16 * dpr;

          // Pill background
          ctx.fillStyle = "rgba(13,13,17,0.93)";
          ctx.beginPath();
          ctx.roundRect(px, py, pillW, pillH, pillH / 2);
          ctx.fill();

          // Subtle color accent border
          ctx.strokeStyle = `${star.color}40`;
          ctx.lineWidth = 1 * dpr;
          ctx.beginPath();
          ctx.roundRect(px, py, pillW, pillH, pillH / 2);
          ctx.stroke();

          // URL text
          ctx.fillStyle = "#c4c0ba";
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
      obs.disconnect();
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hoveredRef.current !== null) {
      const star = STAR_DATA[hoveredRef.current];
      const url = (star as { url?: string }).url ?? `https://github.com/Ni7i/${star.name}`;
      window.open(url, "_blank", "noopener");
    }
  };

  return (
    <div className="card constellation gd-sta" data-card="Projects" onClick={handleClick}>
      <div className="card-h">
        {I.spark}Projects · Constellation
        <span className="con-hint">hover stars</span>
      </div>
      <div ref={wrapRef} className="constellation-wrap">
        <canvas
          ref={canvasRef}
          className="constellation-canvas"
          style={{ cursor: hovered !== null ? "pointer" : "crosshair" }}
        />
      </div>
    </div>
  );
}

// ─── Map ──────────────────────────────────────────────────────────────────────
function MapCard({ countries }: { countries: Record<string, number> }) {
  const topCountries = Object.entries(countries)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="card map gd-map" data-card="Map">
      <div className="map-tag">Switzerland · Home</div>
      {topCountries.length > 0 && (
        <div className="map-visitors">
          {topCountries.map(([cc, n]) => (
            <span key={cc} className="map-visitor-badge">{cc} {n}</span>
          ))}
        </div>
      )}
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
        const base = r + recency * 0.4 - 0.15;
        let level = 0;
        if (base > 0.18) level = 1;
        if (base > 0.42) level = 2;
        if (base > 0.66) level = 3;
        if (base > 0.86) level = 4;
        if ((d === 5 || d === 6) && r > 0.6) level = Math.max(0, level - 1);
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
    <div className="card github gd-github" data-card="GitHub">
      <div className="label-row">
        <div className="card-h" style={{ margin: 0 }}>{I.git}GitHub</div>
        <span className="handle">@Ni7i</span>
        {totalReal !== null && <span className="commit-count">{totalReal}+ commits</span>}
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
const TESTIMONIALS = [
  {
    quote: "Enis lieferte unser Projekt schneller als jeder Freelancer, mit dem ich je gearbeitet habe. Sauberer Code, kein Hin und Her.",
    name: "Luca M.",
    role: "Founder, TechStartup Basel",
  },
  {
    quote: "Absolute attention to detail in UI. The app looked exactly like the Figma mockup — no approximations, no excuses.",
    name: "Sophie K.",
    role: "Product Designer, Zürich",
  },
  {
    quote: "He spots problems before you explain them. Reliable, sharp, and fast. I'd work with him again without hesitation.",
    name: "Noah T.",
    role: "Developer, Berlin",
  },
];

function TestimonialsCard() {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % TESTIMONIALS.length);
        setFade(true);
      }, 300);
    }, 7000);
    return () => clearInterval(t);
  }, []);

  const tes = TESTIMONIALS[idx];

  return (
    <div className="card testimonials gd-tes" data-card="Testimonials">
      <div className="card-h">{I.spark}Testimonials</div>
      <div className={`tes-body${fade ? " visible" : ""}`}>
        <p className="tes-text">&ldquo;{tes.quote}&rdquo;</p>
        <div className="tes-meta">
          <span className="tes-name">{tes.name}</span>
          <span className="tes-role">{tes.role}</span>
        </div>
      </div>
      <div className="tes-dots">
        {TESTIMONIALS.map((_, i) => (
          <button key={i} className={`tes-dot${i === idx ? " active" : ""}`}
            onClick={e => { e.stopPropagation(); setIdx(i); setFade(true); }} />
        ))}
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
          <textarea value={msg} onChange={e => setMsg(e.target.value)} placeholder="Nachricht…" required rows={3} />
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
const TECH_GITHUB: Record<string, string> = {
  "C#":            "https://github.com/Ni7i?tab=repositories&language=c%23",
  "Python":        "https://github.com/Ni7i?tab=repositories&language=python",
  "JavaScript":    "https://github.com/Ni7i?tab=repositories&language=javascript",
  "TypeScript":    "https://github.com/Ni7i?tab=repositories&language=typescript",
  ".NET / Blazor": "https://github.com/Ni7i?tab=repositories&language=c%23",
  "Next.js":       "https://github.com/Ni7i/memyselfandi",
  "React":         "https://github.com/Ni7i?tab=repositories&language=typescript",
  "WPF":           "https://github.com/Ni7i/whiteplayer",
};

function StuffCard() {
  const [popup, setPopup] = useState<null | "macos" | "linux">(null);

  const sections = [
    {
      title: "> LANGS",
      items: [
        { label: "C#", sub: "primary", icon: I.cs },
        { label: "Python", icon: I.py },
        { label: "SQL", icon: I.code },
        { label: "JavaScript", icon: I.brand },
      ],
    },
    {
      title: "> FRAMEWORKS",
      items: [
        { label: ".NET / Blazor", icon: I.cs },
        { label: "Next.js", icon: I.code },
        { label: "React", icon: I.brand },
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
    const url = TECH_GITHUB[label];
    if (url) window.open(url, "_blank", "noopener");
  };

  return (
    <>
      {popup && <DevicePopup type={popup} onClose={() => setPopup(null)} />}
      <div className="card stuff gd-stuff" data-card="Stuff I Use">
        <div className="card-h">{I.tool}Stuff I Use</div>
        {sections.map((sec) => (
          <div className="stuff-section" key={sec.title}>
            <h4>{sec.title}</h4>
            <div className="stuff-grid">
              {sec.items.map((it) => (
                <div
                  className={`stuff-item${TECH_GITHUB[it.label] || it.label === "macOS" || it.label === "Linux" ? " clickable" : ""}`}
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

// ─── Floating Widget (Likes + Visitors) ──────────────────────────────────────
function FloatingWidget() {
  const [likes, setLikes] = useState(0);
  const [visitors, setVisitors] = useState(0);
  const [liked, setLiked] = useState(false);
  const [popped, setPopped] = useState(false);

  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.json())
      .then((d: { likes: number; visitors: number }) => {
        setLikes(d.likes || 0);
        setVisitors(d.visitors || 0);
      })
      .catch(() => {});
    setLiked(localStorage.getItem("enis_liked") === "1");
  }, []);

  const handleLike = useCallback(() => {
    if (liked) return;
    setLiked(true);
    setLikes(l => l + 1);
    setPopped(true);
    localStorage.setItem("enis_liked", "1");
    setTimeout(() => setPopped(false), 700);
    fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "like" }),
    }).catch(() => {});
  }, [liked]);

  return (
    <div className="floating-widget">
      <button
        className={`fw-btn fw-like${liked ? " liked" : ""}${popped ? " pop" : ""}`}
        onClick={handleLike}
        title={liked ? "Already liked!" : "Like this portfolio"}
      >
        <span className="fw-icon">{I.heart}</span>
        <span className="fw-count">{likes}</span>
      </button>
      <div className="fw-btn fw-visitors" title="Total visitors">
        <span className="fw-icon">{I.eye}</span>
        <span className="fw-count">{visitors}</span>
      </div>
    </div>
  );
}

// ─── Grid Snake (Glowing Dot Through Gaps) ───────────────────────────────────
function GridSnake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf: number;
    let progress = 0;
    let waypoints: [number, number][] = [];

    const computeWaypoints = () => {
      const grid = document.getElementById("main-grid");
      if (!grid) return;
      const gr = grid.getBoundingClientRect();
      const par = canvas.parentElement!.getBoundingClientRect();

      canvas.style.left = `${gr.left - par.left}px`;
      canvas.style.top = `${gr.top - par.top}px`;
      canvas.width = gr.width;
      canvas.height = gr.height;

      const findCard = (cls: string) => {
        const el = grid.querySelector(`.${cls}`) as HTMLElement;
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { l: r.left - gr.left, t: r.top - gr.top, r: r.right - gr.left, b: r.bottom - gr.top };
      };

      const abo = findCard("gd-about");
      const gal = findCard("gd-gallery");
      const sta = findCard("gd-sta");
      const map = findCard("gd-map");
      const git = findCard("gd-github");
      const tes = findCard("gd-tes");

      if (!abo || !gal || !sta || !map || !git || !tes) return;

      const W = gr.width, H = gr.height;
      const x1 = (abo.r + gal.l) / 2;
      const x2 = (gal.r + map.l) / 2;
      const x3 = (map.r + git.l) / 2;
      const y1 = (gal.b + sta.t) / 2;
      const y2 = (sta.b + tes.t) / 2;

      waypoints = [
        [0, y1], [x1, y1], [x1, 0],
        [x2, 0], [x2, y1], [x3, y1],
        [x3, 0], [W, y1], [W, y2],
        [x3, y2], [x3, H], [x2, H],
        [x2, y2], [x1, y2], [x1, H],
        [0, y2], [0, y1],
      ];
    };

    const getTotal = () => {
      let len = 0;
      for (let i = 1; i < waypoints.length; i++) {
        const dx = waypoints[i][0] - waypoints[i - 1][0];
        const dy = waypoints[i][1] - waypoints[i - 1][1];
        len += Math.sqrt(dx * dx + dy * dy);
      }
      return len;
    };

    const getPosAt = (dist: number): [number, number] => {
      let acc = 0;
      for (let i = 1; i < waypoints.length; i++) {
        const dx = waypoints[i][0] - waypoints[i - 1][0];
        const dy = waypoints[i][1] - waypoints[i - 1][1];
        const seg = Math.sqrt(dx * dx + dy * dy);
        if (acc + seg >= dist) {
          const t = (dist - acc) / seg;
          return [waypoints[i - 1][0] + dx * t, waypoints[i - 1][1] + dy * t];
        }
        acc += seg;
      }
      return waypoints[waypoints.length - 1];
    };

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx || waypoints.length < 2) { raf = requestAnimationFrame(draw); return; }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Static gap lines
      ctx.beginPath();
      ctx.moveTo(waypoints[0][0], waypoints[0][1]);
      for (let i = 1; i < waypoints.length; i++) ctx.lineTo(waypoints[i][0], waypoints[i][1]);
      ctx.strokeStyle = "rgba(240, 142, 127, 0.05)";
      ctx.lineWidth = 1;
      ctx.stroke();

      const total = getTotal();
      progress = (progress + 0.8) % total;

      // Trailing tail
      const tailLen = Math.min(60, total * 0.08);
      for (let i = 0; i < 12; i++) {
        const d = ((progress - (i * tailLen) / 12 + total) % total);
        const [tx, ty] = getPosAt(d);
        const alpha = (1 - i / 12) * 0.6;
        const r = (1 - i / 12) * 4;
        ctx.beginPath();
        ctx.arc(tx, ty, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 142, 127, ${alpha})`;
        ctx.fill();
      }

      // Head dot — solid, no glow halo
      const [hx, hy] = getPosAt(progress);
      ctx.beginPath();
      ctx.arc(hx, hy, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(240, 142, 127, 1)";
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };

    computeWaypoints();
    raf = requestAnimationFrame(draw);

    const obs = new ResizeObserver(computeWaypoints);
    const grid = document.getElementById("main-grid");
    if (grid) obs.observe(grid);

    return () => { cancelAnimationFrame(raf); obs.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className="grid-snake-canvas" />;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [quranOpen, setQuranOpen] = useState(false);
  const [easterEgg, setEasterEgg] = useState(false);
  const [countries, setCountries] = useState<Record<string, number>>({});
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

  // Visit tracking + stats
  useEffect(() => {
    fetch("/api/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "visit" }),
    }).catch(() => {});
    fetch("/api/stats")
      .then(r => r.json())
      .then((d: { countries?: Record<string, number> }) => { if (d.countries) setCountries(d.countries); })
      .catch(() => {});
  }, []);

  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      {quranOpen && <QuranView onClose={() => setQuranOpen(false)} />}
      {easterEgg && <EasterEgg onClose={() => setEasterEgg(false)} />}
      {!loading && (
        <div className="app">
          <div id="main-grid" className="grid">
            <AboutCard />
            <GalleryCard />
            <RecitingCard onOpen={() => setQuranOpen(true)} />
            <ConstellationCard />
            <MapCard countries={countries} />
            <GithubCard />
            <StuffCard />
            <TestimonialsCard />
            <ContactCard />
          </div>
          <SocialsRow />
          <FloatingWidget />
          <GridSnake />
        </div>
      )}
    </>
  );
}
