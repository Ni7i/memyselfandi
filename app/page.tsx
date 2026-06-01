"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import LoadingScreen from "@/components/LoadingScreen";

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
              <div className="ar">{s.ar}</div>
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
  const facts = [
    { de: "Coden", ar: "" },
    { de: "Islam", ar: "إسلام" },
    { de: "Sport", ar: "" },
    { de: "Familie", ar: "عائلة" },
    { de: "Kochen", ar: "" },
  ];
  const ascii = `         ╱╲\n        ╱  ╲\n       ╱ ╱╲ ╲\n      ╱ ╱  ╲ ╲\n     ╱_╱____╲_╲`;
  return (
    <div className="card about gd-about">
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
          <li key={i}>
            {f.de}
            {f.ar && <span className="ar">{f.ar}</span>}
          </li>
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
function GalleryCard() {
  return (
    <div className="card gallery gd-gallery">
      <div className="card-h">{I.image}Gallery</div>
      <div className="gallery-stack">
        <div className="gallery-photo alps"><div className="ph">Alps</div></div>
        <div className="gallery-photo code"><div className="ph">Setup</div></div>
        <div className="gallery-photo cay"><div className="ph">Çay</div></div>
      </div>
      <div className="gallery-vid">
        <iframe
          src="https://www.youtube.com/embed/sbSDGjnRqek?controls=0&modestbranding=1&rel=0&playsinline=1"
          title="Istanbul"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

// ─── Reciting ─────────────────────────────────────────────────────────────────
function RecitingCard({ onOpen }: { onOpen: () => void }) {
  const tracks = [
    { reciter: "Muhammad Ayyub",   surah: "Al-Mulk",   num: "67" },
    { reciter: "Yasser Al-Dosari", surah: "Ar-Rahman", num: "55" },
    { reciter: "Ali Jabir",        surah: "Al-Kahf",    num: "18" },
    { reciter: "Maher Al-Muaiqly", surah: "Al-Mulk",   num: "67" },
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % tracks.length), 5500);
    return () => clearInterval(t);
  }, [tracks.length]);
  const t = tracks[idx];
  return (
    <div className="card reciting gd-reciting" onClick={onOpen}>
      <div className="card-h">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>{I.music}Reciting</span>
        <span className="live"><span className="pulse" /><span>Live</span></span>
      </div>
      <div className="reciting-art">
        <svg className="geo" viewBox="-50 -50 100 100">
          <g fill="none" stroke="rgba(240,142,127,0.3)" strokeWidth="0.5">
            <circle r="44" /><circle r="34" /><circle r="24" />
            <polygon points="0,-34 9,-9 34,0 9,9 0,34 -9,9 -34,0 -9,-9" stroke="rgba(240,142,127,0.55)" strokeWidth="0.7" />
            {[0,30,60,90,120,150,180,210,240,270,300,330].map((a) => {
              const r = (a * Math.PI) / 180;
              return <line key={a} x1={0} y1={0} x2={44 * Math.cos(r)} y2={44 * Math.sin(r)} />;
            })}
          </g>
        </svg>
        <div className="arabic">ﷲ</div>
      </div>
      <div className="reciting-surah">
        {t.surah}<span className="num"> · {t.num}</span>
      </div>
      <div className="reciting-reciter">{t.reciter}</div>
      <div className="reciting-cta">
        <span>Open Library</span>
        <span>→</span>
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
    <div className="card nav gd-nav">
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
function ProjectsCard() {
  return (
    <div className="card projects gd-projects">
      <div className="card-h">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>{I.folder}Projects</span>
        <span className="right">Selected · 2026</span>
      </div>
      <div className="featured">
        <div>
          <div className="featured-head">
            <h3>Stock Rendite</h3>
            <span className="date">May 2026 — present</span>
          </div>
          <p>A tool I&apos;m building for myself — track holdings, see the actual return, learn the patterns. Boring on the outside, fun in the backend.</p>
          <div className="tag-row">
            <span className="tag">C#</span>
            <span className="tag">.NET</span>
            <span className="tag">Blazor</span>
            <span className="tag">PostgreSQL</span>
          </div>
        </div>
        <div className="featured-art">S</div>
      </div>
      <div className="project">
        <div style={{ flex: 1 }}>
          <div className="head">
            <h4>Home-Lab Scripts</h4>
            <span className="meta">ongoing</span>
          </div>
          <p>A growing pile of small Python &amp; Bash helpers running on my Linux box. Backups, monitoring, the little stuff that saves time.</p>
          <div className="tag-row">
            <span className="tag">Python</span>
            <span className="tag">Bash</span>
            <span className="tag">Linux</span>
          </div>
        </div>
      </div>
      <div className="project">
        <div style={{ flex: 1 }}>
          <div className="head">
            <h4>This portfolio</h4>
            <span className="meta">2026</span>
          </div>
          <p>A small attempt at putting my world on a single page — work, faith, the things that matter. Still iterating.</p>
          <div className="tag-row">
            <span className="tag">Next.js</span>
            <span className="tag">TypeScript</span>
            <a href="https://enisshorra.ch" target="_blank" rel="noopener noreferrer" className="tag tag-link">↗ enisshorra.ch</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Map ──────────────────────────────────────────────────────────────────────
function MapCard() {
  const pins = [
    { x: 50, y: 42, label: "Rudolfstetten · Home", home: true },
    { x: 56, y: 34, label: "Zürich" },
    { x: 40, y: 50, label: "Bern" },
    { x: 30, y: 56, label: "Genève" },
    { x: 64, y: 64, label: "Lugano" },
  ];
  const thumbs = [
    { x: 56, y: 24, cls: "zh", rot: -5, label: "ZRH" },
    { x: 32, y: 64, cls: "br", rot: 4,  label: "BRN" },
    { x: 72, y: 58, cls: "ti", rot: -2, label: "TI"  },
  ];
  return (
    <div className="card map gd-map">
      <div className="map-inner">
        <div className="map-tag">
          <span className="dot" />Switzerland · Home
        </div>
        <svg className="map-svg" viewBox="0 0 100 65" preserveAspectRatio="xMidYMid slice">
          <rect className="water" width="100" height="65" />
          <path className="land" d="M 0 0 L 100 0 L 100 22 L 90 24 L 78 22 L 66 20 L 54 22 L 40 24 L 28 26 L 14 28 L 0 30 Z" />
          <path className="land" d="M 0 50 L 12 46 L 22 50 L 36 54 L 50 58 L 64 60 L 78 56 L 92 54 L 100 56 L 100 65 L 0 65 Z" />
          <path className="land" d="M 0 30 L 0 50 L 8 38 Z" />
          <path className="land" d="M 92 24 L 100 22 L 100 56 L 92 54 Z" />
          <path className="land ch" d="M 8 38 L 14 30 L 22 28 L 30 30 L 36 26 L 44 24 L 52 22 L 60 20 L 68 22 L 76 24 L 84 28 L 90 34 L 88 42 L 84 48 L 78 52 L 72 56 L 64 58 L 56 60 L 50 56 L 44 58 L 36 56 L 28 54 L 20 50 L 12 44 L 8 38 Z" />
          <path className="border" d="M 8 38 L 14 30 L 22 28 L 30 30 L 36 26 L 44 24 L 52 22 L 60 20 L 68 22 L 76 24 L 84 28 L 90 34 L 88 42 L 84 48 L 78 52 L 72 56 L 64 58 L 56 60 L 50 56 L 44 58 L 36 56 L 28 54 L 20 50 L 12 44 L 8 38 Z" />
          <path className="contour" d="M 18 36 Q 38 30, 58 32 T 86 38" />
          <path className="contour" d="M 22 42 Q 42 38, 62 40 T 84 44" />
          <path className="contour" d="M 28 48 Q 48 46, 64 48 T 80 50" />
          <ellipse className="lake" cx="54" cy="38" rx="4" ry="1.3" />
          <ellipse className="lake" cx="40" cy="46" rx="3" ry="1.1" />
          <ellipse className="lake" cx="64" cy="46" rx="2.2" ry="0.9" />
          <text x="56" y="33">Zürich</text>
          <text x="40" y="49">Bern</text>
          <text x="30" y="55">Genève</text>
          <text x="64" y="63">Lugano</text>
        </svg>
        {thumbs.map((th, i) => (
          <div key={i} className={`map-thumb ${th.cls}`}
            style={{ left: `${th.x}%`, top: `${th.y}%`, ["--rot" as string]: `${th.rot}deg` }}>
            <div className="ph">{th.label}</div>
          </div>
        ))}
        {pins.map((p, i) => (
          <div key={i} className={`map-pin${p.home ? " home" : ""}`} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            <div className="head" />
            {!p.home && <div className="ripple" />}
            <div className="tip">{p.label}</div>
          </div>
        ))}
        <div className="map-controls">
          <button aria-label="zoom in">+</button>
          <button aria-label="zoom out">−</button>
        </div>
      </div>
    </div>
  );
}

// ─── GitHub ───────────────────────────────────────────────────────────────────
function GithubCard() {
  const weeks = useMemo(() => {
    const arr: number[][] = [];
    let seed = 11;
    for (let w = 0; w < 52; w++) {
      const week: number[] = [];
      for (let d = 0; d < 7; d++) {
        seed = (seed * 9301 + 49297) % 233280;
        const r = seed / 233280;
        const recency = w / 52;
        const base = r + recency * 0.35 - 0.2;
        let level = 0;
        if (base > 0.18) level = 1;
        if (base > 0.42) level = 2;
        if (base > 0.66) level = 3;
        if (base > 0.86) level = 4;
        if ((d === 5 || d === 6) && r > 0.55) level = Math.max(0, level - 1);
        week.push(level);
      }
      arr.push(week);
    }
    return arr;
  }, []);
  const months = ["Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May"];
  return (
    <div className="card github gd-github">
      <div className="label-row">
        <div className="card-h" style={{ margin: 0 }}>{I.git}GitHub</div>
        <span className="handle">@Ni7i</span>
      </div>
      <div className="month-row">
        {months.map((m, i) => <span key={i}>{m}</span>)}
      </div>
      <div className="heatmap">
        {weeks.map((week, i) => (
          <div className="hweek" key={i}>
            {week.map((lvl, j) => (
              <div className="hday" key={j} data-l={lvl} />
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

// ─── Board ────────────────────────────────────────────────────────────────────
interface Msg { id: number; who: string; when: string; text: string; }

function BoardCard() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    try {
      const s = localStorage.getItem("enis.board");
      if (s) setMsgs(JSON.parse(s));
    } catch { /* */ }
  }, []);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const msg: Msg = { id: Date.now(), who: "Anonymous", when: "just now", text };
    const updated = [msg, ...msgs].slice(0, 50);
    setMsgs(updated);
    setInput("");
    try { localStorage.setItem("enis.board", JSON.stringify(updated)); } catch { /* */ }
  };

  return (
    <div className="card board gd-board">
      <div className="card-h">{I.chat}Message Board</div>
      <div className="board-list">
        {msgs.length === 0
          ? <div className="board-empty">be the first to leave a note —<br />anonymous is fine</div>
          : msgs.map((m) => (
            <div className="msg" key={m.id}>
              <div className="head">
                <span className="who">{m.who}</span>
                <span className="when">{m.when}</span>
              </div>
              <div className="text">{m.text}</div>
            </div>
          ))
        }
      </div>
      <div className="board-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Leave a message…"
          aria-label="Message input"
        />
        <button onClick={send} aria-label="Send message">{I.send}</button>
      </div>
    </div>
  );
}

// ─── Stuff ────────────────────────────────────────────────────────────────────
function StuffCard() {
  return (
    <div className="card stuff gd-stuff">
      <div className="card-h">{I.tool}Stuff I Use</div>
      <div className="stuff-section">
        <h4>Languages</h4>
        <div className="stuff-grid">
          <div className="stuff-item"><span className="ic">{I.cs}</span>C# (durch und durch)</div>
          <div className="stuff-item"><span className="ic">{I.py}</span>Python</div>
          <div className="stuff-item"><span className="ic">{I.code}</span>SQL</div>
          <div className="stuff-item"><span className="ic">{I.brand}</span>JavaScript</div>
        </div>
      </div>
      <div className="stuff-section">
        <h4>Systems</h4>
        <div className="stuff-grid">
          <div className="stuff-item"><span className="ic">{I.apple}</span>macOS</div>
          <div className="stuff-item"><span className="ic">{I.linux}</span>Linux</div>
          <div className="stuff-item"><span className="ic">{I.windows}</span>Windows</div>
        </div>
      </div>
    </div>
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

  // mouse-tracked glow on .card and .social
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const els = document.querySelectorAll<HTMLElement>(".card, .social");
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
          el.style.setProperty("--mx", `${e.clientX - r.left}px`);
          el.style.setProperty("--my", `${e.clientY - r.top}px`);
        }
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // heatmap twinkle
  useEffect(() => {
    if (loading) return;
    const t = setInterval(() => {
      const days = document.querySelectorAll<HTMLElement>(".hday");
      if (!days.length) return;
      const pick = days[Math.floor(Math.random() * days.length)];
      pick.classList.add("twinkle");
      setTimeout(() => pick.classList.remove("twinkle"), 1200);
    }, 1100);
    return () => clearInterval(t);
  }, [loading]);

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
            <BoardCard />
          </div>
          <SocialsRow />
        </div>
      )}
    </>
  );
}
