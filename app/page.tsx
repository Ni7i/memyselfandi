"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import LoadingScreen from "@/components/LoadingScreen";
import InternshipAd from "@/components/InternshipAd";
import {
  personal, tech, hobbies, certificates, friends,
  projects, blogPosts, galleryPhotos, links,
} from "@/lib/data";

const MapClient = dynamic(() => import("@/components/MapClient"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", background: "#f0e8dc", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: 11, color: "#b4a090" }}>loading map…</span>
    </div>
  ),
});

// ─── Theme ─────────────────────────────────────────────────────────────────────
const C = {
  bg: "#f2ece3",
  card: "#fffef9",
  border: "#e4d8c8",
  borderHover: "#c4b0a0",
  text: "#2a1e12",
  muted: "#9a8070",
  faint: "#c8b8a8",
  purple: "#7c5cbf",
  pink: "#d45e7a",
  green: "#4a8a5a",
  orange: "#c87847",
  blue: "#4a78b8",
  tag: { bg: "#f0e8dc", color: "#7a6050", border: "#ddd0c0" },
};

// ─── Shared ─────────────────────────────────────────────────────────────────────
function card(extra?: React.CSSProperties): React.CSSProperties {
  return { background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden", transition: "border-color 0.2s, box-shadow 0.2s", ...extra };
}

function Lbl({ icon, text, color }: { icon: string; text: string; color?: string }) {
  return (
    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: color ?? C.faint, display: "flex", alignItems: "center", gap: 4, marginBottom: 10 }}>
      <span>{icon}</span><span>{text}</span>
    </div>
  );
}

function Tag({ t }: { t: string }) {
  return <span style={{ display: "inline-block", padding: "2px 7px", borderRadius: 20, fontSize: 9, background: C.tag.bg, color: C.tag.color, border: `1px solid ${C.tag.border}` }}>{t}</span>;
}

function hov(color = C.borderHover) {
  return {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = "0 2px 14px rgba(80,50,20,0.08)"; },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = "none"; },
  };
}

// ─── Photo Modal ───────────────────────────────────────────────────────────────
function PhotoModal({ photo, onClose }: { photo: typeof galleryPhotos[0]; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 9000, background: "rgba(30,15,5,0.85)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 820, width: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.src} alt={photo.title} style={{ width: "100%", maxHeight: "68vh", objectFit: "cover", borderRadius: 12, display: "block", boxShadow: "0 8px 40px rgba(0,0,0,0.5)" }} />
        <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{photo.title}</div>
            <div style={{ fontSize: 12, color: "#aaa", marginTop: 3 }}>📍 {photo.location} · {photo.date}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#888", fontSize: 22, cursor: "pointer" }}>✕</button>
        </div>
      </div>
    </div>
  );
}

