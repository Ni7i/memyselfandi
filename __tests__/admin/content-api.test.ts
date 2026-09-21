import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as postItem from "@/app/api/admin/posts/[slug]/route";
import * as posts from "@/app/api/admin/posts/route";
import * as projectItem from "@/app/api/admin/projects/[slug]/route";
import * as projects from "@/app/api/admin/projects/route";
import { getPublishedProjects } from "@/lib/content/projects";
import { adminCookie, apiRequest, configureAuth, configureKv, params, unconfigureKv } from "../helpers/auth";
import { memoryState } from "../helpers/memory-kv";

const newProject = {
  slug: "studylock",
  title: "StudyLock",
  description: "Keeps study sessions free of distractions.",
  longDescription: "",
  stack: ["Swift", "iOS"],
  repoUrl: "https://github.com/Ni7i/StudyLock",
  liveUrl: "",
  year: "2026",
  featured: false,
  published: true,
  order: 12,
};

const newPost = {
  slug: "building-an-admin",
  title: "Building a secure admin",
  excerpt: "Server-side sessions instead of a password in the browser.",
  content: "First paragraph.\n\n**Heading**\n\nSecond paragraph.",
  tags: ["Security", "Next.js"],
  publishedAt: "2026-09-21",
  published: false,
};

beforeEach(async () => {
  memoryState.reset();
  configureKv();
  await configureAuth();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("unauthenticated writes are rejected", () => {
  it.each([
    ["POST /projects", () => projects.POST(apiRequest("/api/admin/projects", { method: "POST", body: newProject }))],
    ["PUT /projects/quizlot", () => projectItem.PUT(apiRequest("/api/admin/projects/quizlot", { method: "PUT", body: newProject }), params("quizlot"))],
    ["DELETE /projects/quizlot", () => projectItem.DELETE(apiRequest("/api/admin/projects/quizlot", { method: "DELETE" }), params("quizlot"))],
    ["POST /posts", () => posts.POST(apiRequest("/api/admin/posts", { method: "POST", body: newPost }))],
    ["PUT /posts/unity-to-csharp", () => postItem.PUT(apiRequest("/api/admin/posts/unity-to-csharp", { method: "PUT", body: newPost }), params("unity-to-csharp"))],
    ["DELETE /posts/unity-to-csharp", () => postItem.DELETE(apiRequest("/api/admin/posts/unity-to-csharp", { method: "DELETE" }), params("unity-to-csharp"))],
  ])("%s → 401 and nothing is stored", async (_name, call) => {
    const response = await call();
    expect(response.status).toBe(401);
    expect(memoryState.hash("content:projects")).toBeUndefined();
    expect(memoryState.hash("content:posts")).toBeUndefined();
  });

  it("rejects a forged cookie", async () => {
    const response = await projects.POST(
      apiRequest("/api/admin/projects", { method: "POST", body: newProject, cookie: "admin_session=eyJ2IjoxLCJpYXQiOjAsImV4cCI6OTk5OTk5OTk5OX0.AAAA" }),
    );
    expect(response.status).toBe(401);
  });

  it("rejects reads without a session", async () => {
    expect((await projects.GET(apiRequest("/api/admin/projects"))).status).toBe(401);
    expect((await postItem.GET(apiRequest("/api/admin/posts/unity-to-csharp"), params("unity-to-csharp"))).status).toBe(401);
  });

  it("rejects a valid session used from another site", async () => {
    const response = await projects.POST(
      apiRequest("/api/admin/projects", { method: "POST", body: newProject, cookie: adminCookie(), origin: "https://evil.example" }),
    );
    expect(response.status).toBe(403);
    expect(memoryState.hash("content:projects")).toBeUndefined();
  });
});

describe("projects API with a session", () => {
  it("lists every project including drafts", async () => {
    const response = await projects.GET(apiRequest("/api/admin/projects", { cookie: adminCookie() }));
    const { items } = await response.json();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(items).toHaveLength(11);
    expect(items.filter((item: { published: boolean }) => !item.published).map((item: { slug: string }) => item.slug)).toEqual([
      "whiteplayer",
      "portfolio",
      "game-logic-engine",
    ]);
  });

  it("creates a project, keeps the existing ones and shows it on the site", async () => {
    const response = await projects.POST(
      apiRequest("/api/admin/projects", { method: "POST", body: newProject, cookie: adminCookie(), origin: "http://localhost" }),
    );

    expect(response.status).toBe(201);
    expect(response.headers.get("location")).toBe("/api/admin/projects/studylock");
    const { item } = await response.json();
    expect(item.updatedAt).toEqual(expect.any(String));

    const published = await getPublishedProjects();
    expect(published.map((project) => project.slug)).toContain("studylock");
    expect(published).toHaveLength(9);
  });

  it("returns field errors for invalid input", async () => {
    const response = await projects.POST(
      apiRequest("/api/admin/projects", {
        method: "POST",
        cookie: adminCookie(),
        body: { ...newProject, slug: "Not A Slug", title: "", repoUrl: "javascript:alert(1)", order: -1 },
      }),
    );

    expect(response.status).toBe(400);
    const { fields } = await response.json();
    expect(Object.keys(fields).sort()).toEqual(["order", "repoUrl", "slug", "title"]);
    expect(memoryState.hash("content:projects")).toBeUndefined();
  });

  it("rejects the reserved slug and malformed bodies", async () => {
    const reserved = await projects.POST(apiRequest("/api/admin/projects", { method: "POST", cookie: adminCookie(), body: { ...newProject, slug: "new" } }));
    expect(reserved.status).toBe(400);

    const broken = await projects.POST(apiRequest("/api/admin/projects", { method: "POST", cookie: adminCookie(), body: "{oops" }));
    expect(broken.status).toBe(400);

    const huge = await projects.POST(
      apiRequest("/api/admin/projects", { method: "POST", cookie: adminCookie(), body: { ...newProject, longDescription: "x".repeat(200_000) } }),
    );
    expect(huge.status).toBe(413);
  });

  it("answers 409 for a slug that already exists", async () => {
    const response = await projects.POST(
      apiRequest("/api/admin/projects", { method: "POST", cookie: adminCookie(), body: { ...newProject, slug: "quizlot" } }),
    );
    expect(response.status).toBe(409);
  });

  it("updates a project in place", async () => {
    const response = await projectItem.PUT(
      apiRequest("/api/admin/projects/quizlot", { method: "PUT", cookie: adminCookie(), body: { ...newProject, slug: "quizlot", title: "Quizlot 2" } }),
      params("quizlot"),
    );

    expect(response.status).toBe(200);
    expect((await response.json()).item.title).toBe("Quizlot 2");
    expect((await getPublishedProjects()).find((project) => project.slug === "quizlot")?.title).toBe("Quizlot 2");
  });

  it("renames a slug, but never onto an existing one", async () => {
    const renamed = await projectItem.PUT(
      apiRequest("/api/admin/projects/twinn", { method: "PUT", cookie: adminCookie(), body: { ...newProject, slug: "twinn-app" } }),
      params("twinn"),
    );
    expect(renamed.status).toBe(200);
    const slugs = (await getPublishedProjects()).map((project) => project.slug);
    expect(slugs).toContain("twinn-app");
    expect(slugs).not.toContain("twinn");

    const clash = await projectItem.PUT(
      apiRequest("/api/admin/projects/twinn-app", { method: "PUT", cookie: adminCookie(), body: { ...newProject, slug: "quizlot" } }),
      params("twinn-app"),
    );
    expect(clash.status).toBe(409);
  });

  it("deletes a project and answers 404 afterwards", async () => {
    const first = await projectItem.DELETE(apiRequest("/api/admin/projects/lockbox", { method: "DELETE", cookie: adminCookie() }), params("lockbox"));
    expect(first.status).toBe(204);
    expect((await getPublishedProjects()).map((project) => project.slug)).not.toContain("lockbox");

    const second = await projectItem.DELETE(apiRequest("/api/admin/projects/lockbox", { method: "DELETE", cookie: adminCookie() }), params("lockbox"));
    expect(second.status).toBe(404);
    expect((await projectItem.GET(apiRequest("/api/admin/projects/lockbox", { cookie: adminCookie() }), params("lockbox"))).status).toBe(404);
  });

  it("answers 503 instead of pretending to save when no storage is connected", async () => {
    unconfigureKv();
    const response = await projects.POST(apiRequest("/api/admin/projects", { method: "POST", cookie: adminCookie(), body: newProject }));
    expect(response.status).toBe(503);
  });

  it("answers 503 when Redis is unreachable", async () => {
    memoryState.fail();
    const response = await projectItem.PUT(
      apiRequest("/api/admin/projects/quizlot", { method: "PUT", cookie: adminCookie(), body: { ...newProject, slug: "quizlot" } }),
      params("quizlot"),
    );
    expect(response.status).toBe(503);
    expect((await projects.GET(apiRequest("/api/admin/projects", { cookie: adminCookie() }))).status).toBe(503);
  });
});

describe("posts API with a session", () => {
  it("creates, reads, updates and deletes a post", async () => {
    const cookie = adminCookie();

    const created = await posts.POST(apiRequest("/api/admin/posts", { method: "POST", cookie, body: newPost }));
    expect(created.status).toBe(201);

    const read = await postItem.GET(apiRequest("/api/admin/posts/building-an-admin", { cookie }), params("building-an-admin"));
    expect((await read.json()).item.published).toBe(false);

    const updated = await postItem.PUT(
      apiRequest("/api/admin/posts/building-an-admin", { method: "PUT", cookie, body: { ...newPost, published: true } }),
      params("building-an-admin"),
    );
    expect((await updated.json()).item.published).toBe(true);

    const deleted = await postItem.DELETE(apiRequest("/api/admin/posts/building-an-admin", { method: "DELETE", cookie }), params("building-an-admin"));
    expect(deleted.status).toBe(204);

    const { items } = await (await posts.GET(apiRequest("/api/admin/posts", { cookie }))).json();
    expect(items.map((item: { slug: string }) => item.slug)).toEqual(["unity-to-csharp", "wpf-modern-ui"]);
  });

  it("validates the publishing date", async () => {
    const response = await posts.POST(apiRequest("/api/admin/posts", { method: "POST", cookie: adminCookie(), body: { ...newPost, publishedAt: "2026-02-30" } }));
    expect(response.status).toBe(400);
    expect((await response.json()).fields).toHaveProperty("publishedAt");
  });
});
