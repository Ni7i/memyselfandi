import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PostContent from "@/components/PostContent";
import PostRow from "@/components/PostRow";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { formatPostDate, readingTime } from "@/lib/content/format";
import { getPublishedPost, getPublishedPosts } from "@/lib/content/posts";

// Posts are managed in /admin and read on every request.
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPublishedPost((await params).slug);
  return post ? { title: `${post.title} — Enis Shorra`, description: post.excerpt } : { title: "Not Found" };
}

export default async function BlogPost({ params }: Props) {
  const post = await getPublishedPost((await params).slug);
  if (!post) notFound();

  const others = (await getPublishedPosts()).filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main className="article">
        <article className="article-inner">
          <Link className="article-back" href="/blog">← All posts</Link>
          <header className="article-head">
            <span className="idx-kicker">
              <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time> · {readingTime(post.content)} read
            </span>
            <h1 className="article-title">{post.title}</h1>
            <p className="article-lead">{post.excerpt}</p>
            {post.tags.length > 0 && (
              <ul className="article-tags" aria-label="Tags">
                {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            )}
          </header>
          <div className="article-body">
            <PostContent content={post.content} />
          </div>
        </article>

        {others.length > 0 && (
          <aside className="article-inner article-more">
            <span className="archive-label">More posts</span>
            <div className="post-list">
              {others.map((p) => <PostRow key={p.slug} post={p} heading="h3" />)}
            </div>
          </aside>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
