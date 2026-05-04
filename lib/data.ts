export const personal = {
  name: "Enis",
  surname: "Shorra",
  role: "C# · .NET · UI Developer",
  age: 17,
  location: "Germany",
  email: "shorra.enis@hotmail.com",
  github: "https://github.com/Ni7i",
  linkedin: "https://linkedin.com/in/enis-shorra",
  discord: "enis.shorra",
  bio: "17-year-old CS student building things with C# and .NET. Strong OOP mindset, love for clean UI design.",
  currently: "Building a game logic engine in C#",
  status: "available" as "available" | "busy",
};

export const tech = ["C#", ".NET", "WPF", "TypeScript", "React", "Next.js", "Git", "SQL", "Figma"];

export const projects = [
  {
    id: "whiteplayer",
    title: "WhitePlayer",
    period: "2024 – now",
    desc: "Minimal music player with clean WPF UI and smooth animations.",
    longDesc: `WhitePlayer is a minimal music player I built because I was tired of bloated media players. Built entirely in C# and WPF, it focuses on clean design and smooth performance.\n\nThe key challenge was building a custom audio pipeline that handles different formats while keeping the UI perfectly synchronized. I implemented a custom seek bar, album art detection, and a full playlist system — from scratch.\n\nThe UI is completely template-overridden. No default WPF controls. Everything has custom animations.`,
    tags: ["C#", ".NET", "WPF", "Audio API"],
    github: "https://github.com/Ni7i",
    live: "",
    year: "2024",
    color: "#6366f1",
  },
  {
    id: "portfolio",
    title: "Portfolio",
    period: "2025",
    desc: "This portfolio — built from scratch with Next.js & Tailwind.",
    longDesc: `You're looking at it.\n\nBuilt with Next.js and Tailwind CSS. The bento grid layout was inspired by productivity dashboards — I wanted something that felt like a personal space, not a resume template.\n\nEverything is handcrafted: the loading screen, the grid, the interactive map with photo markers, the message board. No page builders, no templates.`,
    tags: ["Next.js", "TypeScript", "Tailwind", "Leaflet"],
    github: "https://github.com/Ni7i/memyselfandi",
    live: "https://memyselfandi-two.vercel.app",
    year: "2025",
    color: "#a78bfa",
  },
  {
    id: "game-logic-engine",
    title: "Game Logic Engine",
    period: "2024",
    desc: "Reusable game logic: state machines, event bus & ECS.",
    longDesc: `A reusable game logic framework I built to stop rewriting the same patterns across every game project.\n\nFeatures: a finite state machine system, a global event bus for decoupled communication, and a lightweight Entity-Component-System (ECS) architecture. Heavily influenced by studying design patterns.\n\nThis was my first serious deep-dive into software architecture — and it changed how I think about code structure entirely.`,
    tags: ["C#", "OOP", "ECS", "Design Patterns"],
    github: "https://github.com/Ni7i",
    live: "",
    year: "2024",
    color: "#f472b6",
  },
];

export const blogPosts = [
  {
    id: "unity-to-csharp",
    title: "Why I ditched Unity for pure C#",
    date: "March 2025",
    excerpt: "After building several game prototypes in Unity, I stripped everything back and wrote my own game loop...",
    content: `After building several game prototypes in Unity, I found myself fighting the engine more than building actual game logic. Too much magic. Too many abstractions I didn't understand.\n\nSo I stripped everything back. No engine. Just C#, a window, and a game loop.\n\n**What I learned changes how you write code**\n\nThe first realization: you don't need a physics engine for most games. A simple AABB collision check handles 90% of 2D game physics. The moment I wrote that myself, I finally understood it.\n\nThe second: state machines are everything. Player states, enemy AI, menu transitions — all state machines. Once I had a clean FSM implementation, complex game behavior became trivial.\n\nThe third: your game loop IS your engine. Fixed timestep, delta time, input polling — get that right and everything else is just logic on top.\n\n**Should you try it?**\n\nYes. If you're learning game dev, build one game without an engine first. You'll learn more in two weeks than in months of Unity tutorials.`,
    tags: ["C#", "Game Dev", "Architecture"],
    readTime: "4 min",
  },
  {
    id: "wpf-modern-ui",
    title: "Making WPF not look like Windows XP",
    date: "January 2025",
    excerpt: "WPF has a reputation for ugly UIs. Here's how I make mine look modern and smooth...",
    content: `WPF has a reputation for ugly, dated UIs. Most WPF apps still look like they're from 2008. Here's how I make mine look modern.\n\n**Custom control templates — all of them**\n\nEvery default control — buttons, sliders, scrollbars — gets a complete template override. Yes, it's verbose. Yes, it's absolutely worth it. The default templates are the main reason WPF looks old.\n\n**No system colors**\n\nDefine your own color palette in ResourceDictionary. I use two background shades and one accent color. That's it. Don't touch SystemColors.\n\n**Smooth animations on everything**\n\nWPF's Storyboard system is genuinely powerful when used right. Every hover, transition, and loading state gets animated. This alone makes an app feel 10× more polished.\n\n**Load a modern font**\n\nInter, JetBrains Mono, or any modern font via FontFamily. The default Segoe UI is fine but a custom font immediately signals this isn't a default WPF app.\n\nThe result: apps people genuinely don't believe are built with WPF.`,
    tags: ["C#", "WPF", "UI Design"],
    readTime: "3 min",
  },
];

export interface GalleryPhoto {
  id: string;
  src: string;
  thumb: string;
  title: string;
  location: string;
  lat: number;
  lng: number;
  date: string;
}

export const galleryPhotos: GalleryPhoto[] = [
  {
    id: "schwarzwald",
    src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=200&h=140&fit=crop",
    title: "Schwarzwald",
    location: "Black Forest, Germany",
    lat: 47.9,
    lng: 8.1,
    date: "Oct 2024",
  },
  {
    id: "zugspitze",
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=140&fit=crop",
    title: "Zugspitze",
    location: "Bayern, Germany",
    lat: 47.42,
    lng: 10.98,
    date: "Aug 2024",
  },
  {
    id: "koenigssee",
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=140&fit=crop",
    title: "Königssee",
    location: "Berchtesgaden, Germany",
    lat: 47.55,
    lng: 12.99,
    date: "Jul 2024",
  },
  {
    id: "bavarian-forest",
    src: "https://images.unsplash.com/photo-1542202229-7d93c33f5d07?w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1542202229-7d93c33f5d07?w=200&h=140&fit=crop",
    title: "Bayerischer Wald",
    location: "Bavaria, Germany",
    lat: 49.07,
    lng: 13.36,
    date: "Sep 2024",
  },
  {
    id: "rhein",
    src: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=200&h=140&fit=crop",
    title: "Rhine Valley",
    location: "Rhineland, Germany",
    lat: 50.07,
    lng: 7.67,
    date: "Jun 2024",
  },
  {
    id: "bodensee",
    src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=200&h=140&fit=crop",
    title: "Bodensee",
    location: "Lake Constance, Germany",
    lat: 47.66,
    lng: 9.17,
    date: "May 2024",
  },
];

export const links = [
  { label: "GitHub", url: "https://github.com/Ni7i" },
  { label: "LinkedIn", url: "https://linkedin.com/in/enis-shorra" },
  { label: "Discord", url: "#" },
  { label: "Email", url: "mailto:shorra.enis@hotmail.com" },
  { label: "Portfolio Repo", url: "https://github.com/Ni7i/memyselfandi" },
];
