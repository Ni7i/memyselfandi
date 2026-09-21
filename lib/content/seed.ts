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
    excerpt: "After building several game prototypes in Unity, I stripped everything back...",
    content: `After building several game prototypes in Unity, I found myself fighting the engine more than building actual game logic. Too much magic. Too many abstractions I didn't understand.\n\nSo I stripped everything back. No engine. Just C#, a window, and a game loop.\n\n**What I learned changes how you write code**\n\nThe first realization: you don't need a physics engine for most games. A simple AABB collision check handles 90% of 2D game physics. The moment I wrote that myself, I finally understood it.\n\nThe second: **state machines are everything**. Player states, enemy AI, menu transitions: all state machines. Once I had a clean FSM implementation, complex game behavior became trivial.\n\nThe third: your game loop IS your engine. Fixed timestep, delta time, input polling. Get that right and everything else is just logic on top.\n\n**Should you try it?**\n\nYes. If you're learning game dev, build one game without an engine first. You'll learn more in two weeks than in months of Unity tutorials.`,
    tags: ["C#", "Game Dev", "Architecture"],
    published: true,
    updatedAt: null,
  },
  {
    slug: "wpf-modern-ui",
    title: "Making WPF not look like Windows XP",
    publishedAt: "2025-01-01",
    excerpt: "WPF has a reputation for ugly UIs. Here's how I make mine look modern...",
    content: `WPF has a reputation for ugly, dated UIs. Most WPF apps still look like they're from 2008. Here's how I make mine look modern.\n\n**Custom control templates, all of them**\n\nEvery default control (buttons, sliders, scrollbars) gets a complete template override. Yes, it's verbose. Yes, it's absolutely worth it. The default templates are the main reason WPF looks old.\n\n**No system colors**\n\nDefine your own color palette in ResourceDictionary. I use two background shades and one accent color. That's it. Don't touch SystemColors.\n\n**Smooth animations on everything**\n\nWPF's Storyboard system is genuinely powerful when used right. Every hover, transition, and loading state gets animated. This alone makes an app feel 10x more polished.\n\n**Load a modern font**\n\nInter, JetBrains Mono, or any modern font via FontFamily. The default Segoe UI is fine but a custom font immediately signals this isn't a default WPF app.\n\nThe result: apps people genuinely don't believe are built with WPF.`,
    tags: ["C#", "WPF", "UI Design"],
    published: true,
    updatedAt: null,
  },
];
