"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

// ─── Data ─────────────────────────────────────────────────────────────────────
const ME = {
  name: "Enis",
  role: "C# · .NET · UI Dev",
  age: 17,
  location: "Deutschland",
  email: "shorra.enis@hotmail.com",
  github: "https://github.com/Ni7i",
  linkedin: "https://linkedin.com/in/enis-shorra",
  discord: "enis.shorra",
  facts: [
    "I build game logic systems for fun",
    "Strong OOP & design patterns",
    "Eye for minimal UI",
    "Open for internships",
    "Powered by energy drinks",
  ],
};

const TECH = ["C#", ".NET", "TypeScript", "React", "Next.js", "Git", "Figma", "SQL"];

const PROJECTS = [
  {
    title: "WhitePlayer",
    period: "2024 – now",
    desc: "Minimal music player with clean WPF UI and smooth animations.",
    tags: ["C#", ".NET", "WPF"],
    github: "https://github.com/Ni7i",
    live: "",
  },
  {
    title: "Portfolio",
    period: "2025",
    desc: "This portfolio — built from scratch with Next.js & Tailwind.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    github: "https://github.com/Ni7i/memyselfandi",
    live: "https://memyselfandi-two.vercel.app",
  },
  {
    title: "Game Logic Engine",
    period: "2024",
    desc: "Reusable game logic with state machines, event bus & ECS.",
    tags: ["C#", "OOP", "Patterns"],
    github: "https://github.com/Ni7i",
    live: "",
  },
];

const MESSAGES = [
  { user: "Anonymous", time: "2d ago", text: "sick portfolio 🔥" },
  { user: "Lisa", time: "5d ago", text: "love the design!" },
  { user: "Anonymous", time: "1w ago", text: "let's collab ^^" },
  { user: "Max", time: "2w ago", text: "clean UI bro" },
  { user: "Anonymous", time: "3w ago", text: "giving out internships?" },
];

const SOCIALS = [
  { icon: "🐙", label: "GITHUB", sub: "Ni7i", url: ME.github },
  { icon: "💼", label: "LINKEDIN", sub: "enis-shorra", url: ME.linkedin },
  { icon: "✉️", label: "EMAIL", sub: "shorra.enis@...", url: `mailto:${ME.email}` },
  { icon: "💬", label: "DISCORD", sub: "enis.shorra", url: "#" },
];

const LINKS = [
  { label: "GitHub", url: ME.github },
  { label: "LinkedIn", url: ME.linkedin },
  { label: "Discord", url: "#" },
  { label: "Email", url: `mailto:${ME.email}` },
  { label: "Portfolio Repo", url: "https://github.com/Ni7i/memyselfandi" },
  { label: "Vercel", url: "https://memyselfandi-two.vercel.app" },
];

// ─── Shared components ────────────────────────────────────────────────────────
function Lbl({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="lbl">
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function Tag({ t }: { t: string }) {
  return <span className="tag">{t}</span>;
}

// Hover border glow helper
const hoverBorder = {
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.borderColor = "rgba(167,139,250,0.4)";
    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(167,139,250,0.06)";
  },
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
    (e.currentTarget as HTMLElement).style.borderColor = "#1f1f1f";
    (e.currentTarget as HTMLElement).style.boxShadow = "none";
  },
};

// ─── Cards ────────────────────────────────────────────────────────────────────

