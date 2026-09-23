import type { BlogPost, Project } from "./types";

// Default content, used until Redis is connected and written to once on the
// first admin change. The published projects are exactly what the homepage
// showed before the admin existed; the drafts come from the older lib/data.ts.

function project(fields: Partial<Project> & Pick<Project, "slug" | "title" | "description" | "order">): Project {
  return {
    longDescription: "",
    stack: [],
    repoUrl: "",
    liveUrl: "",
    year: "",
    featured: false,
    published: true,
    updatedAt: null,
    ...fields,
  };
}

export const seedProjects: Project[] = [
  project({
    slug: "screentime-blocker",
    title: "screentime-blocker",
    description: "A macOS menu-bar app that blocks distracting websites and apps behind a personal code.",
    stack: ["Python", "macOS", "SHA-256"],
    repoUrl: "https://github.com/Ni7i/screentime-blocker",
    featured: true,
    order: 1,
  }),
  project({
    slug: "memyselfandi",
    title: "memyselfandi",
    description: "This portfolio: designed, built and maintained by me.",
    stack: ["Next.js", "TypeScript", "React"],
    repoUrl: "https://github.com/Ni7i/memyselfandi",
    featured: true,
    order: 2,
  }),
  project({
    slug: "quizlot",
    title: "Quizlot",
    description: "A focused quiz and flashcard app for creating and reviewing study material.",
    stack: ["React", "Vite", "JavaScript"],
    repoUrl: "https://github.com/Ni7i/Quizlot",
    featured: true,
    order: 3,
  }),
  project({
    slug: "notevault",
    title: "NoteVault",
    description: "A lightweight REST API for notes, tags and search.",
    stack: [".NET 8", "C#", "Swagger"],
    repoUrl: "https://github.com/Ni7i/NoteVault",
    order: 4,
  }),
  project({
    slug: "twinn",
    title: "Twinn",
    description: "A matching app built around finding the right two people.",
    stack: ["C#", "Blazor"],
    repoUrl: "https://github.com/Ni7i/twinn",
    order: 5,
  }),
  project({
    slug: "midnight-calculator",
    title: "midnight-calculator",
    description: "A purpose-built calculator for a local small business.",
    stack: ["JavaScript"],
    repoUrl: "https://github.com/Ni7i/midnight-calculator",
    order: 6,
  }),
  project({
    slug: "lockbox",
    title: "LockBox",
    description: "A local terminal password manager with an encrypted vault and secure password generation.",
    stack: ["C#", ".NET 8", "AES-256"],
    repoUrl: "https://github.com/Ni7i/LockBox",
    order: 7,
  }),
  project({
    slug: "oase-jugendraum",
    title: "Oase Jugendraum",
    description: "A web application created for a local youth room.",
    stack: ["Python", "Web app"],
    repoUrl: "https://github.com/Ni7i/OaseJugendraum",
    order: 8,
  }),
  project({
    slug: "whiteplayer",
    title: "WhitePlayer",
    description: "Minimal music player with clean WPF UI and smooth animations.",
    longDescription: `WhitePlayer is a minimal music player I built because I was tired of bloated media players. Built entirely in C# and WPF, it focuses on clean design and smooth performance.\n\nThe key challenge was building a custom audio pipeline that handles different formats while keeping the UI perfectly synchronized. I implemented a custom seek bar, album art detection, and a full playlist system, all from scratch.\n\nThe UI is completely template-overridden. No default WPF controls. Everything has custom animations.`,
    stack: ["C#", ".NET", "WPF", "Audio API"],
    repoUrl: "https://github.com/Ni7i",
    year: "2024",
    published: false,
    order: 9,
  }),
  project({
    slug: "portfolio",
    title: "Portfolio",
    description: "This portfolio: built from scratch with Next.js & Tailwind.",
    longDescription: `You're looking at it.\n\nBuilt with Next.js and Tailwind CSS. The bento grid layout was inspired by productivity dashboards. I wanted something that felt like a personal space, not a resume template.\n\nEverything is handcrafted: the loading screen, the grid, the interactive Leaflet map with photo markers, the contact form. No page builders, no templates.`,
    stack: ["Next.js", "TypeScript", "Tailwind", "Leaflet"],
    repoUrl: "https://github.com/Ni7i/memyselfandi",
    liveUrl: "https://enisshorra.ch",
    year: "2025",
    published: false,
    order: 10,
  }),
  project({
    slug: "game-logic-engine",
    title: "Game Logic Engine",
    description: "Reusable game logic: state machines, event bus & ECS.",
    longDescription: `A reusable game logic framework I built to stop rewriting the same patterns across every game project.\n\nFeatures: a finite state machine system, a global event bus for decoupled communication, and a lightweight Entity-Component-System (ECS) architecture. Heavily influenced by studying design patterns.\n\nThis was my first serious deep-dive into software architecture, and it changed how I think about code structure entirely.`,
    stack: ["C#", "OOP", "ECS", "Design Patterns"],
    repoUrl: "https://github.com/Ni7i",
    year: "2024",
    published: false,
    order: 11,
  }),
];

