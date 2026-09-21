import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/guard";
import { postStore } from "@/lib/content/posts";
import PostForm from "../../../_components/PostForm";
import StorageNotice from "../../../_components/StorageNotice";

export const metadata: Metadata = { title: "Neuer Blogpost" };

export default async function NewPostPage() {
  await requireAdmin();
  const status = await postStore.status();
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Zurich" });

  return (
    <>
      <div className="adm-page-head">
        <div>
          <span className="adm-kicker">Blog</span>
          <h1 className="adm-title">Neuer <em>Blogpost</em></h1>
        </div>
      </div>
      <StorageNotice connected={status.connected} reachable={status.reachable} />
      <PostForm today={today} />
    </>
  );
}
