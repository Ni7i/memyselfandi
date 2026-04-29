"use client";

import { personal } from "@/lib/data";

export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(99,102,241,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl w-full relative z-10">
        <p className="text-sm font-mono mb-4" style={{ color: "#6366f1" }}>
          Hallo, ich bin
        </p>
        <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
          {personal.name}
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold mb-6" style={{ color: "#64748b" }}>
          {personal.role}
        </h2>
        <p className="text-lg max-w-xl mb-10" style={{ color: "#94a3b8" }}>
          {personal.bio}
        </p>
        <div className="flex gap-4 flex-wrap">
          <a
            href="#projects"
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200 text-white"
            style={{ background: "#6366f1" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#4f46e5")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#6366f1")}
          >
            Projekte ansehen
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-lg font-medium transition-all duration-200"
            style={{ border: "1px solid #2a2a3e", color: "#94a3b8" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#6366f1";
              e.currentTarget.style.color = "#e2e8f0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#2a2a3e";
              e.currentTarget.style.color = "#94a3b8";
            }}
          >
            Kontakt
          </a>
        </div>

        <div className="flex gap-6 mt-12">
          <a
            href={personal.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200"
            style={{ color: "#64748b" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#6366f1")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
          >
            GitHub
          </a>
          <a
            href={personal.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200"
            style={{ color: "#64748b" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#6366f1")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${personal.email}`}
            className="transition-colors duration-200"
            style={{ color: "#64748b" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#6366f1")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
          >
            E-Mail
          </a>
        </div>
      </div>
    </section>
  );
}
