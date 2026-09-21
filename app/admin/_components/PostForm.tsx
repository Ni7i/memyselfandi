"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { BlogPost } from "@/lib/content/types";
import { sendJson, slugify, splitList, type FieldErrors } from "./api";
import Field from "./Field";

interface Props {
  /** Existing post when editing; omitted when creating. */
  post?: BlogPost;
  today: string;
}

export default function PostForm({ post, today }: Props) {
  const router = useRouter();
  const editing = Boolean(post);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(editing);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = {
      title,
      slug,
      publishedAt: data.get("publishedAt"),
      excerpt: data.get("excerpt"),
      content: data.get("content"),
      tags: splitList(String(data.get("tags") ?? "")),
      published: data.get("published") === "on",
    };

    setSaving(true);
    setErrors({});
    setFormError(null);
    const result = editing
      ? await sendJson("PUT", `/api/admin/posts/${encodeURIComponent(post!.slug)}`, body)
      : await sendJson("POST", "/api/admin/posts", body);

    if (result.ok) {
      router.push("/admin/blog");
      router.refresh();
      return;
    }
    if (result.status === 401) {
      router.replace("/admin/login");
      return;
    }
    setErrors(result.fields);
    setFormError(result.error);
    setSaving(false);
  };

  return (
    <form className="adm-form" onSubmit={handleSubmit} noValidate>
      {formError && (
        <div className="adm-notice" data-tone="error" role="alert">
          <strong>Nicht gespeichert</strong>
          <span>{formError}</span>
        </div>
      )}

      <div className="adm-form-row">
        <Field label="Titel" error={errors.title}>
          <input
            name="title"
            value={title}
            maxLength={160}
            required
            onChange={(event) => {
              setTitle(event.target.value);
              if (!slugTouched) setSlug(slugify(event.target.value));
            }}
          />
        </Field>
        <Field label="Slug" error={errors.slug} hint={`URL: /blog/${slug || "…"}`}>
          <input
            name="slug"
            value={slug}
            maxLength={80}
            required
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value);
            }}
          />
        </Field>
      </div>

      <div className="adm-form-row">
        <Field label="Datum" error={errors.publishedAt}>
          <input name="publishedAt" type="date" required defaultValue={post?.publishedAt ?? today} />
        </Field>
        <Field label="Tags" error={errors.tags} hint="Durch Kommas getrennt">
          <input name="tags" defaultValue={post?.tags.join(", ")} />
        </Field>
      </div>

      <Field label="Teaser" error={errors.excerpt} hint="Kurze Zusammenfassung, höchstens 300 Zeichen.">
        <textarea name="excerpt" rows={2} maxLength={300} required defaultValue={post?.excerpt} />
      </Field>

      <Field
        label="Inhalt"
        error={errors.content}
        hint="Absätze mit einer Leerzeile trennen. **Fett** für Hervorhebungen; ein Absatz nur aus **…** wird zur Zwischenüberschrift."
      >
        <textarea name="content" rows={18} maxLength={50000} required defaultValue={post?.content} />
      </Field>

      <div className="adm-checks">
        <label className="adm-check">
          <input name="published" type="checkbox" defaultChecked={post?.published ?? false} />
          Veröffentlicht
        </label>
      </div>

      <div className="adm-form-footer">
        <button className="adm-button" type="submit" disabled={saving}>
          {saving ? "Speichere …" : editing ? "Änderungen speichern" : "Blogpost anlegen"}
        </button>
        <Link className="adm-button-ghost" href="/admin/blog">Abbrechen</Link>
      </div>
    </form>
  );
}
