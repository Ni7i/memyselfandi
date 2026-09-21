import type { BlogPost, BlogPostInput, Project, ProjectInput } from "./types";

export type FieldErrors = Record<string, string>;
export type ValidationResult<T> = { ok: true; value: T } | { ok: false; errors: FieldErrors };

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// "new" would collide with the /admin/projects/new and /admin/blog/new routes.
const RESERVED_SLUGS = new Set(["new"]);

type Fields = Record<string, unknown>;

function asFields(input: unknown): Fields | null {
  return typeof input === "object" && input !== null && !Array.isArray(input) ? (input as Fields) : null;
}

function text(fields: Fields, name: string, errors: FieldErrors, { required, max }: { required: boolean; max: number }) {
  const raw = fields[name];
  if (raw !== undefined && typeof raw !== "string") {
    errors[name] = "Muss Text sein.";
    return "";
  }
  const value = (raw ?? "").trim();
  if (required && !value) errors[name] = "Pflichtfeld.";
  else if (value.length > max) errors[name] = `Höchstens ${max} Zeichen.`;
  return value;
}

function slug(fields: Fields, errors: FieldErrors) {
  const value = text(fields, "slug", errors, { required: true, max: 80 });
  if (errors.slug) return value;
  if (!SLUG_PATTERN.test(value)) errors.slug = "Nur Kleinbuchstaben, Ziffern und einzelne Bindestriche.";
  else if (RESERVED_SLUGS.has(value)) errors.slug = `"${value}" ist reserviert.`;
  return value;
}

function url(fields: Fields, name: string, errors: FieldErrors) {
  const value = text(fields, name, errors, { required: false, max: 500 });
  if (!value || errors[name]) return value;
  try {
    // Only http(s): a javascript: URL would run script from an href on the public site.
    const protocol = new URL(value).protocol;
    if (protocol !== "https:" && protocol !== "http:") errors[name] = "Nur http(s)-Links.";
  } catch {
    errors[name] = "Keine gültige URL.";
  }
  return value;
}

function list(fields: Fields, name: string, errors: FieldErrors, { maxItems, maxLength }: { maxItems: number; maxLength: number }) {
  const raw = fields[name] ?? [];
  if (!Array.isArray(raw) || raw.some((item) => typeof item !== "string")) {
    errors[name] = "Muss eine Liste aus Text sein.";
    return [];
  }
  const items = [...new Set(raw.map((item: string) => item.trim()).filter(Boolean))];
  if (items.length > maxItems) errors[name] = `Höchstens ${maxItems} Einträge.`;
  else if (items.some((item) => item.length > maxLength)) errors[name] = `Einträge höchstens ${maxLength} Zeichen.`;
  return items;
}

function flag(fields: Fields, name: string, errors: FieldErrors) {
  const raw = fields[name] ?? false;
  if (typeof raw !== "boolean") errors[name] = "Muss true oder false sein.";
  return raw === true;
}

function isoDate(fields: Fields, name: string, errors: FieldErrors) {
  const value = text(fields, name, errors, { required: true, max: 10 });
  if (errors[name]) return value;
  const date = new Date(`${value}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    errors[name] = "Datum im Format JJJJ-MM-TT.";
  }
  return value;
}

function finish<T>(value: T, errors: FieldErrors): ValidationResult<T> {
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value };
}

export function validateProjectInput(input: unknown): ValidationResult<ProjectInput> {
  const fields = asFields(input);
  if (!fields) return { ok: false, errors: { _form: "Ungültige Daten." } };
  const errors: FieldErrors = {};

  const order = fields.order ?? 0;
  if (typeof order !== "number" || !Number.isInteger(order) || order < 0 || order > 9999) {
    errors.order = "Ganze Zahl zwischen 0 und 9999.";
  }

  return finish(
    {
      slug: slug(fields, errors),
      title: text(fields, "title", errors, { required: true, max: 120 }),
      description: text(fields, "description", errors, { required: true, max: 300 }),
      longDescription: text(fields, "longDescription", errors, { required: false, max: 10_000 }),
      stack: list(fields, "stack", errors, { maxItems: 12, maxLength: 40 }),
      repoUrl: url(fields, "repoUrl", errors),
      liveUrl: url(fields, "liveUrl", errors),
      year: text(fields, "year", errors, { required: false, max: 20 }),
      featured: flag(fields, "featured", errors),
      published: flag(fields, "published", errors),
      order: typeof order === "number" ? order : 0,
    },
    errors,
  );
}

export function validateBlogPostInput(input: unknown): ValidationResult<BlogPostInput> {
  const fields = asFields(input);
  if (!fields) return { ok: false, errors: { _form: "Ungültige Daten." } };
  const errors: FieldErrors = {};

  return finish(
    {
      slug: slug(fields, errors),
      title: text(fields, "title", errors, { required: true, max: 160 }),
      excerpt: text(fields, "excerpt", errors, { required: true, max: 300 }),
      content: text(fields, "content", errors, { required: true, max: 50_000 }),
      tags: list(fields, "tags", errors, { maxItems: 10, maxLength: 30 }),
      publishedAt: isoDate(fields, "publishedAt", errors),
      published: flag(fields, "published", errors),
    },
    errors,
  );
}

function storedTimestamp(value: unknown) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value)) ? value : null;
}

/** Re-validates what comes back from Redis, so hand-edited records can never reach a page unchecked. */
export function parseStoredProject(value: unknown): Project | null {
  const result = validateProjectInput(value);
  return result.ok ? { ...result.value, updatedAt: storedTimestamp(asFields(value)?.updatedAt) } : null;
}

export function parseStoredBlogPost(value: unknown): BlogPost | null {
  const result = validateBlogPostInput(value);
  return result.ok ? { ...result.value, updatedAt: storedTimestamp(asFields(value)?.updatedAt) } : null;
}
