import { projects } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.id }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const project = projects.find((p) => p.id === slug);
  return { title: project ? `${project.title} — Enis Shorra` : "Not Found" };
}

export default async function ProjectPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const project = projects.find((p) => p.id === slug);
  if (!project) notFound();

  const others = projects.filter((p) => p.id !== project.id);

  return (
    <main style={{
      minHeight: "100vh",
      background: "#0d0d0d",
      color: "#d4d4d4",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* Back bar */}
      <div style={{
        borderBottom: "1px solid #1a1a1a",
        padding: "14px 40px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        position: "sticky",
        top: 0,
        background: "rgba(13,13,13,0.9)",
        backdropFilter: "blur(8px)",
        zIndex: 10,
      }}>
        <Link href="/" style={{
          fontSize: 12, color: "#555", textDecoration: "none",
          display: "flex", alignItems: "center", gap: 5,
          transition: "color 0.15s",
        }}
          onMouseEnter={undefined}
        >
          ← Back to portfolio
        </Link>
        <span style={{ color: "#222" }}>·</span>
        <span style={{ fontSize: 12, color: "#333" }}>{project.title}</span>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "60px 40px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#555", marginBottom: 16 }}>
            PROJECT · {project.year}
          </div>
          <h1 style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: "#fff",
            marginBottom: 12,
            lineHeight: 1,
          }}>
            {project.title}
          </h1>
          <p style={{ fontSize: 16, color: "#666", lineHeight: 1.6, marginBottom: 24 }}>
            {project.desc}
          </p>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 28 }}>
            {project.tags.map((t) => (
              <span key={t} style={{
                padding: "4px 12px", borderRadius: 20, fontSize: 11,
                background: "#1a1a1a", color: "#888", border: "1px solid #252525",
              }}>{t}</span>
            ))}
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 10 }}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" style={{
                padding: "8px 20px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: "#1a1a1a", border: "1px solid #252525",
                color: "#ccc", textDecoration: "none",
              }}>
                View on GitHub →
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" style={{
                padding: "8px 20px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                background: "#a78bfa", color: "#fff", textDecoration: "none",
              }}>
                Live Demo →
              </a>
            )}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#1a1a1a", marginBottom: 48 }} />

        {/* Long description */}
        <div style={{ fontSize: 15, lineHeight: 1.9, color: "#888" }}>
          {project.longDesc.split("\n\n").map((para, i) => (
            <p key={i} style={{ marginBottom: 20 }}>{para}</p>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#1a1a1a", margin: "60px 0 40px" }} />

        {/* Other projects */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#444", marginBottom: 16 }}>
            OTHER PROJECTS
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {others.map((p) => (
              <Link key={p.id} href={`/projects/${p.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  padding: "14px 16px", borderRadius: 10,
                  background: "#141414", border: "1px solid #1e1e1e",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  transition: "border-color 0.2s",
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#e0e0e0", marginBottom: 2 }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: "#555" }}>{p.desc}</div>
                  </div>
                  <span style={{ color: "#333", fontSize: 16, flexShrink: 0 }}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
