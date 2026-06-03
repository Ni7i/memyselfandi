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
  folder:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></svg>,
  map:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7z"/><path d="M9 4v13M15 7v13"/></svg>,
  git:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02a9.58 9.58 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.16.58.67.48A10 10 0 0 0 12 2z"/></svg>,
  chat:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a8 8 0 1 1 3 6l-3 1 1-3a8 8 0 0 1-1-4z"/></svg>,
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
    { num: "01", ar: "ٱلْفَاتِحَة", tr: "Al-Fātiḥah",   reciter: "M. Ayyub",     pat: "star8",   c: 7,  size: "tall" },
    { num: "67", ar: "ٱلْمُلْك",   tr: "Al-Mulk",      reciter: "Y. Al-Dosari", pat: "rings",   c: 1,  size: "tall" },
    { num: "55", ar: "ٱلرَّحْمَٰن", tr: "Ar-Raḥmān",    reciter: "M. Ayyub",     pat: "bloom",   c: 2,  size: "mid"  },
    { num: "18", ar: "ٱلْكَهْف",   tr: "Al-Kahf",      reciter: "Ali Jabir",    pat: "weave",   c: 3,  size: "tall" },
    { num: "02", ar: "ٱلْبَقَرَة",  tr: "Al-Baqarah",   reciter: "Y. Al-Dosari", pat: "grid",    c: 6,  size: "mid"  },
    { num: "36", ar: "يٰسٓ",       tr: "Yā-Sīn",       reciter: "M. Ayyub",     pat: "star8",   c: 8,  size: "short"},
    { num: "112",ar: "ٱلْإِخْلَاص", tr: "Al-Ikhlāṣ",   reciter: "Ali Jabir",    pat: "minimal", c: 9,  size: "short"},
    { num: "113",ar: "ٱلْفَلَق",   tr: "Al-Falaq",     reciter: "Ali Jabir",    pat: "rings",   c: 10, size: "wide" },
    { num: "114",ar: "ٱلنَّاس",    tr: "An-Nās",       reciter: "Ali Jabir",    pat: "minimal", c: 6,  size: "short"},
    { num: "78", ar: "ٱلنَّبَأ",    tr: "An-Naba'",     reciter: "Y. Al-Dosari", pat: "weave",   c: 4,  size: "tall" },
    { num: "56", ar: "ٱلْوَاقِعَة",  tr: "Al-Wāqi'ah",  reciter: "M. Ayyub",     pat: "bloom",   c: 5,  size: "mid"  },
    { num: "12", ar: "يُوسُف",      tr: "Yūsuf",        reciter: "M. Ayyub",     pat: "grid",    c: 1,  size: "mid"  },
    { num: "19", ar: "مَرْيَم",     tr: "Maryam",       reciter: "Y. Al-Dosari", pat: "rings",   c: 3,  size: "tall" },
    { num: "20", ar: "طٰهٰ",        tr: "Ṭā-Hā",        reciter: "M. Ayyub",     pat: "star8",   c: 9,  size: "short"},
    { num: "32", ar: "ٱلسَّجْدَة",  tr: "As-Sajdah",    reciter: "Ali Jabir",    pat: "weave",   c: 2,  size: "mid"  },
    { num: "44", ar: "ٱلدُّخَان",   tr: "Ad-Dukhān",    reciter: "Y. Al-Dosari", pat: "grid",    c: 5,  size: "short"},
    { num: "76", ar: "ٱلْإِنْسَان", tr: "Al-Insān",     reciter: "M. Ayyub",     pat: "bloom",   c: 7,  size: "mid"  },
    { num: "85", ar: "ٱلْبُرُوج",   tr: "Al-Burūj",     reciter: "Ali Jabir",    pat: "minimal", c: 10, size: "short"},
    { num: "97", ar: "ٱلْقَدْر",    tr: "Al-Qadr",      reciter: "Y. Al-Dosari", pat: "star8",   c: 4,  size: "short"},
    { num: "99", ar: "ٱلزَّلْزَلَة", tr: "Az-Zalzalah",  reciter: "M. Ayyub",     pat: "rings",   c: 8,  size: "wide" },
  ];

  const reciters = [
    { num: "01", ar: "محمد أيوب",          tr: "Muhammad Ayyub",       reciter: "Madinah", pat: "rings",   c: 5, size: "tall"  },
    { num: "02", ar: "ياسر الدوسري",        tr: "Yasser Al-Dosari",     reciter: "Makkah",  pat: "star8",   c: 2, size: "mid"   },
    { num: "03", ar: "علي جابر",           tr: "Ali Jabir",            reciter: "Madinah", pat: "bloom",   c: 7, size: "tall"  },
    { num: "04", ar: "عبد الرحمٰن السديس",  tr: "Abdurrahman As-Sudais",reciter: "Makkah",  pat: "weave",   c: 1, size: "mid"   },
    { num: "05", ar: "سعد الغامدي",         tr: "Sa'ad Al-Ghamidi",     reciter: "Makkah",  pat: "grid",    c: 4, size: "short" },
    { num: "06", ar: "ماهر المعيقلي",       tr: "Maher Al-Muaiqly",     reciter: "Makkah",  pat: "minimal", c: 8, size: "short" },
  ];

  const data = filter === "surahs" ? surahs : reciters;

  return (
    <div className="quran-view">
      <button className="qv-home" onClick={onClose} aria-label="Go home">
        {I.home}
      </button>
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
  const facts = ["Coden", "Islam", "Velo", "Familie", "Sport"];
  const ascii = `         ╱╲\n        ╱  ╲\n       ╱ ╱╲ ╲\n      ╱ ╱  ╲ ╲\n     ╱_╱____╲_╲`;
  return (
    <div className="card about gd-about" data-card="About">
      <div className="card-h">{I.wave}About Me</div>
      <h1>Hi, I&apos;m<span className="italic">Enis</span></h1>
      <p className="bio">
        I&apos;m a 17 y/o coder from Switzerland, currently working on <em>Stock&nbsp;Rendite</em> —
        learning the markets, one line of code at a time.
      </p>
      <div className="loc">
        {I.pin} Rudolfstetten, Switzerland
      </div>
      <div className="label-row">{I.spark} Things I love</div>
      <ul>
        {facts.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
      <pre className="about-ascii">{ascii}</pre>
    </div>
  );
}

// ─── Shoutouts ───────────────────────────────────────────────────────────────
function ShoutoutsCard() {
  const items = [
    { name: "Family", role: "Always" },
    { name: "The Brothers", role: "Deen Crew" },
    { name: "Gym Squad", role: "No Days Off" },
    { name: "Mom's Kitchen", role: "Inspiration" },
    { name: "School Mates", role: "Day Ones" },
    { name: "Late-night Coders", role: "The Grind" },
  ];
  return (
    <div className="card shouts gd-shouts">
      <div className="card-h">{I.wave}Shoutouts</div>
      <div className="shouts-grid">
        {items.map((it, i) => (
          <div className="pill" key={i}>
            <div className="icon">{I.home}</div>
            <div className="meta">
              <span className="name">{it.name}</span>
              <span className="role">{it.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Gallery ─────────────────────────────────────────────────────────────────
const GALLERY_PHOTOS = [
  { src: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400&h=280&fit=crop", full: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1600&q=90", alt: "Masjid al-Haram, Mecca" },
  { src: "https://images.unsplash.com/photo-1541862438-f02c53e4eced?w=400&h=280&fit=crop", full: "https://images.unsplash.com/photo-1541862438-f02c53e4eced?w=1600&q=90", alt: "Blue Mosque, Istanbul" },
  { src: "https://images.unsplash.com/photo-1553484771-898ed465e931?w=400&h=280&fit=crop", full: "https://images.unsplash.com/photo-1553484771-898ed465e931?w=1600&q=90", alt: "Camel, Arabian Desert" },
];

function GalleryCard() {
  const [open, setOpen] = useState<number | null>(null);

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

  return (
    <>
      <div className="card gallery gd-gallery" data-card="Gallery">
        <div className="card-h">{I.image}Gallery</div>
        <div className="gallery-stack">
          {GALLERY_PHOTOS.map((p, i) => (
            <div key={i} className={`gallery-photo p${i + 1}`} onClick={() => setOpen(i)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt={p.alt} />
            </div>
          ))}
        </div>
        <div className="gallery-label">tap to open</div>
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

// ─── Reciting ─────────────────────────────────────────────────────────────────
const RECITERS = [
  {
    name: "Muhammad Ayyub",     ar: "محمد أيوب",
    mosque: "Al-Nabawi · Madinah",
    surahs: [{ tr: "Al-Mulk", num: "67" }, { tr: "Al-Wāqiʿah", num: "56" }, { tr: "An-Naba'", num: "78" }],
    img: "/reciters/ayyub.jpg",
  },
  {
    name: "Yasser Al-Dosari",   ar: "ياسر الدوسري",
    mosque: "King Khalid · Riyadh",
    surahs: [{ tr: "Ar-Raḥmān", num: "55" }, { tr: "Al-Baqarah", num: "2" }, { tr: "Al-Kahf", num: "18" }],
    img: "/reciters/dosari.jpg",
  },
  {
    name: "Ali Jabir",          ar: "علي جابر",
    mosque: "Al-Haram · Makkah",
    surahs: [{ tr: "Al-Fātiḥah", num: "1" }, { tr: "Al-Ikhlāṣ", num: "112" }, { tr: "As-Sajdah", num: "32" }],
    img: "/reciters/jabir.jpg",
  },
  {
    name: "Maher Al-Muaiqly",   ar: "ماهر المعيقلي",
    mosque: "Al-Haram · Makkah",
    surahs: [{ tr: "Yā-Sīn", num: "36" }, { tr: "Al-Mulk", num: "67" }, { tr: "Al-Fātiḥah", num: "1" }],
    img: "/reciters/muaiqly.svg",
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
          {I.music}Now Playing
          <span className="np-badge">live</span>
        </div>
        <a
          className="rec-art np-art"
          href={t.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ backgroundImage: t.image ? `url(${t.image})` : undefined }}
          onClick={e => e.stopPropagation()}
        >
          {!t.image && <div className="np-art-placeholder">{I.music}</div>}
          <div className="rec-art-overlay">
            <div className="rec-name-big">{t.name}</div>
            <div className="rec-mosque-label">{t.artist}</div>
          </div>
        </a>
        <div className="np-meta">
          <span className="np-album">{t.album || "—"}</span>
        </div>
        <div className="rec-thumbs">
          {RECITERS.map((rc, i) => (
            <div
              key={i}
              className={`rec-thumb${i === idx ? " active" : ""}`}
              style={{ backgroundImage: `url(${rc.img})` }}
              onClick={onOpen}
              title={rc.name}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="card reciting gd-reciting" onClick={onOpen} data-card="Recitations">
      <div className="card-h">{I.music}Recitations</div>
      <div className="rec-art" style={{ backgroundImage: `url(${r.img})`, backgroundSize: "cover", backgroundPosition: "center top" }}>
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
          <div
            key={i}
            className={`rec-thumb${i === idx ? " active" : ""}`}
            style={{ backgroundImage: `url(${rc.img})` }}
            onClick={e => { e.stopPropagation(); setIdx(i); }}
            title={rc.name}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function NavCard({ onOpenQuran }: { onOpenQuran: () => void }) {
  const items = [
    { label: "Projects", icon: I.folder, action: () => {} },
    { label: "Gallery",  icon: I.image,  action: () => {} },
    { label: "Qur'an", icon: I.music, action: onOpenQuran },
    { label: "GitHub",   icon: I.git,    action: () => window.open("https://github.com/Ni7i", "_blank", "noopener") },
  ];
  return (
    <div className="card nav gd-nav" data-card="Navigation">
      <div className="card-h">{I.compass}Navigation</div>
      <div className="nav-list">
        {items.map((it, i) => (
          <button className="nav-item" key={i} onClick={it.action}>
            <span className="lead">{it.icon}</span>
            {it.label}
            <span className="arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────
const REPOS = [
  { name: "StockRendite",        lang: "C# / Blazor", year: "2026 →", desc: "Track holdings, see actual returns — active dev" },
  { name: "whiteplayer",         lang: "C# / WPF",    year: "2026", desc: "Minimal music player with custom WPF UI" },
  { name: "Quizlot",             lang: "TypeScript",  year: "2026", desc: "Quiz platform" },
  { name: "ICT-Regios-2026",     lang: "JavaScript",  year: "2026", desc: "ICT Regios competition project" },
  { name: "TrackMyFoodFrontend", lang: "JavaScript",  year: "2026", desc: "Food tracking app frontend" },
  { name: "Impostergame-WhoAmI", lang: "JavaScript",  year: "2026", desc: "First professional project in Rudolfstetten" },
  { name: "screentime-blocker",  lang: "JavaScript",  year: "2026", desc: "Website & app screen time management" },
  { name: "OaseJugendraum",      lang: "Python",      year: "2026", desc: "Youth room web app" },
  { name: "Swissskills25",       lang: "—",           year: "2026", desc: "Swiss Skills 2025 competition" },
  { name: "BudgetBudddy",        lang: "Python",      year: "2025", desc: "macOS blocker for websites & apps" },
  { name: "ReactProjekt",        lang: "JavaScript",  year: "2025", desc: "UI & code progress showcase" },
  { name: "midnight-calculator", lang: "C#",          year: "2025", desc: "Professional calculator for a local SME" },
  { name: "LCR",                 lang: "C#",          year: "2025", desc: "Little random OOP game" },
  { name: "Zitate",              lang: "Python",      year: "2025", desc: "Quotes collection app" },
  { name: "memyselfandi",        lang: "TypeScript",  year: "2026", desc: "This portfolio — enisshorra.ch" },
];

const LANG_COLOR: Record<string, string> = {
  "C#": "#7b3fcf", "C# / WPF": "#7b3fcf",
  "TypeScript": "#3178c6", "JavaScript": "#d4a017",
  "Python": "#3572a5", "HTML": "#e34c26", "—": "#555",
};

function ProjectsCard() {
  return (
    <div className="card projects gd-projects" data-card="Projects">
      <div className="card-h">
        {I.folder}Projects
        <span className="right">GitHub · @Ni7i</span>
      </div>
      <div className="proj-scroll">
        {REPOS.map((r) => (
          <a key={r.name} className="proj-repo" href={`https://github.com/Ni7i/${r.name}`} target="_blank" rel="noopener noreferrer">
            <div className="proj-repo-meta">
              <span className="proj-repo-name">{r.name}</span>
              <span className="proj-repo-desc">{r.desc}</span>
            </div>
            <span className="proj-repo-lang" style={{ borderColor: LANG_COLOR[r.lang] || "#444", color: LANG_COLOR[r.lang] || "#888" }}>
              {r.lang}
            </span>
            <span className="proj-repo-year">{r.year}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Map ──────────────────────────────────────────────────────────────────────
function MapCard() {
  return (
    <div className="card map gd-map" data-card="Map">
      <div className="map-tag">
        Switzerland · Home
      </div>
      <div className="leaflet-stage">
        <LeafletMap />
      </div>
    </div>
  );
}

// ─── GitHub ───────────────────────────────────────────────────────────────────
type GHEvent = { type: string; created_at: string; payload?: { commits?: unknown[] } };

function GithubCard() {
  const [weeks, setWeeks] = useState<number[][] | null>(null);

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
        events
          .filter(e => e.type === "PushEvent")
          .forEach(e => {
            const day = e.created_at?.slice(0, 10);
            if (day) counts[day] = (counts[day] || 0) + (e.payload?.commits?.length || 1);
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
    return labels.slice(0, 6);
  };

  return (
    <div className="card github gd-github" data-card="GitHub">
      <div className="label-row">
        <div className="card-h" style={{ margin: 0 }}>{I.git}GitHub</div>
        <span className="handle">@Ni7i</span>
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
        <span className="l" style={{ background: "#5a3a35" }} />
        <span className="l" style={{ background: "#9a5648" }} />
        <span className="l" style={{ background: "#d57367" }} />
        <span className="l" style={{ background: "#f08e7f" }} />
        more
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
        <form className="contact-form" onSubmit={handleSubmit}>
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
  const abs = Math.abs(((r % 360) + 360) % 360);
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
              <div className="mb-screen-text">M4 MacBook Pro</div>
            </div>
          </div>
        )}
      </div>
      <div className="mb-hinge" />
      <div className="mb-base">
        <div className="mb-keyboard" />
        <div className="mb-trackpad" />
      </div>
    </div>
  );
}

function GamingPCVisual({ rotation }: { rotation: number }) {
  const r = rotation % 360;
  return (
    <div className="gaming-pc-3d" style={{ transform: `rotateY(${r}deg)` }}>
      <div className="pc-tower">
        <div className="pc-top-bar" />
        <div className="pc-window">
          <div className="pc-fan"><div className="pc-fan-blade" /><div className="pc-fan-blade" /><div className="pc-fan-blade" /></div>
          <div className="pc-fan"><div className="pc-fan-blade" /><div className="pc-fan-blade" /><div className="pc-fan-blade" /></div>
        </div>
        <div className="pc-bottom-row">
          <div className="pc-led-strip" />
          <div className="pc-drive-bays">
            <div className="pc-bay" /><div className="pc-bay" />
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

  const onMD = (e: React.MouseEvent) => {
    setDragging(true);
    startX.current = e.clientX;
    startRot.current = rotation;
  };
  const onMM = (e: React.MouseEvent) => {
    if (!dragging) return;
    setRotation(startRot.current + (e.clientX - startX.current) * 0.6);
  };
  const onMU = () => setDragging(false);

  return (
    <div className="device-overlay" onClick={onClose}>
      <div className="device-modal" onClick={e => e.stopPropagation()}>
        <button className="device-close" onClick={onClose}>×</button>
        <div
          className="device-scene"
          onMouseDown={onMD}
          onMouseMove={onMM}
          onMouseUp={onMU}
          onMouseLeave={onMU}
          style={{ cursor: dragging ? "grabbing" : "grab" }}
        >
          {type === "macos" ? <MacBookVisual rotation={rotation} /> : <GamingPCVisual rotation={rotation} />}
        </div>
        <div className="device-info">
          {type === "macos" ? (
            <>
              <h3>M4 MacBook Pro</h3>
              <div className="device-specs">
                <span>Apple M4 Pro · 24 GB Unified Memory</span>
                <span>512 GB SSD · 16″ Liquid Retina XDR</span>
                <span>macOS Sequoia</span>
              </div>
            </>
          ) : (
            <>
              <h3>Custom Gaming PC</h3>
              <div className="device-specs">
                <span>AMD Ryzen 7 · RTX 4070</span>
                <span>32 GB DDR5 · 1 TB NVMe SSD</span>
                <span>Windows 11 Pro · Ubuntu dual-boot</span>
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
  "C#":          "https://github.com/Ni7i?tab=repositories&language=c%23",
  "Python":      "https://github.com/Ni7i?tab=repositories&language=python",
  "JavaScript":  "https://github.com/Ni7i?tab=repositories&language=javascript",
  "TypeScript":  "https://github.com/Ni7i?tab=repositories&language=typescript",
  ".NET / Blazor": "https://github.com/Ni7i/StockRendite",
  "Next.js":     "https://github.com/Ni7i/memyselfandi",
  "React":       "https://github.com/Ni7i?tab=repositories&language=typescript",
  "WPF":         "https://github.com/Ni7i/whiteplayer",
};

function StuffCard() {
  const [popup, setPopup] = useState<null | "macos" | "linux">(null);

  const sections = [
    {
      title: "Languages",
      items: [
        { label: "C#", sub: "primary", icon: I.cs },
        { label: "Python", icon: I.py },
        { label: "SQL", icon: I.code },
        { label: "JavaScript", icon: I.brand },
      ],
    },
    {
      title: "Frameworks",
      items: [
        { label: ".NET / Blazor", icon: I.cs },
        { label: "Next.js", icon: I.code },
        { label: "React", icon: I.brand },
        { label: "WPF", icon: I.windows },
      ],
    },
    {
      title: "Environment",
      items: [
        { label: "macOS", sub: "M4 Pro", icon: I.apple },
        { label: "Linux", sub: "Gaming PC", icon: I.linux },
        { label: "Windows", sub: "11 Pro", icon: I.windows },
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
                  onClick={() => handleClick(it.label)}
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [loading, setLoading] = useState(true);
  const [quranOpen, setQuranOpen] = useState(false);
  const cursorDot = useRef<HTMLDivElement | null>(null);
  const cursorRing = useRef<HTMLDivElement | null>(null);
  const cursorTooltip = useRef<HTMLDivElement | null>(null);
  const ringX = useRef(-200);
  const ringY = useRef(-200);
  const rafRef = useRef<number>(0);

  // custom cursor
  useEffect(() => {
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    const tip = document.createElement("div");
    tip.className = "cursor-tooltip";
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    document.body.appendChild(tip);
    cursorDot.current = dot;
    cursorRing.current = ring;
    cursorTooltip.current = tip;

    let mx = -200, my = -200;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;
      tip.style.transform = `translate(${mx + 14}px, ${my - 22}px)`;

      // tooltip: find hovered card label
      const card = (e.target as HTMLElement)?.closest<HTMLElement>("[data-card]");
      const label = card?.dataset.card ?? "";
      if (label) {
        tip.textContent = label;
        tip.classList.add("visible");
      } else {
        tip.classList.remove("visible");
      }

      // glow on cards
      const els = document.querySelectorAll<HTMLElement>(".card, .social");
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (mx >= r.left && mx <= r.right && my >= r.top && my <= r.bottom) {
          el.style.setProperty("--mx", `${mx - r.left}px`);
          el.style.setProperty("--my", `${my - r.top}px`);
        }
      });

      // ring hover expand
      const isInteractive = !!(e.target as HTMLElement)?.closest("a, button, [data-card]");
      ring.className = isInteractive ? "cursor-ring expanded" : "cursor-ring";
    };

    const animate = () => {
      ringX.current += (mx - ringX.current) * 0.12;
      ringY.current += (my - ringY.current) * 0.12;
      ring.style.transform = `translate(${ringX.current}px, ${ringY.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
      if (dot.parentNode) dot.parentNode.removeChild(dot);
      if (ring.parentNode) ring.parentNode.removeChild(ring);
      if (tip.parentNode) tip.parentNode.removeChild(tip);
    };
  }, []);

  return (
    <>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      {quranOpen && <QuranView onClose={() => setQuranOpen(false)} />}
      {!loading && (
        <div className="app">
          <div className="grid">
            <AboutCard />
            <GalleryCard />
            <RecitingCard onOpen={() => setQuranOpen(true)} />
            <NavCard onOpenQuran={() => setQuranOpen(true)} />
            <ProjectsCard />
            <MapCard />
            <StuffCard />
            <GithubCard />
            <ContactCard />
          </div>
          <SocialsRow />
        </div>
      )}
    </>
  );
}
