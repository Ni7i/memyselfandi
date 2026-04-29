"use client";

import { personal, experience } from "@/lib/data";

export default function About() {
  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">Über mich</h2>
        <div className="w-12 h-1 rounded mb-12" style={{ background: "#6366f1" }} />

        <div className="grid md:grid-cols-2 gap-16">
          <div>
            <p className="mb-4" style={{ color: "#94a3b8" }}>
              {personal.bio}
            </p>
            <p style={{ color: "#94a3b8" }}>
              Aktuell suche ich ein Praktikum im Bereich Webentwicklung / Frontend, um meine Fähigkeiten in einem professionellen Umfeld auszubauen und echte Projekte zu liefern.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              {[
                ["Standort", personal.location],
                ["Email", personal.email],
                ["GitHub", "Ni7i"],
                ["Status", "Offen für Praktikum"],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs font-mono mb-1" style={{ color: "#6366f1" }}>{label}</p>
                  <p className="text-sm" style={{ color: "#e2e8f0" }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Erfahrung</h3>
            {experience.map((e) => (
              <div
                key={e.company}
                className="p-4 rounded-lg mb-4"
                style={{ background: "#1e1e2e", border: "1px solid #2a2a3e" }}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium">{e.role}</span>
                  <span className="text-xs font-mono" style={{ color: "#6366f1" }}>{e.period}</span>
                </div>
                <p className="text-sm mb-2" style={{ color: "#64748b" }}>{e.company}</p>
                <p className="text-sm" style={{ color: "#94a3b8" }}>{e.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
