import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StorageUnavailableError } from "@/lib/content/collection";
import { getPublishedPost, getPublishedPosts, postStore } from "@/lib/content/posts";
import { getPublishedProject, getPublishedProjects, projectStore } from "@/lib/content/projects";
import { seedProjects } from "@/lib/content/seed";
import type { ProjectInput } from "@/lib/content/types";
import { configureKv, unconfigureKv } from "../helpers/auth";
import { memoryState } from "../helpers/memory-kv";

const HOMEPAGE_ORDER = [
  "screentime-blocker",
  "memyselfandi",
  "quizlot",
  "notevault",
  "twinn",
  "midnight-calculator",
  "lockbox",
  "oase-jugendraum",
];

const extraProject: ProjectInput = { ...seedProjects[0], slug: "extra", title: "Extra", order: 20 };

beforeEach(() => {
  memoryState.reset();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("without Redis", () => {
  beforeEach(() => unconfigureKv());

  it("serves the default content in homepage order", async () => {
    expect((await getPublishedProjects()).map((project) => project.slug)).toEqual(HOMEPAGE_ORDER);
    expect((await getPublishedPosts()).map((post) => post.slug)).toEqual(["unity-to-csharp", "wpf-modern-ui"]);
  });

  it("keeps drafts off the public site", async () => {
    expect(await getPublishedProject("whiteplayer")).toBeNull();
    expect(await projectStore.get("whiteplayer", "admin")).not.toBeNull();
  });

  it("refuses writes", async () => {
    await expect(projectStore.create(extraProject)).rejects.toBeInstanceOf(StorageUnavailableError);
  });
});

describe("with Redis", () => {
  beforeEach(() => configureKv());

  it("serves the default content until the first write", async () => {
    expect((await getPublishedProjects()).map((project) => project.slug)).toEqual(HOMEPAGE_ORDER);
    expect(memoryState.hash("content:projects")).toBeUndefined();
  });

  it("copies the default content on the first write, so nothing disappears", async () => {
    await projectStore.create(extraProject);
    expect(memoryState.string("content:projects:seeded")).toEqual(expect.any(String));
    expect((await projectStore.list("admin")).map((project) => project.slug)).toEqual([...seedProjects.map((project) => project.slug), "extra"]);
  });

  it("does not bring deleted default content back", async () => {
    for (const post of await postStore.list("admin")) await postStore.remove(post.slug);
    expect(await getPublishedPosts()).toEqual([]);
    expect(await getPublishedPost("unity-to-csharp")).toBeNull();
  });

  it("never renders a hand-edited record that fails validation", async () => {
    await projectStore.create(extraProject);
    memoryState.rawHashSet("content:projects", "evil", { ...extraProject, slug: "evil", repoUrl: "javascript:alert(document.cookie)" });
    expect((await getPublishedProjects()).map((project) => project.slug)).not.toContain("evil");
  });

  it("falls back to the default content for visitors when Redis is down, but tells the admin", async () => {
    await projectStore.create(extraProject);
    memoryState.fail();
    expect((await getPublishedProjects()).map((project) => project.slug)).toEqual(HOMEPAGE_ORDER);
    await expect(projectStore.list("admin")).rejects.toBeInstanceOf(StorageUnavailableError);
    expect(await projectStore.status()).toEqual({ connected: true, reachable: false, seeded: false });
  });
});
