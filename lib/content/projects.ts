import "server-only";
import { createCollection } from "./collection";
import { seedProjects } from "./seed";
import type { Project } from "./types";
import { parseStoredProject } from "./validation";

export const projectStore = createCollection<Project>({
  key: "content:projects",
  seed: () => seedProjects,
  parse: parseStoredProject,
  compare: (a, b) => a.order - b.order || a.title.localeCompare(b.title),
});

export async function getPublishedProjects(): Promise<Project[]> {
  return (await projectStore.list("public")).filter((project) => project.published);
}

export async function getPublishedProject(slug: string): Promise<Project | null> {
  const project = await projectStore.get(slug, "public");
  return project?.published ? project : null;
}
