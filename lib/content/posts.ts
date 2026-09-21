import "server-only";
import { createCollection } from "./collection";
import { seedBlogPosts } from "./seed";
import type { BlogPost } from "./types";
import { parseStoredBlogPost } from "./validation";

export const postStore = createCollection<BlogPost>({
  key: "content:posts",
  seed: () => seedBlogPosts,
  parse: parseStoredBlogPost,
  compare: (a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title),
});

export async function getPublishedPosts(): Promise<BlogPost[]> {
  return (await postStore.list("public")).filter((post) => post.published);
}

export async function getPublishedPost(slug: string): Promise<BlogPost | null> {
  const post = await postStore.get(slug, "public");
  return post?.published ? post : null;
}
