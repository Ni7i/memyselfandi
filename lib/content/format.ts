import type { Project } from "./types";

const WORDS_PER_MINUTE = 200;

export function readingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min`;
}

/** "2025-03-01" → "March 2025", matching how dates were written before. */
export function formatPostDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function projectLink(project: Project): { href: string; external: boolean } {
  const external = project.repoUrl || project.liveUrl;
  return external ? { href: external, external: true } : { href: `/projects/${project.slug}`, external: false };
}
