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
  it("tells the illustrated autobiography in eleven scenes", async () => {
    const html = renderToStaticMarkup(await Home());
    expect(html).toContain('<h1 id="overture-title" class="ov-title">Enis Shorra</h1>');
    for (const art of ["scene-bench", "scene-desk", "scene-friends", "scene-school", "scene-hack", "scene-end"]) {
      expect(html).toContain(`data-ink="${art}"`);
      expect(html).toContain(`src="/art/${art}.svg?v=`);
    }
    const ids = ["top", "age-three", "curiosity", "school", "ims", "stations", "first-game", "work", "proof", "life", "how", "facts", "contact"];
    const positions = ids.map((id) => html.indexOf(` id="${id}"`));
    expect(positions.every((at) => at > 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    // One thread: the overture draws it by scroll and the desk scene picks it up as the mouse cable
    expect(html).toContain('class="ov-thread"');
    // every illustrated scene picks the thread up at the top and lets it go at the bottom
    expect(html.match(/class="thread-run"[^>]*data-exit=""/g)).toHaveLength(4);
    expect(html).toContain("The red thread goes on.");
  });

  it("lists the projects strongest first and keeps private code private", async () => {
    const html = renderToStaticMarkup(await Home());
    const work = html.slice(html.indexOf('id="work"'), html.indexOf('id="proof"'));

    expect(work).toContain("9 in all");
    // Private repositories link to their own page, which says the code is available on request
    expect(work).toContain('<a href="/projects/notevault">NoteVault');
    expect(work).toContain('<a href="/projects/lockbox">LockBox');
    expect(work.match(/Private repository, code available on request/g)).toHaveLength(2);
    expect(html).not.toContain("github.com/Ni7i/NoteVault");
    expect(html).not.toContain("github.com/Ni7i/LockBox");
    const titles = ["NoteVault", "LockBox", "memyselfandi", "Quizlot", "websiten.ch", "Oase Jugendraum", "screentime-blocker", "midnight-calculator", "Twinn"];
    const order = titles.map((title) => work.indexOf(`>${title}`));
    expect(order.every((at) => at > 0)).toBe(true);
    expect([...order].sort((a, b) => a - b)).toEqual(order);
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

  it("states the competitions and dates as the CV does", async () => {
    const html = renderToStaticMarkup(await Home());
    expect(html).toContain("took part in 2025, top 10 in 2026.");
    expect(html).not.toMatch(/top 10 in 2025/i);
    expect(html).toContain("Aug 2027 to Jul 2028");
    expect(html).toContain("Concept, story and creative direction by me. Built with Claude as a coding partner.");
    // The LCR loop is quoted from the repository as it stands
    expect(html).toContain("<b>while</b> (MehrAlsEinSpielerHatChips())");
  });
});

describe("navigation", () => {
  it("offers the chapters, a fast lane to the facts and the blog", async () => {
    const html = renderToStaticMarkup(await Home());
    expect(html).toContain('<a class="skip-link" href="#facts">Skip to the facts</a>');
    expect(html).toContain('aria-controls="index-menu"');
    for (const id of ["age-three", "work", "facts", "contact"]) expect(html).toContain(`href="#${id}"`);
    expect(html.match(/<a href="\/blog">Blog<\/a>/g)).toHaveLength(1);
  });

  it("points section links back to the homepage from other pages", async () => {
    const html = renderToStaticMarkup(await BlogIndex());
    expect(html).toContain('<a href="/#facts">About</a>');
    expect(html).toContain('<a class="nav-cta" href="/#contact">Get in touch</a>');
  });
});

describe("blog index", () => {
  it("lists the published posts, newest first", async () => {
    const html = renderToStaticMarkup(await BlogIndex());
    expect(html).toContain('id="posts"');
    expect(html).toContain('<span class="idx-count">1 post</span>');
    expect(html).toContain('href="/blog/wpf-modern-ui"');
    // The Unity story is not accurate and stays unpublished
    expect(html).not.toContain("Unity");
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
    const html = renderToStaticMarkup(await BlogPostPage(params("wpf-modern-ui")));
    expect(html).toContain('<h1 class="article-title">Making WPF not look like Windows XP</h1>');
    expect(html).toContain("January 2025");
    expect(html).toContain("<h2>Replace the control templates</h2>");
    expect(html).toContain("<strong>single biggest reason</strong>");
    await expect(BlogPostPage(params("unity-to-csharp"))).rejects.toThrow();
  });

  it("renders a published project and hides drafts", async () => {
    expect(renderToStaticMarkup(await ProjectPage(params("notevault")))).toContain("Code available on request.");
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
    expect(urls).toContain("https://enisshorra.ch/blog/wpf-modern-ui");
    expect(urls).not.toContain("https://enisshorra.ch/blog/unity-to-csharp");
    expect(urls.some((url) => url.includes("/admin") || url.includes("whiteplayer"))).toBe(false);
    expect(JSON.stringify([robotsTxt, urls])).not.toMatch(/hpgarage/i);
  });
});
