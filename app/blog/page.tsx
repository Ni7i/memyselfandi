import type { Metadata } from "next";
import PostRow from "@/components/PostRow";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getPublishedPosts } from "@/lib/content/posts";

export const metadata: Metadata = {
  title: "Blog — Enis Shorra",
  description: "Notes on what I build and learn: C#, .NET, UI and the occasional detour.",
};

// Posts are managed in /admin and read on every request.
export const dynamic = "force-dynamic";

export default async function BlogIndex() {
  const posts = await getPublishedPosts();

  return (
    <>
      <SiteHeader />
      <main className="idx page-idx" id="posts">
        <div className="idx-inner">
          <header className="idx-intro">
            <span className="idx-kicker">Writing</span>
            <h1>Notes from <em>the desk.</em></h1>
            <p>What I build, what broke along the way and what I learned from it — mostly C#, .NET and UI.</p>
            <span className="idx-count">{posts.length} {posts.length === 1 ? "post" : "posts"}</span>
          </header>

          {posts.length === 0 ? (
            <p className="post-empty">No posts yet — check back soon.</p>
          ) : (
            <div className="post-list">
              {posts.map((post) => <PostRow key={post.slug} post={post} />)}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
