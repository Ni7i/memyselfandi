"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";

// ─── Data ──────────────────────────────────────────────────────────────────
const ME = {
  name: "Enis",
  surname: "Shorra",
  age: 17,
  role: "C# / .NET Developer & UI Enthusiast",
  location: "Deutschland",
  email: "shorra.enis@hotmail.com",
  github: "https://github.com/Ni7i",
  linkedin: "https://linkedin.com/in/enis-shorra",
  discord: "enis.shorra",
  bio: "I'm a {age}-year-old computer science student, currently building cool stuff with C# and .NET.",
  facts: [
    "I build game logic systems for fun",
    "Strong OOP fundamentals",
    "I love clean, minimal UI design",
    "Currently open for internships",
    "I drink too much energy drinks",
  ],
};

const TECH = ["C#", ".NET", "TypeScript", "React", "Next.js", "Git", "Figma", "SQL"];
const HARDWARE = ["Custom PC", "Mechanical Keyboard", "Ultrawide Monitor"];

const PROJECTS = [
  {
    title: "WhitePlayer",
    period: "2024 – heute",
    description: "A minimal music player with clean UI and smooth animations. Built from scratch.",
    tags: ["C#", ".NET", "WPF", "Audio API"],
    github: "https://github.com/Ni7i",
    live: "",
  },
  {
    title: "Portfolio",
    period: "2025",
    description: "This portfolio — designed and built from scratch with Next.js, Tailwind and Framer Motion.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    github: "https://github.com/Ni7i/memyselfandi",
    live: "https://memyselfandi-two.vercel.app",
  },
  {
    title: "Game Logic Engine",
    period: "2024",
    description: "A reusable game logic system with state machines, event bus and entity component system.",
    tags: ["C#", "OOP", "Design Patterns"],
    github: "https://github.com/Ni7i",
    live: "",
  },
];

const BLOG = [
  {
    title: "Why I switched from Unity to pure C#",
    date: "March 2025",
    excerpt: "After building several game prototypes in Unity, I decided to strip everything back and build my own engine layer...",
  },
  {
    title: "Building clean UIs with WPF",
    date: "January 2025",
    excerpt: "WPF doesn't have to look like Windows XP. Here's how I make it look modern and smooth.",
  },
];

const SHOUTOUTS = [
  { label: "GitHub", url: "https://github.com/Ni7i" },
  { label: "LinkedIn", url: "https://linkedin.com/in/enis-shorra" },
  { label: "Discord", url: "#" },
  { label: "Email", url: "mailto:shorra.enis@hotmail.com" },
  { label: "Vercel", url: "https://memyselfandi-two.vercel.app" },
  { label: "Portfolio Repo", url: "https://github.com/Ni7i/memyselfandi" },
];