// ─── 1. NAME CARD (center col2-3, row2-3) ─────────────────────────────────────
function NameCard() {
  return (
    <div style={{ ...card({ gridColumn: "2 / 4", gridRow: "2 / 4" }), background: "linear-gradient(135deg, #fffef9 0%, #fdf5ec 100%)" }} {...hov()}>
      <div style={{ padding: "18px 20px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>

        {/* Handwritten name */}
        <div>
          <div className="handwritten" style={{ fontSize: "clamp(38px, 4.5vw, 62px)", fontWeight: 700, lineHeight: 1, color: "#2a1e12", letterSpacing: "-0.01em" }}>
            Enis
          </div>
          <div className="handwritten" style={{
            fontSize: "clamp(38px, 4.5vw, 62px)", fontWeight: 700, lineHeight: 1, letterSpacing: "-0.01em",
            background: `linear-gradient(120deg, ${C.purple}, ${C.pink})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            Shorra
          </div>
          {/* pencil underline squiggle */}
          <svg width="120" height="10" viewBox="0 0 120 10" style={{ marginTop: 4, opacity: 0.5 }}>
            <path d="M2 7 Q20 2 38 7 Q56 12 74 7 Q92 2 110 7" stroke={C.purple} strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

        <div style={{ fontSize: 11, color: C.muted }}>{personal.role}</div>

        <p style={{ fontSize: 12, color: "#6a5040", lineHeight: 1.75, maxWidth: 320 }}>{personal.bio}</p>

        {/* Fun fact */}
        <div style={{ padding: "8px 10px", borderRadius: 8, background: "#fef8ee", border: `1px solid #f0e4cc`, fontSize: 10, color: "#a07040", fontStyle: "italic" }}>
          💡 {personal.funfact}
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {tech.map((t) => <Tag key={t} t={t} />)}
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <a href={personal.github} target="_blank" rel="noopener noreferrer"
            style={{ padding: "7px 16px", borderRadius: 8, fontSize: 11, fontWeight: 700, background: C.purple, color: "#fff", textDecoration: "none" }}>
            GitHub →
          </a>
          <a href={`mailto:${personal.email}`}
            style={{ padding: "7px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, border: `1px solid ${C.border}`, color: C.muted, textDecoration: "none", background: "transparent" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.purple; e.currentTarget.style.color = C.purple; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
          >
            Email
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: C.green }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, boxShadow: `0 0 6px ${C.green}88` }} />
            Open to work
          </div>
        </div>

        <div style={{ fontSize: 10, color: C.faint }}>📍 {personal.location}</div>
      </div>
    </div>
  );
}

// ─── 2. FRIEND SHOUTOUTS (col1-3, row1) ───────────────────────────────────────
function ShoutoutsCard() {
  return (
    <div style={card({ gridColumn: "1 / 4", gridRow: 1 })} {...hov()}>
      <div style={{ padding: "10px 14px" }}>
        <Lbl icon="🙌" text="Shoutouts — friends & their projects" color={C.orange} />
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {friends.map((f) => (
            <a key={f.name} href={f.url} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 8, background: "#f8f2e8", border: `1px solid ${C.border}`, transition: "all 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = f.color; e.currentTarget.style.background = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "#f8f2e8"; }}
            >
              <span style={{ fontSize: 14 }}>{f.emoji}</span>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: f.color }}>{f.name}</div>
                <div style={{ fontSize: 9, color: C.muted, maxWidth: 130, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.what}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 3. LINKS + NAV (col4-5, row1) ────────────────────────────────────────────
function LinksNavCard() {
  return (
    <div style={card({ gridColumn: "4 / 6", gridRow: 1 })} {...hov()}>
      <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {links.map((l) => (
            <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
              style={{ padding: "4px 10px", borderRadius: 6, background: "#f8f2e8", border: `1px solid ${C.border}`, fontSize: 10, color: C.muted, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.borderHover; e.currentTarget.style.color = C.text; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.muted; }}
            >
              <span>{l.icon}</span> {l.label}
            </a>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, marginLeft: 12 }}>
          {["Projects", "Blog", "Gallery"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`}
              style={{ fontSize: 10, color: C.faint, textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = C.purple)}
              onMouseLeave={(e) => (e.currentTarget.style.color = C.faint)}
            >
              {l}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 4. PROJECTS (col1, row2-4) ───────────────────────────────────────────────
function ProjectsCard() {
  return (
    <div style={card({ gridColumn: 1, gridRow: "2 / 5" })} {...hov()}>
      <div style={{ padding: "12px 14px", height: "100%", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <Lbl icon="⚡" text="Projects" color={C.purple} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.id}`} style={{ textDecoration: "none" }}>
              <div style={{ padding: 11, borderRadius: 10, background: "#f8f2e8", border: `1px solid ${C.border}`, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = p.color; e.currentTarget.style.background = "#fffcf7"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "#f8f2e8"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, alignItems: "baseline" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{p.emoji} {p.title}</span>
                  <span style={{ fontSize: 9, color: C.faint, fontFamily: "monospace" }}>{p.year}</span>
                </div>
                <p style={{ fontSize: 10, color: C.muted, lineHeight: 1.5, marginBottom: 7 }}>{p.desc}</p>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {p.tags.map((t) => <Tag key={t} t={t} />)}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ marginTop: 8, textAlign: "right" }}>
          <a href={personal.github} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 9, color: C.faint, textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.purple)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.faint)}
          >View all on GitHub →</a>
        </div>
      </div>
    </div>
  );
}

// ─── 5. HOBBIES (col4, row2) ──────────────────────────────────────────────────
function HobbiesCard() {
  return (
    <div style={card({ gridColumn: 4, gridRow: 2 })} {...hov()}>
      <div style={{ padding: "12px 14px", height: "100%", display: "flex", flexDirection: "column" }}>
        <Lbl icon="🎯" text="Free Time" color={C.orange} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, flex: 1 }}>
          {hobbies.map((h) => (
            <div key={h.label} style={{ padding: "6px 8px", borderRadius: 8, background: "#f8f2e8", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14 }}>{h.icon}</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: C.text }}>{h.label}</div>
                <div style={{ fontSize: 8, color: C.muted }}>{h.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 6. BLOG (col4, row3) ─────────────────────────────────────────────────────
function BlogCard() {
  return (
    <div style={card({ gridColumn: 4, gridRow: 3 })} {...hov()}>
      <div style={{ padding: "12px 14px", height: "100%", display: "flex", flexDirection: "column" }}>
        <Lbl icon="✏️" text="Blog" color={C.blue} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
          {blogPosts.map((p) => (
            <Link key={p.id} href={`/blog/${p.id}`} style={{ textDecoration: "none" }}>
              <div style={{ padding: "8px 10px", borderRadius: 8, background: "#f8f2e8", border: `1px solid ${C.border}`, cursor: "pointer", transition: "all 0.2s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.blue; e.currentTarget.style.background = "#fffcf7"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.background = "#f8f2e8"; }}
              >
                <div style={{ fontSize: 11, fontWeight: 600, color: C.text, marginBottom: 2, lineHeight: 1.3, fontStyle: "italic" }}>{p.title}</div>
                <div style={{ fontSize: 9, color: C.faint }}>{p.date} · {p.readTime} read</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 7. CERTIFICATES (col4, row4) ─────────────────────────────────────────────
function CertsCard() {
  return (
    <div style={card({ gridColumn: 4, gridRow: 4 })} {...hov()}>
      <div style={{ padding: "12px 14px", height: "100%", display: "flex", flexDirection: "column" }}>
        <Lbl icon="🎓" text="Certificates" color={C.green} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 5, overflowY: "auto" }}>
          {certificates.map((c) => (
            <div key={c.title} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 8px", borderRadius: 7, background: "#f8f2e8", border: `1px solid ${C.border}` }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</div>
                <div style={{ fontSize: 8, color: C.muted }}>{c.issuer} · {c.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 8. MESSAGE BOARD (col5, row2-4) ──────────────────────────────────────────
function MessageBoardCard() {
  interface Msg { id: number; user: string; text: string; time: string; }
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem("pm"); if (s) setMsgs(JSON.parse(s));
      const n = localStorage.getItem("pn"); if (n) setName(n);
    } catch { /* */ }
  }, []);

  const send = () => {
    const text = input.trim(); if (!text) return;
    const user = name.trim() || "Anonymous";
    const msg: Msg = { id: Date.now(), user, text, time: "just now" };
    const updated = [...msgs, msg].slice(-50);
    setMsgs(updated); setInput("");
    try { localStorage.setItem("pm", JSON.stringify(updated)); localStorage.setItem("pn", user); } catch { /* */ }
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const colors = [C.purple, C.pink, C.green, C.orange, C.blue];

  return (
    <div style={card({ gridColumn: 5, gridRow: "2 / 5" })} {...hov()}>
      <div style={{ padding: "12px 14px", height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <Lbl icon="💬" text="Messages" />
          <span style={{ fontSize: 8, color: C.faint, fontFamily: "monospace", marginBottom: 10 }}>{msgs.length}/50</span>
        </div>

        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          {msgs.length === 0 && (
            <div style={{ textAlign: "center", marginTop: 24, padding: "0 10px" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>👋</div>
              <p style={{ fontSize: 10, color: C.faint }}>No messages yet — be the first!</p>
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={m.id}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: colors[i % colors.length] }}>{m.user}</span>
                <span style={{ fontSize: 8, color: C.faint }}>{m.time}</span>
              </div>
              <p style={{ fontSize: 10, color: C.muted, lineHeight: 1.5 }}>{m.text}</p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div style={{ flexShrink: 0, marginTop: 10, borderTop: `1px solid ${C.border}`, paddingTop: 10, display: "flex", flexDirection: "column", gap: 5 }}>
          <input type="text" placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)}
            style={{ background: "#f8f2e8", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", fontSize: 9, color: C.text, outline: "none", width: "100%" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = C.purple)}
            onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
          />
          <div style={{ display: "flex", gap: 5 }}>
            <input type="text" placeholder="Say something nice…" value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              style={{ flex: 1, background: "#f8f2e8", border: `1px solid ${C.border}`, borderRadius: 6, padding: "4px 8px", fontSize: 9, color: C.text, outline: "none" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = C.purple)}
              onBlur={(e) => (e.currentTarget.style.borderColor = C.border)}
            />
            <button onClick={send}
              style={{ padding: "4px 10px", borderRadius: 6, background: input.trim() ? C.purple : "#f0e8dc", border: "none", color: input.trim() ? "#fff" : C.faint, fontSize: 13, cursor: "pointer", transition: "all 0.15s" }}>
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 9. MAP (col2-3, row4) ────────────────────────────────────────────────────
function MapCard() {
  return (
    <div style={card({ gridColumn: "2 / 4", gridRow: 4, padding: 0, overflow: "hidden" })} {...hov()}>
      <div style={{ position: "absolute", top: 8, left: 8, zIndex: 10, background: "rgba(255,253,248,0.92)", backdropFilter: "blur(6px)", border: `1px solid ${C.border}`, borderRadius: 6, padding: "3px 9px", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: C.muted, display: "flex", alignItems: "center", gap: 4 }}>
        🇨🇭 Switzerland · scroll to zoom
      </div>
      <MapClient />
    </div>
  );
}

// ─── 10. CURRENTLY (col1, row5) ───────────────────────────────────────────────
function CurrentlyCard() {
  return (
    <div style={card({ gridColumn: 1, gridRow: 5 })} {...hov()}>
      <div style={{ padding: "10px 14px" }}>
        <Lbl icon="⚙️" text="Currently building" color={C.green} />
        <p style={{ fontSize: 11, color: "#6a5040", fontStyle: "italic", lineHeight: 1.6 }}>
          &ldquo;{personal.currently}&rdquo;
        </p>
        <div style={{ marginTop: 7, display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.green, boxShadow: `0 0 5px ${C.green}88` }} />
          <span style={{ fontSize: 9, color: C.green }}>Active</span>
        </div>
      </div>
    </div>
  );
}

// ─── 11. GALLERY (col2-4, row5) ───────────────────────────────────────────────
function GalleryCard() {
  const [selected, setSelected] = useState<typeof galleryPhotos[0] | null>(null);
  const rots = [-2, 1, -1.5, 2, -0.8, 1.5];
  return (
    <>
      <div style={card({ gridColumn: "2 / 5", gridRow: 5 })} {...hov()}>
        <div style={{ padding: "10px 14px", height: "100%", display: "flex", flexDirection: "column" }}>
          <Lbl icon="📸" text="Gallery · Switzerland" color={C.blue} />
          <div style={{ flex: 1, display: "flex", gap: 8, alignItems: "center", overflowX: "auto", paddingBottom: 4 }}>
            {galleryPhotos.map((photo, i) => (
              <div key={photo.id} onClick={() => setSelected(photo)}
                style={{
                  flexShrink: 0, width: 76, cursor: "pointer",
                  transform: `rotate(${rots[i % rots.length]}deg)`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "rotate(0deg) scale(1.1)"; e.currentTarget.style.zIndex = "10"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = `rotate(${rots[i % rots.length]}deg)`; e.currentTarget.style.zIndex = "1"; }}
              >
                {/* Polaroid */}
                <div style={{ background: "#fff", padding: "3px 3px 14px 3px", borderRadius: 3, boxShadow: "0 3px 12px rgba(80,50,20,0.25)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.thumb} alt={photo.title} style={{ width: "100%", height: 56, objectFit: "cover", display: "block", borderRadius: 1 }} />
                  <div style={{ fontSize: 7, textAlign: "center", color: "#8a7060", marginTop: 4, paddingInline: 2, fontFamily: "var(--font-caveat), cursive" }}>
                    {photo.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {selected && <PhotoModal photo={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

// ─── 12. SOCIAL (col5, row5) ──────────────────────────────────────────────────
function SocialCard() {
  const socials = [
    { icon: "🐙", label: "GitHub", sub: "Ni7i", url: personal.github, color: C.purple },
    { icon: "💼", label: "LinkedIn", sub: "enis-shorra", url: personal.linkedin, color: C.blue },
    { icon: "✉️", label: "Email", sub: "shorra.enis@...", url: `mailto:${personal.email}`, color: C.orange },
    { icon: "💬", label: "Discord", sub: personal.discord, url: "#", color: C.pink },
  ];
  return (
    <div style={card({ gridColumn: 5, gridRow: 5 })} {...hov()}>
      <div style={{ padding: "10px 14px" }}>
        <Lbl icon="◎" text="Find me" />
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 7, textDecoration: "none", padding: "4px 6px", borderRadius: 7, transition: "background 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f8f2e8")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: 15 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.label}</div>
                <div style={{ fontSize: 8, color: C.faint }}>{s.sub}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleDone = () => {
    setLoaded(true);
    requestAnimationFrame(() => setTimeout(() => setVisible(true), 30));
  };

  return (
    <>
      {!loaded && <LoadingScreen onDone={handleDone} />}
      {loaded && <InternshipAd />}

      <div style={{
        height: "100vh", overflow: "hidden", padding: 8,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(6px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
          gridTemplateRows: "auto 1fr 1fr 1fr auto",
          gap: 7,
          height: "100%",
        }}>
          <ShoutoutsCard />
          <LinksNavCard />
          <ProjectsCard />
          <NameCard />
          <HobbiesCard />
          <MessageBoardCard />
          <BlogCard />
          <MapCard />
          <CertsCard />
          <CurrentlyCard />
          <GalleryCard />
          <SocialCard />
        </div>
      </div>
    </>
  );
}
