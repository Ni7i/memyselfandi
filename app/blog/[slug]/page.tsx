import { blogPosts } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.id }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = blogPosts.find((p) => p.id === slug);
  return { title: post ? `${post.title} — Enis Shorra` : "Not Found" };
}

export default async function BlogPost(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = blogPosts.find((p) => p.id === slug);
  if (!post) notFound();

  const others = blogPosts.filter((p) => p.id !== post.id);

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
        <Link href="/" style={{ fontSize: 12, color: "#555", textDecoration: "none" }}>
          ← Back to portfolio
        </Link>
        <span style={{ color: "#222" }}>·</span>
        <span style={{ fontSize: 12, color: "#333" }}>{post.title}</span>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "60px 40px" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 20 }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#555" }}>
              {post.date}
            </span>
            <span style={{ color: "#222" }}>·</span>
            <span style={{ fontSize: 10, color: "#444" }}>{post.readTime} read</span>
          </div>

          <h1 style={{
            fontSize: "clamp(28px, 4vw, 44px)",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: "#fff",
            marginBottom: 20,
            lineHeight: 1.15,
          }}>
            {post.title}
          </h1>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {post.tags.map((t) => (
              <span key={t} style={{
                padding: "3px 10px", borderRadius: 20, fontSize: 10,
                background: "#1a1a1a", color: "#666", border: "1px solid #222",
              }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#1a1a1a", marginBottom: 44 }} />

        {/* Content */}
        <div style={{ fontSize: 15, lineHeight: 1.9, color: "#888" }}>
          {post.content.split("\n\n").map((para, i) => {
            if (para.startsWith("**") && para.endsWith("**")) {
              return (
                <h2 key={i} style={{
                  fontSize: 18, fontWeight: 700, color: "#e0e0e0",
                  marginBottom: 12, marginTop: 32,
                }}>
                  {para.replace(/\*\*/g, "")}
                </h2>
              );
            }
            // Handle inline bold
            const parts = para.split(/(\*\*[^*]+\*\*)/g);
            return (
              <p key={i} style={{ marginBottom: 20 }}>
                {parts.map((part, j) =>
                  part.startsWith("**") && part.endsWith("**")
                    ? <strong key={j} style={{ color: "#d4d4d4", fontWeight: 700 }}>{part.replace(/\*\*/g, "")}</strong>
                    : <span key={j}>{part}</span>
                )}
              </p>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#1a1a1a", margin: "60px 0 40px" }} />

        {/* Other posts */}
        {others.length > 0 && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#444", marginBottom: 16 }}>
              MORE POSTS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {others.map((p) => (
                <Link key={p.id} href={`/blog/${p.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    padding: "14px 16px", borderRadius: 10,
                    background: "#141414", border: "1px solid #1e1e1e",
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#e0e0e0", marginBottom: 2 }}>{p.title}</div>
                      <div style={{ fontSize: 11, color: "#555" }}>{p.date} · {p.readTime} read</div>
                    </div>
                    <span style={{ color: "#333", fontSize: 16 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
