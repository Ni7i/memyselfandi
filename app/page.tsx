"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import LoadingScreen from "@/components/LoadingScreen";
import InternshipAd from "@/components/InternshipAd";
import { personal, tech, projects, blogPosts, galleryPhotos, links } from "@/lib/data";

const MapClient = dynamic(() => import("@/components/MapClient"), {
  ssr: false,
  loading: () => (
    <div style={{ width: "100%", height: "100%", background: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontSize: 11, color: "#333" }}>loading map...</span>
    </div>
  ),
});

// ─── Shared ────────────────────────────────────────────────────────────────────
const S = {
  card: {
    background: "#121212",
    border: "1px solid #1c1c1c",
    borderRadius: 12,
    overflow: "hidden" as const,
    transition: "border-color 0.2s",
  },
  pad: { padding: "12px 14px" } as React.CSSProperties,
  lbl: {
    fontSize: 9, fontWeight: 700 as const, letterSpacing: "0.12em",
    textTransform: "uppercase" as const, color: "#383838",
    display: "flex", alignItems: "center", gap: 4, marginBottom: 10,
  } as React.CSSProperties,
};

function Lbl({ icon, text }: { icon: string; text: string }) {
  return <div style={S.lbl}><span>{icon}</span><span>{text}</span></div>;
}

function Tag({ t, small }: { t: string; small?: boolean }) {
  return (
    <span style={{
      display: "inline-block",
      padding: small ? "1px 6px" : "2px 8px",
      borderRadius: 20,
      fontSize: small ? 9 : 10,
      background: "#181818",
      color: "#666",
      border: "1px solid #202020",
    }}>{t}</span>
  );
}

function hover(accent = "#2a2a2a") {
  return {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.borderColor = accent; },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => { e.currentTarget.style.borderColor = "#1c1c1c"; },
  };
}

// ─── Gallery photo modal ───────────────────────────────────────────────────────
function PhotoModal({ photo, onClose }: { photo: typeof galleryPhotos[0]; onClose: () => void }) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(0,0,0,0.92)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 800, width: "100%" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.src} alt={photo.title} style={{
          width: "100%", maxHeight: "70vh", objectFit: "cover",
          borderRadius: 10, display: "block",
        }} />
        <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#e0e0e0" }}>{photo.title}</div>
            <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>📍 {photo.location} · {photo.date}</div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#444", fontSize: 20, cursor: "pointer" }}>✕</button>
        </div>
      </div>
    </div>
  );
}

// ─── CARDS ─────────────────────────────────────────────────────────────────────

