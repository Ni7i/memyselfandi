import Link from "next/link";
import { formatPostDate, readingTime } from "@/lib/content/format";
import type { BlogPost } from "@/lib/content/types";

export default function PostRow({ post, heading = "h2" }: { post: BlogPost; heading?: "h2" | "h3" }) {
  const Heading = heading;
  return (
    <Link className="post-row" href={`/blog/${post.slug}`}>
      <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
      <div>
        <Heading>{post.title}</Heading>
        <p>{post.excerpt}</p>
        <span className="post-meta">
          {[`${readingTime(post.content)} read`, ...post.tags].join(" · ")}
        </span>
      </div>
      <span className="post-arrow" aria-hidden="true">→</span>
    </Link>
  );
}
