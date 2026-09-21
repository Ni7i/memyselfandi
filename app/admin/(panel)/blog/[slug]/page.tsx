import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { postStore } from "@/lib/content/posts";
import DeleteButton from "../../../_components/DeleteButton";
import PostForm from "../../../_components/PostForm";
import StorageNotice from "../../../_components/StorageNotice";

export const metadata: Metadata = { title: "Blogpost bearbeiten" };

export default async function EditPostPage(props: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await props.params;
  const [post, status] = await Promise.all([postStore.get(slug, "admin"), postStore.status()]);
  if (!post) notFound();

  return (
    <>
      <div className="adm-page-head">
        <div>
          <span className="adm-kicker">Blogpost bearbeiten</span>
          <h1 className="adm-title">{post.title}</h1>
        </div>
        <DeleteButton endpoint={`/api/admin/posts/${encodeURIComponent(post.slug)}`} itemTitle={post.title} redirectTo="/admin/blog" />
      </div>
      <StorageNotice connected={status.connected} reachable={status.reachable} />
      <PostForm post={post} today={post.publishedAt} />
    </>
  );
}