export const seedBlogPosts: BlogPost[] = [
  {
    slug: "unity-to-csharp",
    title: "Why I ditched Unity for pure C#",
    publishedAt: "2025-03-01",
    excerpt: "A year of Unity prototypes, and most of my time went into the inspector instead of the game. So I dropped the engine and started with a window and a loop.",
    content: `I spent about a year building small games in Unity. Nothing ever shipped, mostly prototypes that died after two weekends. At some point I noticed where my time actually went: clicking through the inspector, looking for the one checkbox a forum post swore by. Not writing game logic.\n\nSo I tried the opposite. No engine. A window, a game loop, and C#.\n\n**Most of what I copied from tutorials, I never needed**\n\nMy 2D prototypes never needed a physics engine. Two rectangles, check if they overlap, done. I wrote that check myself in about twenty lines, and for the first time I understood what happens when two things collide, instead of trusting a component I had dragged onto an object.\n\n**State machines fixed my worst code**\n\nPlayer states, enemy behaviour, menu screens. Before, I had bool flags everywhere and no idea which combinations were even possible. After I wrote one small state machine class, adding a dash or a pause screen took an evening instead of a weekend.\n\n**The loop is the engine**\n\nFixed timestep, delta time, read the input once per frame. That is it. Everything on top was my own code, so when something broke I knew where to look.\n\nWould I build a big 3D game this way? No. But if you are learning, write one small game without an engine first. I got more out of two weeks of that than out of **months** of tutorials.`,
    tags: ["C#", "Game Dev", "Architecture"],
    published: true,
    updatedAt: null,
  },
  {
    slug: "wpf-modern-ui",
    title: "Making WPF not look like Windows XP",
    publishedAt: "2025-01-01",
    excerpt: "People rarely believe my apps are built with WPF. The defaults are from 2008, so these are the four things I change in every project.",
    content: `When I show someone an app I built with WPF, the first reaction is usually that it does not look like WPF. That says more about the defaults than about my design skills. They are from 2008 and nobody refreshed them since.\n\nFour things do most of the work for me.\n\n**Replace the control templates**\n\nButtons, sliders, scrollbars: I override the template of every control I use. It is a lot of XAML and I carry most of it from project to project, but it is the **single biggest reason** an app stops looking old.\n\n**Leave SystemColors alone**\n\nI define my own palette in a ResourceDictionary. Two background shades, one accent colour, nothing else. As soon as system colours creep back in, the window looks like the control panel again.\n\n**Animate the small stuff**\n\nHover states, view transitions, the loading indicator. Storyboards are old but they still work, and a 150 ms fade is the difference between a prototype and something I would hand to someone.\n\n**Ship a font**\n\nSegoe UI is fine. It is also what every other Windows app uses. I bundle Inter or JetBrains Mono and set it once, at the top level.\n\nNone of this is clever. It is just work the framework does not do for you.`,
    tags: ["C#", "WPF", "UI Design"],
    published: true,
    updatedAt: null,
  },
];
