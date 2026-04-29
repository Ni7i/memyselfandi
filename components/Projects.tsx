"use client";

import { projects } from "@/lib/data";

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">Projekte</h2>
        <div className="w-12 h-1 rounded mb-12" style={{ background: "#6366f1" }} />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.title}
              className="rounded-xl p-6 flex flex-col transition-all duration-200"
              style={{ background: "#1e1e2e", border: "1px solid #2a2a3e" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "#6366f1")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "#2a2a3e")
              }
            >
              <h3 className="text-lg font-semibold mb-3">{project.title}</h3>
              <p className="text-sm mb-4 flex-1" style={{ color: "#94a3b8" }}>
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded"
                    style={{ background: "#2a2a3e", color: "#818cf8" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs transition-colors duration-200"
                    style={{ color: "#64748b" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#6366f1")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                  >
                    GitHub →
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs transition-colors duration-200"
                    style={{ color: "#64748b" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#6366f1")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#64748b")}
                  >
                    Live →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