function AboutCard() {
  return (
    <div
      className="card"
      style={{ gridColumn: 1, gridRow: "1 / 5" }}
      {...hoverBorder}
    >
      <div
        className="card-inner"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 80% 100%, rgba(167,139,250,0.07) 0%, transparent 60%)",
        }}
      >
        <Lbl icon="○" text="About Me" />

        <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1.2, marginBottom: 10 }}>
          Hello I&apos;m{" "}
          <span
            style={{
              background: "linear-gradient(120deg, #a78bfa, #f472b6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontStyle: "italic",
            }}
          >
            {ME.name}
          </span>
        </div>

        <p style={{ fontSize: 12, color: "#888", lineHeight: 1.6, marginBottom: 12 }}>
          I&apos;m a {ME.age}-year-old CS student, building cool things with{" "}
          <span style={{ color: "#ccc", fontStyle: "italic" }}>C# & .NET</span>.
        </p>

        <div style={{ fontSize: 11, color: "#555", display: "flex", alignItems: "center", gap: 5, marginBottom: 16 }}>
          <span>📍</span><span>{ME.location}</span>
        </div>

        <div>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "#3a3a3a", marginBottom: 8 }}>
            ★ FACTS
          </div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
            {ME.facts.map((f, i) => (
              <li key={i} style={{ fontSize: 11, color: "#666", display: "flex", gap: 7 }}>
                <span style={{ color: "#333" }}>·</span>{f}
              </li>
            ))}
          </ul>
        </div>

        {/* Tech pills */}
        <div style={{ marginTop: 16, display: "flex", flexWrap: "wrap", gap: 5 }}>
          {TECH.map((t) => <Tag key={t} t={t} />)}
        </div>

        {/* Mountain */}
        <div style={{ marginTop: "auto", paddingTop: 12, opacity: 0.15 }}>
          <svg viewBox="0 0 240 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <polygon points="0,50 55,8 90,28 140,0 190,22 240,4 240,50" fill="#a78bfa" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ShoutoutsCard() {
  return (
    <div className="card" style={{ gridColumn: "2 / 4", gridRow: 1 }} {...hoverBorder}>
      <div className="card-inner" style={{ justifyContent: "center" }}>
        <Lbl icon="🔗" text="Shoutouts & Links" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: "5px 12px",
                borderRadius: 8,
                background: "#1a1a1a",
                border: "1px solid #252525",
                fontSize: 11,
                color: "#888",
                textDecoration: "none",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#a78bfa66";
                e.currentTarget.style.color = "#c4b5fd";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#252525";
                e.currentTarget.style.color = "#888";
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function NowPlayingCard() {
  return (
    <div className="card" style={{ gridColumn: 4, gridRow: 1 }} {...hoverBorder}>
      <div className="card-inner">
        <Lbl icon="🎵" text="Now Playing" />
        <div style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 10, flexShrink: 0,
            background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
          }}>
            🎧
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#d4d4d4", marginBottom: 2 }}>Lofi Chill</div>
            <div style={{ fontSize: 10, color: "#555" }}>Artist · 4:20</div>
            <div style={{ marginTop: 6, height: 2, background: "#1e1e1e", borderRadius: 2 }}>
              <div style={{ width: "45%", height: "100%", background: "linear-gradient(90deg, #a78bfa, #60a5fa)", borderRadius: 2 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectsCard() {
  return (
    <div className="card" style={{ gridColumn: 2, gridRow: "2 / 6" }} {...hoverBorder}>
      <div className="card-inner" style={{ overflowY: "auto" }}>
        <Lbl icon="⚡" text="Projects" />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          {PROJECTS.map((p, i) => (
            <div
              key={i}
              style={{
                padding: 14,
                borderRadius: 10,
                background: "#0d0d0d",
                border: "1px solid #1e1e1e",
                transition: "border-color 0.2s",
                cursor: "default",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#a78bfa44")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#e0e0e0" }}>{p.title}</span>
                <span style={{ fontSize: 10, color: "#3a3a3a", fontFamily: "monospace" }}>{p.period}</span>
              </div>
              <p style={{ fontSize: 11, color: "#666", lineHeight: 1.5, marginBottom: 8 }}>{p.desc}</p>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 8 }}>
                {p.tags.map((t) => <Tag key={t} t={t} />)}
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                {p.github && (
                  <a href={p.github} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 10, color: "#3a3a3a", textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#3a3a3a")}
                  >GitHub →</a>
                )}
                {p.live && (
                  <a href={p.live} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 10, color: "#3a3a3a", textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#60a5fa")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#3a3a3a")}
                  >Live →</a>
                )}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, textAlign: "right" }}>
          <a href={ME.github} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: 10, color: "#333", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
          >View more →</a>
        </div>
      </div>
    </div>
  );
}

function MapCard() {
  return (
    <div className="card" style={{ gridColumn: 3, gridRow: "2 / 4", padding: 0, overflow: "hidden" }} {...hoverBorder}>
      <div style={{
        position: "absolute", top: 10, left: 10, zIndex: 10,
        background: "rgba(14,14,14,0.88)",
        backdropFilter: "blur(8px)",
        border: "1px solid #252525",
        borderRadius: 6, padding: "3px 9px",
        fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#666",
        display: "flex", alignItems: "center", gap: 5,
      }}>
        🗺 MAP
      </div>
      <iframe
        src="https://www.openstreetmap.org/export/embed.html?bbox=6.0,47.5,15.0,55.0&layer=mapnik"
        style={{ width: "100%", height: "100%", minHeight: 180, border: "none",
          filter: "invert(0.88) hue-rotate(180deg) brightness(0.8) saturate(0.7)" }}
        title="Map"
      />
    </div>
  );
}

function NavigationCard() {
  return (
    <div className="card" style={{ gridColumn: 4, gridRow: 2 }} {...hoverBorder}>
      <div className="card-inner">
        <Lbl icon="◎" text="Navigation" />
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7 }}>
          {["Projects", "Blog", "Gallery", "Contact"].map((l) => (
            <li key={l}>
              <a href={`#${l.toLowerCase()}`}
                style={{ fontSize: 13, color: "#666", textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#666")}
              >
                <span style={{ color: "#2a2a2a", fontSize: 8 }}>◆</span>{l}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function GitHubCard() {
  return (
    <div className="card" style={{ gridColumn: 3, gridRow: 4 }} {...hoverBorder}>
      <div className="card-inner">
        <Lbl icon="🐙" text="GitHub" />
        <img
          src="https://ghchart.rshah.org/a78bfa/Ni7i"
          alt="GitHub chart"
          style={{ width: "100%", borderRadius: 6, filter: "brightness(0.85)" }}
        />
        <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
          <img src="https://img.shields.io/github/followers/Ni7i?style=flat-square&color=a78bfa&labelColor=141414&label=Followers" alt="followers" style={{ height: 18 }} />
          <img src="https://img.shields.io/badge/GitHub-Ni7i-a78bfa?style=flat-square&logo=github&logoColor=white&labelColor=141414" alt="github" style={{ height: 18 }} />
        </div>
      </div>
    </div>
  );
}

function MessageBoardCard() {
  const [msg, setMsg] = useState("");

  return (
    <div className="card" style={{ gridColumn: 4, gridRow: "3 / 6" }} {...hoverBorder}>
      <div className="card-inner">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div className="lbl" style={{ margin: 0 }}><span>💬</span><span>Message Board</span></div>
          <span style={{ fontSize: 9, color: "#2a2a2a", fontFamily: "monospace" }}>0/100</span>
        </div>

        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
          {MESSAGES.map((m, i) => (
            <div key={i}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: i % 2 === 1 ? "#a78bfa" : "#bbb" }}>{m.user}</span>
                <span style={{ fontSize: 9, color: "#333" }}>{m.time}</span>
              </div>
              <p style={{ fontSize: 11, color: "#666" }}>{m.text}</p>
            </div>
          ))}
        </div>

        <div style={{
          borderTop: "1px solid #1e1e1e", paddingTop: 10,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <input
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Leave a message..."
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              fontSize: 11, color: "#888",
            }}
          />
          <span style={{ fontSize: 14, color: "#333", cursor: "pointer" }}>›</span>
        </div>
      </div>
    </div>
  );
}

function BlogCard() {
  return (
    <div className="card" style={{ gridColumn: 1, gridRow: "5" }} {...hoverBorder}>
      <div className="card-inner">
        <Lbl icon="✏" text="Blog" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          <div style={{
            padding: "8px 10px", borderRadius: 8, background: "#0d0d0d",
            border: "1px solid #1e1e1e", cursor: "pointer",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#a78bfa44")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: "#ccc", marginBottom: 2, fontStyle: "italic" }}>
              Why I switched from Unity to pure C#
            </div>
            <div style={{ fontSize: 10, color: "#444" }}>March 2025</div>
          </div>
          <div style={{
            padding: "8px 10px", borderRadius: 8, background: "#0d0d0d",
            border: "1px solid #1e1e1e", cursor: "pointer",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#a78bfa44")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e1e1e")}
          >
            <div style={{ fontSize: 11, fontWeight: 600, color: "#ccc", marginBottom: 2, fontStyle: "italic" }}>
              Building clean UIs with WPF
            </div>
            <div style={{ fontSize: 10, color: "#444" }}>January 2025</div>
          </div>
        </div>
        <a href="#" style={{ marginTop: 8, fontSize: 10, color: "#333", textDecoration: "none", display: "block", textAlign: "right" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#333")}
        >Read more →</a>
      </div>
    </div>
  );
}

function SocialRow() {
  return (
    <div style={{ gridColumn: 3, gridRow: 5, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {SOCIALS.map((s) => (
        <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
          className="card"
          style={{
            padding: "10px 12px", display: "flex", alignItems: "center",
            gap: 8, textDecoration: "none", transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1f1f1f"; }}
        >
          <span style={{ fontSize: 18 }}>{s.icon}</span>
          <div>
            <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: "#3a3a3a" }}>{s.label}</div>
            <div style={{ fontSize: 10, color: "#777" }}>{s.sub}</div>
          </div>
        </a>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
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

      <div
        style={{
          height: "100vh",
          overflow: "hidden",
          padding: 10,
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(8px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "230px 1fr 1fr 200px",
            gridTemplateRows: "auto 1fr 1fr 1fr auto",
            gap: 8,
            height: "100%",
          }}
        >
          <AboutCard />
          <ShoutoutsCard />
          <NowPlayingCard />
          <ProjectsCard />
          <MapCard />
          <NavigationCard />
          <GitHubCard />
          <MessageBoardCard />
          <BlogCard />
          <SocialRow />
        </div>
      </div>
    </>
  );
}
