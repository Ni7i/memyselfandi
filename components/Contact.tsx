"use client";

import { personal } from "@/lib/data";

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6" style={{ background: "#0d0d14" }}>
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-2">Kontakt</h2>
        <div className="w-12 h-1 rounded mb-6 mx-auto" style={{ background: "#6366f1" }} />
        <p className="mb-10 max-w-md mx-auto" style={{ color: "#94a3b8" }}>
          Ich bin offen für Praktikumsangebote und spannende Projekte. Schreib mir einfach!
        </p>

        <a
          href={`mailto:${personal.email}`}
          className="inline-block px-8 py-4 rounded-lg font-medium text-white transition-all duration-200"
          style={{ background: "#6366f1" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#4f46e5")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#6366f1")}
        >
          {personal.email}
        </a>

        <div className="flex justify-center gap-8 mt-12">
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
        </div>
      </div>
    </section>
  );
}
