"use client";

import { skills } from "@/lib/data";

export default function Skills() {
  return (
    <section id="skills" className="py-24 px-6" style={{ background: "#0d0d14" }}>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">Skills</h2>
        <div className="w-12 h-1 rounded mb-12" style={{ background: "#6366f1" }} />

        <div className="grid md:grid-cols-2 gap-6">
          {skills.map((skill) => (
            <div key={skill.name}>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">{skill.name}</span>
                <span className="text-xs font-mono" style={{ color: "#6366f1" }}>
                  {skill.level}%
                </span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "#2a2a3e" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${skill.level}%`,
                    background: "linear-gradient(90deg, #6366f1, #818cf8)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