// ─── Helpers ───────────────────────────────────────────────────────────────
function Label({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="card-label">
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function Tag({ text }: { text: string }) {
  return <span className="tag">{text}</span>;
}

// ─── Cards ─────────────────────────────────────────────────────────────────

function AboutCard() {
  return (
    <div
      className="card"
      style={{
        gridColumn: "1",
        gridRow: "1 / 3",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        backgroundImage:
          "radial-gradient(ellipse at bottom right, rgba(167,139,250,0.08) 0%, transparent 60%)",
      }}
    >
      <Label icon="○" text="About Me" />

      <div>
        <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>
          Hello I&apos;m{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #a78bfa, #f472b6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontStyle: "italic",
            }}
          >
            {ME.name}
          </span>
        </div>
      </div>

      <p style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6 }}>
        I&apos;m a {ME.age}-year-old computer science student,{" "}
        currently building cool stuff with{" "}
        <em style={{ color: "#e0e0e0", fontStyle: "italic" }}>C# & .NET</em>.
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#666" }}>
        <span>📍</span>
        <span>{ME.location}</span>
      </div>

      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#555", marginBottom: 8 }}>
          ★ FACTS
        </div>
        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
          {ME.facts.map((f, i) => (
            <li key={i} style={{ fontSize: 12, color: "#999", display: "flex", gap: 6 }}>
              <span style={{ color: "#444" }}>•</span>
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Mountain silhouette */}
      <div style={{ marginTop: "auto", opacity: 0.2 }}>
        <svg viewBox="0 0 260 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,60 60,10 100,35 150,0 200,30 260,5 260,60" fill="#a78bfa" />
        </svg>
      </div>
    </div>
  );
}

function ShoutoutsCard() {
  return (
    <div
      className="card"
      style={{ gridColumn: "2 / 4", gridRow: "1", padding: 20 }}
    >
      <Label icon="🔗" text="Shoutouts & Links" />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {SHOUTOUTS.map((s) => (
          <a
            key={s.label}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              background: "#252525",
              border: "1px solid #333",
              fontSize: 12,
              color: "#ccc",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#a78bfa";
              e.currentTarget.style.color = "#a78bfa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#333";
              e.currentTarget.style.color = "#ccc";
            }}
          >
            🌐 {s.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function ProjectsCard() {
  return (
    <div
      className="card"
      style={{ gridColumn: "2 / 4", gridRow: "2 / 5", padding: 20, display: "flex", flexDirection: "column" }}
    >
      <Label icon="⚡" text="Projects" />
      <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
        {PROJECTS.map((p, i) => (
          <div
            key={i}
            style={{
              padding: 16,
              borderRadius: 10,
              background: "#161616",
              border: "1px solid #2a2a2a",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#a78bfa")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{p.title}</span>
              <span style={{ fontSize: 11, color: "#555", whiteSpace: "nowrap", marginLeft: 12 }}>{p.period}</span>
            </div>
            <p style={{ fontSize: 12, color: "#888", marginBottom: 10, lineHeight: 1.5 }}>{p.description}</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              {p.tags.map((t) => (
                <Tag key={t} text={t} />
              ))}
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              {p.github && (
                <a href={p.github} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 11, color: "#555", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                >
                  GitHub →
                </a>
              )}
              {p.live && (
                <a href={p.live} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 11, color: "#555", textDecoration: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#60a5fa")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                >
                  Live →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: "right", marginTop: 12 }}>
        <a href="https://github.com/Ni7i" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 12, color: "#555", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
        >
          View more →
        </a>
      </div>
    </div>
  );
}

function GalleryCard() {
  // Gradient placeholders instead of real images
  const gradients = [
    "linear-gradient(135deg, #667eea, #764ba2)",
    "linear-gradient(135deg, #f093fb, #f5576c)",
    "linear-gradient(135deg, #4facfe, #00f2fe)",
    "linear-gradient(135deg, #43e97b, #38f9d7)",
  ];
  return (
    <div className="card" style={{ gridColumn: "3", gridRow: "1", padding: 20 }}>
      <Label icon="🖼" text="Gallery" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {gradients.map((g, i) => (
          <div
            key={i}
            style={{
              height: 70,
              borderRadius: 8,
              background: g,
              opacity: 0.8,
            }}
          />
        ))}
      </div>
      <div style={{ marginTop: 8, textAlign: "right" }}>
        <span style={{ fontSize: 11, color: "#555" }}>See more →</span>
      </div>
    </div>
  );
}

function MapCard() {
  return (
    <div className="card" style={{ gridColumn: "3", gridRow: "2 / 4", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", top: 12, left: 12, zIndex: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{
          background: "rgba(30,30,30,0.85)",
          backdropFilter: "blur(6px)",
          border: "1px solid #333",
          borderRadius: 6,
          padding: "4px 10px",
          fontSize: 11,
          fontWeight: 600,
          color: "#ccc",
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}>
          🗺 MAP
        </div>
      </div>
      <iframe
        src="https://www.openstreetmap.org/export/embed.html?bbox=6.0,47.5,15.0,55.0&layer=mapnik"
        style={{ width: "100%", height: "100%", minHeight: 220, border: "none", filter: "invert(0.9) hue-rotate(180deg) brightness(0.85)" }}
        title="Map"
      />
    </div>
  );
}

function GitHubCard() {
  return (
    <div className="card" style={{ gridColumn: "3", gridRow: "4", padding: 20 }}>
      <Label icon="🐙" text="GitHub" />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <img
          src="https://ghchart.rshah.org/a78bfa/Ni7i"
          alt="GitHub contribution chart"
          style={{ width: "100%", borderRadius: 6, filter: "brightness(0.9)" }}
        />
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <img src="https://img.shields.io/github/followers/Ni7i?style=flat&color=a78bfa&labelColor=1e1e1e&label=Followers" alt="followers" />
          <img src="https://img.shields.io/badge/GitHub-Ni7i-a78bfa?style=flat&logo=github&logoColor=white&labelColor=1e1e1e" alt="github" />
        </div>
      </div>
    </div>
  );
}

function BlogCard() {
  return (
    <div className="card" style={{ gridColumn: "1", gridRow: "3 / 5", padding: 20 }}>
      <Label icon="✏" text="Blog" />
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {BLOG.map((post, i) => (
          <div key={i} style={{
            padding: 14,
            borderRadius: 8,
            background: "#161616",
            border: "1px solid #2a2a2a",
            cursor: "pointer",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#a78bfa")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
          >
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 5, fontStyle: "italic" }}>{post.title}</div>
            <div style={{ fontSize: 11, color: "#888", marginBottom: 6, lineHeight: 1.5 }}>{post.excerpt}</div>
            <div style={{ fontSize: 10, color: "#555" }}>{post.date}</div>
          </div>
        ))}
        <a style={{ fontSize: 11, color: "#555", textAlign: "right", display: "block", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
          href="#">
          Read more →
        </a>
      </div>
    </div>
  );
}

function StuffCard() {
  return (
    <div className="card" style={{ gridColumn: "1", gridRow: "5", padding: 20 }}>
      <Label icon="🛠" text="Stuff I Use" />
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#555", marginBottom: 8 }}>
          TECH STACK
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
          {TECH.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#555", marginBottom: 8 }}>
          HARDWARE
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {HARDWARE.map((h) => (
            <div key={h} style={{ fontSize: 12, color: "#888", display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ color: "#444" }}>◆</span>{h}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NowPlayingCard() {
  return (
    <div className="card" style={{ gridColumn: "4", gridRow: "1", padding: 20 }}>
      <Label icon="🎵" text="Now Playing" />
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{
          width: "100%",
          aspectRatio: "1",
          maxHeight: 120,
          borderRadius: 10,
          background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 40,
        }}>
          🎧
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Lofi Chill Mix</div>
          <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>Artist — 4:20</div>
        </div>
        <div style={{ height: 2, background: "#2a2a2a", borderRadius: 2 }}>
          <div style={{ width: "45%", height: "100%", background: "linear-gradient(90deg, #a78bfa, #60a5fa)", borderRadius: 2 }} />
        </div>
      </div>
    </div>
  );
}

function NavigationCard() {
  const links = ["Projects", "Blog", "Gallery", "Contact"];
  return (
    <div className="card" style={{ gridColumn: "4", gridRow: "2", padding: 20 }}>
      <Label icon="◎" text="Navigation" />
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
        {links.map((l) => (
          <li key={l}>
            <a
              href={`#${l.toLowerCase()}`}
              style={{
                fontSize: 14,
                color: "#aaa",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#a78bfa")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#aaa")}
            >
              <span style={{ color: "#444", fontSize: 10 }}>◆</span>
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MessageBoardCard() {
  const msgs = [
    { user: "Anonymous", time: "2d ago", text: "sick portfolio 🔥" },
    { user: "Lisa", time: "5d ago", text: "love the design!" },
    { user: "Anonymous", time: "1w ago", text: "Whoop Whoop, let's collab ^^" },
    { user: "Max", time: "2w ago", text: "nice clean UI bro" },
    { user: "Anonymous", time: "3w ago", text: "giving out internships?" },
  ];
  return (
    <div className="card" style={{ gridColumn: "4", gridRow: "3 / 6", padding: 20, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div className="card-label" style={{ margin: 0 }}>
          <span>💬</span>
          <span>MESSAGE BOARD</span>
        </div>
        <span style={{ fontSize: 11, color: "#444" }}>0/100</span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12 }}>
        {msgs.map((m, i) => (
          <div key={i}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: i % 2 === 1 ? "#a78bfa" : "#ccc" }}>{m.user}</span>
              <span style={{ fontSize: 10, color: "#444" }}>{m.time}</span>
            </div>
            <p style={{ fontSize: 12, color: "#888" }}>{m.text}</p>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 16,
        display: "flex",
        alignItems: "center",
        gap: 8,
        borderTop: "1px solid #2a2a2a",
        paddingTop: 12,
      }}>
        <input
          type="text"
          placeholder="Leave a message..."
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: 12,
            color: "#666",
          }}
        />
        <span style={{ fontSize: 16, color: "#444", cursor: "pointer" }}>›</span>
      </div>
    </div>
  );
}

function SocialLinksRow() {
  const socials = [
    { icon: "🐙", label: "GITHUB", sub: "Ni7i", url: ME.github },
    { icon: "💼", label: "LINKEDIN", sub: "enis-shorra", url: ME.linkedin },
    { icon: "✉️", label: "EMAIL", sub: "shorra.enis@...", url: `mailto:${ME.email}` },
    { icon: "💬", label: "DISCORD", sub: ME.discord, url: "#" },
  ];
  return (
    <>
      {socials.map((s) => (
        <a
          key={s.label}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="card"
          style={{
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            transition: "border-color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#a78bfa")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}
        >
          <span style={{ fontSize: 20 }}>{s.icon}</span>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", color: "#666" }}>{s.label}</div>
            <div style={{ fontSize: 11, color: "#aaa" }}>{s.sub}</div>
          </div>
        </a>
      ))}
    </>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleDone = () => {
    setLoaded(true);
    setTimeout(() => setVisible(true), 50);
  };

  return (
    <>
      {!loaded && <LoadingScreen onDone={handleDone} />}

      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(12px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
          minHeight: "100vh",
          padding: 10,
        }}
      >
        {/* Bento Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "260px 1fr 1fr 220px",
            gridTemplateRows: "auto auto auto auto auto",
            gap: 10,
            maxWidth: 1380,
            margin: "0 auto",
          }}
        >
          {/* Row 1: About, Shoutouts, Gallery, LastFM */}
          <AboutCard />
          <ShoutoutsCard />
          <GalleryCard />
          <NowPlayingCard />

          {/* Row 2: (About continues), Projects, Map, Navigation */}
          {/* About spans row 1-2, Projects spans row 2-4, Map spans row 2-3 */}
          <ProjectsCard />
          <MapCard />
          <NavigationCard />

          {/* Row 3: Blog, (Projects), (Map), Message Board */}
          <BlogCard />
          <GitHubCard />
          <MessageBoardCard />

          {/* Row 4: (Blog continues), (Projects), Social row */}
          {/* Blog spans 3-4, Projects spans 2-4 */}

          {/* Row 5: Stuff, (Projects ends), Social Links */}
          <StuffCard />
          {/* Social links as mini cards in row 4/5 col 3 */}
          <div style={{
            gridColumn: "3",
            gridRow: "5",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}>
            <SocialLinksRow />
          </div>
        </div>
      </div>
    </>
  );
}
