import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import BlogIndex from "@/app/blog/page";
import BlogPostPage from "@/app/blog/[slug]/page";
import Home from "@/app/page";
import ProjectPage from "@/app/projects/[slug]/page";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { projectStore } from "@/lib/content/projects";
import { configureKv, params, unconfigureKv } from "../helpers/auth";
import { memoryState } from "../helpers/memory-kv";

beforeEach(() => {
  memoryState.reset();
  unconfigureKv();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("homepage", () => {
  it("renders the same project archive as before the admin existed", async () => {
    const html = renderToStaticMarkup(await Home());

    expect(html).toContain('<span class="idx-count">8 projects</span>');
    expect(html).toContain(
      '<a class="archive-row" href="https://github.com/Ni7i/screentime-blocker" rel="noreferrer" target="_blank"><span class="archive-number">01</span><h3>screentime-blocker</h3><p>A macOS menu-bar app that blocks distracting websites and apps behind a personal code.</p><span class="archive-stack">Python · macOS · SHA-256</span>',
    );
    expect(html).toContain(
      '<a class="archive-row" href="https://github.com/Ni7i/LockBox" rel="noreferrer" target="_blank"><h3>LockBox</h3>',
    );
    const titles = [...html.matchAll(/<h3>([^<]+)<\/h3>/g)].map((match) => match[1]).slice(0, 8);
    expect(titles).toEqual(["screentime-blocker", "memyselfandi", "Quizlot", "NoteVault", "Twinn", "midnight-calculator", "LockBox", "Oase Jugendraum"]);
    expect(html).not.toContain("WhitePlayer");
  });

  it("shows admin changes", async () => {
    configureKv();
    const quizlot = (await projectStore.get("quizlot", "admin"))!;
    await projectStore.update("quizlot", { ...quizlot, title: "Quizlot Pro", featured: false });

    const html = renderToStaticMarkup(await Home());
    expect(html).toContain("<h3>Quizlot Pro</h3>");
    expect(html.indexOf("Quizlot Pro")).toBeGreaterThan(html.indexOf("More work"));
  });
});

describe("navigation", () => {
  it("links the blog from the header and footer", async () => {
    const html = renderToStaticMarkup(await Home());
    expect(html.match(/<a href="\/blog">Blog<\/a>/g)).toHaveLength(2);
    expect(html).toContain('<a href="#about">About</a>');
  });

  it("points section links back to the homepage from other pages", async () => {
    const html = renderToStaticMarkup(await BlogIndex());
    expect(html).toContain('<a href="/#about">About</a>');
    expect(html).toContain('<a class="nav-cta" href="/#contact">Get in touch</a>');
  });
});

describe("blog index", () => {
  it("lists the published posts, newest first", async () => {
    const html = renderToStaticMarkup(await BlogIndex());
    expect(html).toContain('id="posts"');
    expect(html).toContain('<span class="idx-count">2 posts</span>');
    expect(html.indexOf("Why I ditched Unity")).toBeLessThan(html.indexOf("Making WPF not look like Windows XP"));
    expect(html).toContain('href="/blog/unity-to-csharp"');
  });

  it("hides drafts and handles an empty blog", async () => {
    configureKv();
    const { postStore } = await import("@/lib/content/posts");
    const post = (await postStore.get("wpf-modern-ui", "admin"))!;
    await postStore.update(post.slug, { ...post, published: false });
    expect(renderToStaticMarkup(await BlogIndex())).not.toContain("Making WPF");

    await postStore.remove("wpf-modern-ui");
    await postStore.remove("unity-to-csharp");
    expect(renderToStaticMarkup(await BlogIndex())).toContain("No posts yet");
  });
});

describe("detail pages", () => {
  it("renders a published blog post with its date as before", async () => {
    const html = renderToStaticMarkup(await BlogPostPage(params("unity-to-csharp")));
    expect(html).toContain('<h1 class="article-title">Why I ditched Unity for pure C#</h1>');
    expect(html).toContain("March 2025");
    expect(html).toContain("<h2>Most of what I copied from tutorials, I never needed</h2>");
    expect(html).toContain("<strong>months</strong>");
    expect(html).toContain("More posts");
  });

  it("renders a published project and hides drafts", async () => {
    expect(renderToStaticMarkup(await ProjectPage(params("notevault")))).toContain("A lightweight REST API for notes, tags and search.");
    await expect(ProjectPage(params("whiteplayer"))).rejects.toThrow();
  });
});

describe("robots and sitemap", () => {
  it("only reference enisshorra.ch and keep the admin out of search engines", async () => {
    const robotsTxt = robots();
    expect(robotsTxt.sitemap).toBe("https://enisshorra.ch/sitemap.xml");
    expect(robotsTxt.rules).toMatchObject({ disallow: ["/admin", "/api/"] });

    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls[0]).toBe("https://enisshorra.ch");
    expect(urls[1]).toBe("https://enisshorra.ch/blog");
    expect(urls.every((url) => url.startsWith("https://enisshorra.ch"))).toBe(true);
    expect(urls).toContain("https://enisshorra.ch/blog/unity-to-csharp");
    expect(urls.some((url) => url.includes("/admin") || url.includes("whiteplayer"))).toBe(false);
    expect(JSON.stringify([robotsTxt, urls])).not.toMatch(/hpgarage/i);
  });
});
