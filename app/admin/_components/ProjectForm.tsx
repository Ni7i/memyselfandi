"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Project } from "@/lib/content/types";
import { sendJson, slugify, splitList, type FieldErrors } from "./api";
import Field from "./Field";
import SessionExpiredNotice from "./SessionExpiredNotice";

interface Props {
  /** Existing project when editing; omitted when creating. */
  project?: Project;
  nextOrder?: number;
}

export default function ProjectForm({ project, nextOrder = 0 }: Props) {
  const router = useRouter();
  const editing = Boolean(project);
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(editing);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = {
      title,
      slug,
      description: data.get("description"),
      longDescription: data.get("longDescription"),
      stack: splitList(String(data.get("stack") ?? "")),
      repoUrl: data.get("repoUrl"),
      liveUrl: data.get("liveUrl"),
      year: data.get("year"),
      order: Number(data.get("order")),
      featured: data.get("featured") === "on",
      published: data.get("published") === "on",
    };

    setSaving(true);
    setErrors({});
    setFormError(null);
    setSessionExpired(false);
    const result = editing
      ? await sendJson("PUT", `/api/admin/projects/${encodeURIComponent(project!.slug)}`, body)
      : await sendJson("POST", "/api/admin/projects", body);

    if (result.ok) {
      router.push("/admin/projects");
      router.refresh();
      return;
    }
    if (result.status === 401) {
      // Keep everything typed so far; the user signs in again in another tab.
      setSessionExpired(true);
      setSaving(false);
      return;
    }
    setErrors(result.fields);
    setFormError(result.error);
    setSaving(false);
  };

  return (
    <form className="adm-form" onSubmit={handleSubmit} noValidate>
      {sessionExpired && <SessionExpiredNotice />}
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
            maxLength={120}
            required
            onChange={(event) => {
              setTitle(event.target.value);
              if (!slugTouched) setSlug(slugify(event.target.value));
            }}
          />
        </Field>
        <Field label="Slug" error={errors.slug} hint={`URL: /projects/${slug || "…"}`}>
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

      <Field label="Kurzbeschreibung" error={errors.description} hint="Eine Zeile, erscheint im Projekt-Archiv der Startseite.">
        <textarea name="description" rows={2} maxLength={300} required defaultValue={project?.description} />
      </Field>

      <Field label="Beschreibung (Detailseite)" error={errors.longDescription} hint="Optional. Absätze mit einer Leerzeile trennen.">
        <textarea name="longDescription" rows={7} maxLength={10000} defaultValue={project?.longDescription} />
      </Field>

      <Field label="Tech-Stack" error={errors.stack} hint="Durch Kommas getrennt, z. B. C#, .NET 8, Blazor">
        <input name="stack" defaultValue={project?.stack.join(", ")} />
      </Field>

      <div className="adm-form-row">
        <Field label="Repository-URL" error={errors.repoUrl}>
          <input name="repoUrl" type="url" inputMode="url" placeholder="https://github.com/…" defaultValue={project?.repoUrl} />
        </Field>
        <Field label="Live-URL" error={errors.liveUrl}>
          <input name="liveUrl" type="url" inputMode="url" placeholder="https://…" defaultValue={project?.liveUrl} />
        </Field>
      </div>

      <div className="adm-form-row">
        <Field label="Jahr" error={errors.year}>
          <input name="year" maxLength={20} placeholder="2026" defaultValue={project?.year} />
        </Field>
        <Field label="Reihenfolge" error={errors.order} hint="Kleinere Zahl steht weiter oben.">
          <input name="order" type="number" min={0} max={9999} step={1} defaultValue={project?.order ?? nextOrder} />
        </Field>
      </div>

      <div className="adm-checks">
        <label className="adm-check">
          <input name="featured" type="checkbox" defaultChecked={project?.featured ?? false} />
          Top-Projekt
        </label>
        <label className="adm-check">
          <input name="published" type="checkbox" defaultChecked={project?.published ?? true} />
          Veröffentlicht
        </label>
      </div>

      <div className="adm-form-footer">
        <button className="adm-button" type="submit" disabled={saving}>
          {saving ? "Speichere …" : editing ? "Änderungen speichern" : "Projekt anlegen"}
        </button>
        <Link className="adm-button-ghost" href="/admin/projects">Abbrechen</Link>
      </div>
    </form>
  );
}
