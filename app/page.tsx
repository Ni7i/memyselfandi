"use client";

import { useState, useEffect, useRef } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import { personal, tech, projects, galleryImages, links } from "@/lib/data";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  user: string;
  text: string;
  time: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Lbl({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
      textTransform: "uppercase", color: "#3a3a3a",
      display: "flex", alignItems: "center", gap: 5,
      marginBottom: 12, flexShrink: 0,
    }}>
      <span>{icon}</span><span>{text}</span>
    </div>
  );
}

function Tag({ t }: { t: string }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 20,
      fontSize: 10, background: "#1a1a1a", color: "#666",
      border: "1px solid #242424",
    }}>{t}</span>
  );
}

const card: React.CSSProperties = {
  background: "#141414",
  border: "1px solid #1e1e1e",
  borderRadius: 14,
  overflow: "hidden",
  transition: "border-color 0.2s",
};

const inner: React.CSSProperties = {
  padding: 16,
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

// ─── NAME (center) ────────────────────────────────────────────────────────────
function NameCard() {
  return (
    <div style={{
      ...card,
      gridColumn: "2 / 4",
      gridRow: "2 / 4",
      backgroundImage: "radial-gradient(ellipse at 60% 40%, rgba(167,139,250,0.08) 0%, transparent 65%)",
    }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2d2d2d")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
    >
      <div style={{ ...inner, justifyContent: "center", gap: 16 }}>
        {/* Big name */}
        <div>
          <div style={{ fontSize: "clamp(36px, 4vw, 60px)", fontWeight: 900, lineHeight: 1, color: "#fff", letterSpacing: "-0.02em" }}>
            {personal.name}
          </div>
          <div style={{
            fontSize: "clamp(36px, 4vw, 60px)", fontWeight: 900, lineHeight: 1,
            letterSpacing: "-0.02em",
            background: "linear-gradient(120deg, #a78bfa, #f472b6)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}>
            {personal.surname}
          </div>
        </div>

        <div style={{ fontSize: 13, color: "#555", letterSpacing: "0.05em" }}>
          {personal.role}
        </div>

        <p style={{ fontSize: 12, color: "#666", lineHeight: 1.7, maxWidth: 340 }}>
          {personal.bio}
        </p>

        {/* Tech pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
          {tech.map((t) => <Tag key={t} t={t} />)}
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <a href={personal.github} target="_blank" rel="noopener noreferrer"
            style={{
              padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: "#a78bfa", color: "#fff", textDecoration: "none",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#8b5cf6")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#a78bfa")}
          >
            GitHub
          </a>
          <a href={`mailto:${personal.email}`}
            style={{
              padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 600,
              background: "transparent", color: "#888", textDecoration: "none",
              border: "1px solid #252525", transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a78bfa66"; e.currentTarget.style.color = "#ccc"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#252525"; e.currentTarget.style.color = "#888"; }}
          >
            Contact
          </a>
        </div>

        {/* Location */}
        <div style={{ fontSize: 11, color: "#333", display: "flex", alignItems: "center", gap: 5 }}>
          <span>📍</span><span>{personal.location}</span>
        </div>
      </div>
    </div>
  );
}

// ─── SHOUTOUTS (top center) ───────────────────────────────────────────────────
function ShoutoutsCard() {
  return (
    <div style={{ ...card, gridColumn: "2 / 4", gridRow: 1 }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2d2d2d")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
    >
      <div style={{ ...inner, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap", paddingBlock: 14 }}>
        {links.map((l) => (
          <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
            style={{
              padding: "5px 14px", borderRadius: 8,
              background: "#1a1a1a", border: "1px solid #222",
              fontSize: 11, color: "#777", textDecoration: "none",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#a78bfa55"; e.currentTarget.style.color = "#c4b5fd"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#222"; e.currentTarget.style.color = "#777"; }}
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── PROJECTS (left) ─────────────────────────────────────────────────────────
function ProjectsCard() {
  return (
    <div style={{ ...card, gridColumn: 1, gridRow: "1 / 4" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2d2d2d")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
    >
      <div style={{ ...inner, overflowY: "auto" }}>
        <Lbl icon="⚡" text="Projects" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          {projects.map((p, i) => (
            <div key={i}
              style={{
                padding: 12, borderRadius: 10,
                background: "#0d0d0d", border: "1px solid #1e1e1e",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#a78bfa44")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#e0e0e0" }}>{p.title}</span>
                <span style={{ fontSize: 9, color: "#2a2a2a", fontFamily: "monospace" }}>{p.period}</span>
              </div>
              <p style={{ fontSize: 11, color: "#555", lineHeight: 1.5, marginBottom: 8 }}>{p.desc}</p>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
                {p.tags.map((t) => <Tag key={t} t={t} />)}
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {p.github && (
                  <a href={p.github} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 10, color: "#333", textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
                  >GitHub →</a>
                )}
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 10, color: "#333", textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#60a5fa")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
                  >Live →</a>
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 8, textAlign: "right" }}>
          <a href={personal.github} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 10, color: "#2a2a2a", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#2a2a2a")}
          >View more →</a>
        </div>
      </div>
    </div>
  );
}

// ─── MESSAGE BOARD (right) ────────────────────────────────────────────────────
function MessageBoardCard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("portfolio-messages");
      if (saved) setMessages(JSON.parse(saved));
      const savedName = localStorage.getItem("portfolio-username");
      if (savedName) setName(savedName);
    } catch { /* ignore */ }
  }, []);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const user = name.trim() || "Anonymous";
    const msg: Message = {
      id: Date.now(),
      user,
      text,
      time: "just now",
    };
    const updated = [...messages, msg].slice(-50);
    setMessages(updated);
    setInput("");
    try {
      localStorage.setItem("portfolio-messages", JSON.stringify(updated));
      localStorage.setItem("portfolio-username", user);
    } catch { /* ignore */ }
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <div style={{ ...card, gridColumn: 4, gridRow: "1 / 4" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2d2d2d")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
    >
      <div style={{ ...inner }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexShrink: 0 }}>
          <Lbl icon="💬" text="Messages" />
          <span style={{ fontSize: 9, color: "#2a2a2a", fontFamily: "monospace", marginBottom: 12 }}>
            {messages.length}/50
          </span>
        </div>

        {/* Messages list */}
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.length === 0 && (
            <p style={{ fontSize: 11, color: "#2a2a2a", textAlign: "center", marginTop: 20 }}>
              Noch keine Nachrichten.
              <br />Sei der Erste!
            </p>
          )}
          {messages.map((m, i) => (
            <div key={m.id}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: i % 2 === 0 ? "#a78bfa" : "#ccc" }}>{m.user}</span>
                <span style={{ fontSize: 9, color: "#2a2a2a" }}>{m.time}</span>
              </div>
              <p style={{ fontSize: 11, color: "#666" }}>{m.text}</p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ flexShrink: 0, marginTop: 12, borderTop: "1px solid #1e1e1e", paddingTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          <input
            type="text"
            placeholder="Dein Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              background: "#0d0d0d", border: "1px solid #1e1e1e",
              borderRadius: 6, padding: "5px 8px",
              fontSize: 10, color: "#888", outline: "none", width: "100%",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#a78bfa44")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
          />
          <div style={{ display: "flex", gap: 6 }}>
            <input
              type="text"
              placeholder="Nachricht..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              style={{
                flex: 1, background: "#0d0d0d", border: "1px solid #1e1e1e",
                borderRadius: 6, padding: "5px 8px",
                fontSize: 10, color: "#ccc", outline: "none",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#a78bfa44")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
            />
            <button
              onClick={send}
              style={{
                padding: "5px 10px", borderRadius: 6,
                background: input.trim() ? "#a78bfa" : "#1a1a1a",
                border: "none", color: input.trim() ? "#fff" : "#333",
                fontSize: 11, cursor: "pointer", transition: "all 0.15s",
                flexShrink: 0,
              }}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAP (bottom left) ────────────────────────────────────────────────────────
function MapCard() {
  return (
    <div style={{ ...card, gridColumn: 1, gridRow: 4, padding: 0, overflow: "hidden" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2d2d2d")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
    >
      <div style={{
        position: "absolute", top: 10, left: 10, zIndex: 10,
        background: "rgba(14,14,14,0.9)", backdropFilter: "blur(6px)",
        border: "1px solid #252525", borderRadius: 6,
        padding: "3px 9px", fontSize: 10, fontWeight: 700,
        letterSpacing: "0.1em", color: "#555",
        display: "flex", alignItems: "center", gap: 5,
      }}>
        🗺 MAP
      </div>
      <iframe
        src="https://www.openstreetmap.org/export/embed.html?bbox=6.0,47.5,15.0,55.0&layer=mapnik"
        style={{
          width: "100%", height: "100%", minHeight: 160, border: "none",
          filter: "invert(0.88) hue-rotate(180deg) brightness(0.75) saturate(0.6)",
        }}
        title="Map"
      />
    </div>
  );
}

// ─── GALLERY (bottom center) ──────────────────────────────────────────────────
function GalleryCard() {
  const hasImages = galleryImages.length > 0;
  const gradients = [
    "linear-gradient(135deg,#1a1a2e,#16213e)",
    "linear-gradient(135deg,#1e1b2e,#2d1f3d)",
    "linear-gradient(135deg,#0f2027,#203a43)",
    "linear-gradient(135deg,#1a1a1a,#2d2d2d)",
  ];

  return (
    <div style={{ ...card, gridColumn: "2 / 4", gridRow: 4 }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2d2d2d")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
    >
      <div style={{ ...inner }}>
        <Lbl icon="🖼" text="Gallery" />
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
          {hasImages
            ? galleryImages.slice(0, 8).map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt={`Photo ${i + 1}`}
                  style={{
                    width: "100%", height: "100%", objectFit: "cover",
                    borderRadius: 8, minHeight: 60, maxHeight: 80,
                  }}
                />
              ))
            : gradients.map((g, i) => (
                <div key={i} style={{
                  borderRadius: 8, background: g,
                  minHeight: 60, maxHeight: 80,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, opacity: 0.6, color: "#666",
                }}>
                  +
                </div>
              ))
          }
        </div>
        {!hasImages && (
          <p style={{ fontSize: 9, color: "#2a2a2a", marginTop: 8, fontFamily: "monospace" }}>
            Bilder in public/gallery/ ablegen & in lib/data.ts eintragen
          </p>
        )}
      </div>
    </div>
  );
}

// ─── SOCIAL (bottom right) ────────────────────────────────────────────────────
function SocialCard() {
  const socials = [
    { icon: "🐙", label: "GitHub", sub: "Ni7i", url: personal.github },
    { icon: "💼", label: "LinkedIn", sub: "enis-shorra", url: personal.linkedin },
    { icon: "✉️", label: "Email", sub: "shorra.enis@...", url: `mailto:${personal.email}` },
    { icon: "💬", label: "Discord", sub: personal.discord, url: "#" },
  ];
  return (
    <div style={{ ...card, gridColumn: 4, gridRow: 4 }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#2d2d2d")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
    >
      <div style={{ ...inner }}>
        <Lbl icon="◎" text="Socials" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          {socials.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 8,
                textDecoration: "none", padding: "6px 8px",
                borderRadius: 8, transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1a1a1a")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#aaa" }}>{s.label}</div>
                <div style={{ fontSize: 10, color: "#444" }}>{s.sub}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
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

      <div style={{
        height: "100vh", overflow: "hidden", padding: 10,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(8px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gridTemplateRows: "auto 1fr 1fr auto",
          gap: 8,
          height: "100%",
        }}>
          <ProjectsCard />
          <ShoutoutsCard />
          <NameCard />
          <MessageBoardCard />
          <MapCard />
          <GalleryCard />
          <SocialCard />
        </div>
      </div>
    </>
  );
}