// 1. NAME (center, col2-3, row2-3)
function NameCard() {
  return (
    <div style={{ ...S.card, gridColumn: "2 / 4", gridRow: "2 / 4", backgroundImage: "radial-gradient(ellipse at 65% 35%, rgba(167,139,250,0.07) 0%, transparent 60%)" }}
      {...hover("#2d2d2d")}
    >
      <div style={{ ...S.pad, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>

        <div>
          <div style={{ fontSize: "clamp(30px, 3.5vw, 52px)", fontWeight: 900, letterSpacing: "-0.02em", color: "#fff", lineHeight: 1 }}>
            {personal.name}
          </div>
          <div style={{
            fontSize: "clamp(30px, 3.5vw, 52px)", fontWeight: 900, letterSpacing: "-0.02em", lineHeight: 1,
            background: "linear-gradient(120deg, #a78bfa, #f472b6)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            {personal.surname}
          </div>
        </div>

        <div style={{ fontSize: 11, color: "#444", letterSpacing: "0.05em" }}>{personal.role}</div>

        <p style={{ fontSize: 12, color: "#555", lineHeight: 1.7, maxWidth: 340 }}>{personal.bio}</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {tech.map((t) => <Tag key={t} t={t} small />)}
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <a href={personal.github} target="_blank" rel="noopener noreferrer"
            style={{ padding: "7px 16px", borderRadius: 7, fontSize: 11, fontWeight: 600, background: "#a78bfa", color: "#fff", textDecoration: "none" }}>
            GitHub
          </a>
          <a href={`mailto:${personal.email}`}
            style={{ padding: "7px 16px", borderRadius: 7, fontSize: 11, fontWeight: 600, background: "transparent", color: "#666", textDecoration: "none", border: "1px solid #1e1e1e" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a78bfa44"; e.currentTarget.style.color = "#ccc"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e1e1e"; e.currentTarget.style.color = "#666"; }}
          >
            Contact
          </a>
          <div style={{ marginLeft: 4, display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: personal.status === "available" ? "#4ade80" : "#f87171" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: personal.status === "available" ? "#4ade80" : "#f87171", boxShadow: personal.status === "available" ? "0 0 6px #4ade8088" : "none" }} />
            {personal.status === "available" ? "Available" : "Busy"}
          </div>
        </div>

        <div style={{ fontSize: 10, color: "#333", display: "flex", alignItems: "center", gap: 4 }}>
          <span>📍</span><span>{personal.location}</span>
        </div>
      </div>
    </div>
  );
}

// 2. SHOUTOUTS (col1-4, row1)
function ShoutoutsCard() {
  return (
    <div style={{ ...S.card, gridColumn: "1 / 5", gridRow: 1 }} {...hover()}>
      <div style={{ ...S.pad, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", paddingBlock: 10 }}>
        <Lbl icon="🔗" text="Links" />
        {links.map((l) => (
          <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
            style={{ padding: "4px 12px", borderRadius: 6, background: "#181818", border: "1px solid #1e1e1e", fontSize: 10, color: "#666", textDecoration: "none" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a78bfa44"; e.currentTarget.style.color = "#c4b5fd"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1e1e1e"; e.currentTarget.style.color = "#666"; }}
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

// 3. NAVIGATION (col5, row1)
function NavCard() {
  return (
    <div style={{ ...S.card, gridColumn: 5, gridRow: 1 }} {...hover()}>
      <div style={{ ...S.pad, paddingBlock: 10, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        {["Projects", "Blog", "Gallery", "Contact"].map((l) => (
          <a key={l} href={`#${l.toLowerCase()}`}
            style={{ fontSize: 11, color: "#555", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
          >
            {l}
          </a>
        ))}
      </div>
    </div>
  );
}

// 4. PROJECTS (col1, row2-4)
function ProjectsCard() {
  return (
    <div style={{ ...S.card, gridColumn: 1, gridRow: "2 / 5" }} {...hover()}>
      <div style={{ ...S.pad, height: "100%", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <Lbl icon="⚡" text="Projects" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {projects.map((p) => (
            <Link key={p.id} href={`/projects/${p.id}`} style={{ textDecoration: "none" }}>
              <div style={{
                padding: 12, borderRadius: 9, background: "#0d0d0d",
                border: "1px solid #181818", cursor: "pointer", transition: "border-color 0.2s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#a78bfa44")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#181818")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#e0e0e0" }}>{p.title}</span>
                  <span style={{ fontSize: 9, color: "#2a2a2a", fontFamily: "monospace" }}>{p.year}</span>
                </div>
                <p style={{ fontSize: 10, color: "#555", lineHeight: 1.5, marginBottom: 7 }}>{p.desc}</p>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {p.tags.map((t) => <Tag key={t} t={t} small />)}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Link href={personal.github} target="_blank" style={{ fontSize: 9, color: "#2a2a2a", textDecoration: "none", marginTop: 8, textAlign: "right", display: "block" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#2a2a2a")}
        >
          View all →
        </Link>
      </div>
    </div>
  );
}

// 5. BLOG (col4, row2)
function BlogCard() {
  return (
    <div style={{ ...S.card, gridColumn: 4, gridRow: 2 }} {...hover()}>
      <div style={{ ...S.pad, height: "100%", display: "flex", flexDirection: "column" }}>
        <Lbl icon="✏" text="Blog" />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {blogPosts.map((p) => (
            <Link key={p.id} href={`/blog/${p.id}`} style={{ textDecoration: "none" }}>
              <div style={{
                padding: "9px 10px", borderRadius: 8, background: "#0d0d0d",
                border: "1px solid #181818", cursor: "pointer", transition: "border-color 0.2s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#a78bfa44")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#181818")}
              >
                <div style={{ fontSize: 11, fontWeight: 600, color: "#ccc", marginBottom: 3, fontStyle: "italic", lineHeight: 1.3 }}>{p.title}</div>
                <div style={{ fontSize: 9, color: "#3a3a3a" }}>{p.date} · {p.readTime}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// 6. MESSAGE BOARD (col5, row2-4)
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

  return (
    <div style={{ ...S.card, gridColumn: 5, gridRow: "2 / 5" }} {...hover()}>
      <div style={{ ...S.pad, height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexShrink: 0 }}>
          <Lbl icon="💬" text="Messages" />
          <span style={{ fontSize: 8, color: "#222", fontFamily: "monospace", marginBottom: 10 }}>{msgs.length}/50</span>
        </div>

        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          {msgs.length === 0 && (
            <p style={{ fontSize: 10, color: "#2a2a2a", textAlign: "center", marginTop: 16 }}>No messages yet.<br />Be the first!</p>
          )}
          {msgs.map((m, i) => (
            <div key={m.id}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 1 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: i % 2 === 0 ? "#a78bfa" : "#ccc" }}>{m.user}</span>
                <span style={{ fontSize: 8, color: "#252525" }}>{m.time}</span>
              </div>
              <p style={{ fontSize: 10, color: "#555", lineHeight: 1.4 }}>{m.text}</p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div style={{ flexShrink: 0, marginTop: 10, borderTop: "1px solid #181818", paddingTop: 10, display: "flex", flexDirection: "column", gap: 5 }}>
          <input type="text" placeholder="Your name..." value={name} onChange={(e) => setName(e.target.value)}
            style={{ background: "#0a0a0a", border: "1px solid #181818", borderRadius: 5, padding: "4px 7px", fontSize: 9, color: "#888", outline: "none", width: "100%" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#a78bfa33")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#181818")}
          />
          <div style={{ display: "flex", gap: 5 }}>
            <input type="text" placeholder="Leave a message..." value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              style={{ flex: 1, background: "#0a0a0a", border: "1px solid #181818", borderRadius: 5, padding: "4px 7px", fontSize: 9, color: "#ccc", outline: "none" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#a78bfa33")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#181818")}
            />
            <button onClick={send}
              style={{ padding: "4px 9px", borderRadius: 5, background: input.trim() ? "#a78bfa" : "#181818", border: "none", color: input.trim() ? "#fff" : "#333", fontSize: 12, cursor: "pointer", transition: "all 0.15s" }}>
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. MAP (col2-3, row4)
function MapCard() {
  return (
    <div style={{ ...S.card, gridColumn: "2 / 4", gridRow: 4, padding: 0, overflow: "hidden" }} {...hover()}>
      <div style={{
        position: "absolute", top: 8, left: 8, zIndex: 10,
        background: "rgba(12,12,12,0.9)", backdropFilter: "blur(6px)",
        border: "1px solid #1e1e1e", borderRadius: 5, padding: "3px 8px",
        fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: "#444",
        display: "flex", alignItems: "center", gap: 4,
      }}>
        🗺 MAP · click photos to see location
      </div>
      <MapClient />
    </div>
  );
}

// 8. GITHUB (col4, row3)
function GitHubCard() {
  return (
    <div style={{ ...S.card, gridColumn: 4, gridRow: 3 }} {...hover()}>
      <div style={{ ...S.pad, height: "100%", display: "flex", flexDirection: "column" }}>
        <Lbl icon="🐙" text="GitHub" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://ghchart.rshah.org/a78bfa/Ni7i" alt="GitHub contributions"
          style={{ width: "100%", borderRadius: 5, filter: "brightness(0.8)", flex: 1, objectFit: "contain" }} />
        <div style={{ marginTop: 6, display: "flex", gap: 5 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://img.shields.io/github/followers/Ni7i?style=flat-square&color=a78bfa&labelColor=121212&label=Followers" alt="followers" style={{ height: 16 }} />
        </div>
      </div>
    </div>
  );
}

// 9. CURRENTLY (col4, row4)
function CurrentlyCard() {
  return (
    <div style={{ ...S.card, gridColumn: 4, gridRow: 4 }} {...hover()}>
      <div style={{ ...S.pad, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Lbl icon="⚙" text="Currently" />
        <p style={{ fontSize: 11, color: "#666", fontStyle: "italic", lineHeight: 1.5 }}>
          &quot;{personal.currently}&quot;
        </p>
        <div style={{ marginTop: 8, display: "flex", gap: 5, alignItems: "center" }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 5px #4ade8088" }} />
          <span style={{ fontSize: 9, color: "#4ade80" }}>Active</span>
        </div>
      </div>
    </div>
  );
}

// 10. STUFF I USE (col1, row5)
function StuffCard() {
  const hardware = ["Custom PC", "Mechanical KB", "Ultrawide Monitor"];
  return (
    <div style={{ ...S.card, gridColumn: 1, gridRow: 5 }} {...hover()}>
      <div style={{ ...S.pad, paddingBlock: 10 }}>
        <Lbl icon="🛠" text="Stuff I Use" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
          {tech.slice(0, 5).map((t) => <Tag key={t} t={t} small />)}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          {hardware.map((h) => (
            <div key={h} style={{ fontSize: 9, color: "#444", display: "flex", gap: 5 }}>
              <span style={{ color: "#222" }}>·</span>{h}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 11. GALLERY (col2-4, row5)
function GalleryCard() {
  const [selected, setSelected] = useState<typeof galleryPhotos[0] | null>(null);
  const rotations = [-1.5, 0.8, -0.5, 1.2, -1, 0.6];

  return (
    <>
      <div style={{ ...S.card, gridColumn: "2 / 5", gridRow: 5 }} {...hover()}>
        <div style={{ ...S.pad, paddingBlock: 10, height: "100%", display: "flex", flexDirection: "column" }}>
          <Lbl icon="🖼" text="Gallery · nature" />
          <div style={{ flex: 1, display: "flex", gap: 6, alignItems: "center", overflowX: "auto" }}>
            {galleryPhotos.map((photo, i) => (
              <div
                key={photo.id}
                onClick={() => setSelected(photo)}
                style={{
                  flexShrink: 0,
                  width: 80, height: 60,
                  borderRadius: 6,
                  overflow: "hidden",
                  border: "1px solid #222",
                  cursor: "pointer",
                  transform: `rotate(${rotations[i % rotations.length]}deg)`,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "rotate(0deg) scale(1.08)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.8)"; e.currentTarget.style.zIndex = "10"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = `rotate(${rotations[i % rotations.length]}deg)`; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.5)"; e.currentTarget.style.zIndex = "1"; }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.thumb} alt={photo.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {selected && <PhotoModal photo={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

// 12. SOCIAL (col5, row5)
function SocialCard() {
  const socials = [
    { icon: "🐙", label: "GitHub", sub: "Ni7i", url: personal.github },
    { icon: "💼", label: "LinkedIn", sub: "enis-shorra", url: personal.linkedin },
    { icon: "✉️", label: "Email", sub: "shorra.enis@...", url: `mailto:${personal.email}` },
    { icon: "💬", label: "Discord", sub: personal.discord, url: "#" },
  ];
  return (
    <div style={{ ...S.card, gridColumn: 5, gridRow: 5 }} {...hover()}>
      <div style={{ ...S.pad, paddingBlock: 10 }}>
        <Lbl icon="◎" text="Socials" />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 7, textDecoration: "none", padding: "4px 6px", borderRadius: 6, transition: "background 0.15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#181818")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: 15 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#aaa" }}>{s.label}</div>
                <div style={{ fontSize: 9, color: "#3a3a3a" }}>{s.sub}</div>
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
          <NavCard />
          <ProjectsCard />
          <NameCard />
          <BlogCard />
          <MessageBoardCard />
          <GitHubCard />
          <MapCard />
          <CurrentlyCard />
          <StuffCard />
          <GalleryCard />
          <SocialCard />
        </div>
      </div>
    </>
  );
}
