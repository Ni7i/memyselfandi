export const personal = {
  name: "Enis Shorra",
  role: "C# · .NET · UI Developer",
  age: 17,
  location: "Switzerland 🇨🇭",
  email: "shorra.enis@hotmail.com",
  github: "https://github.com/Ni7i",
  linkedin: "https://linkedin.com/in/enis-shorra",
  discord: "enis.shorra",
  bio: "Hey! I'm a 17-year-old CS student who loves building things with C# and .NET. Strong OOP mindset, obsessed with clean UI. Currently looking for an internship.",
  currently: "Stock Rendite — tracking portfolios with C#, .NET, Blazor",
  status: "available" as "available" | "busy",
  funfact: "I can touch-type at 110 WPM and I still look at the keyboard sometimes",
};

export const tech = ["C#", ".NET", "WPF", "TypeScript", "React", "Next.js", "Git", "SQL", "Figma"];

export const hobbies = [
  { icon: "💻", label: "Coding", note: "Every day" },
  { icon: "🚴", label: "Cycling", note: "Road & trails" },
  { icon: "🏋️", label: "Gym", note: "No days off" },
  { icon: "🎵", label: "Music", note: "Quran recitation" },
  { icon: "♟️", label: "Chess", note: "~1450 ELO" },
  { icon: "📚", label: "Reading", note: "Software arch books" },
  { icon: "🏠", label: "Familie", note: "Always" },
  { icon: "🎨", label: "UI Design", note: "Figma & WPF" },
];

export const certificates = [
  { title: "C# Fundamentals", issuer: "Microsoft Learn", date: "2024", color: "#7c5cbf" },
  { title: "Responsive Web Design", issuer: "freeCodeCamp", date: "2024", color: "#4a8c5c" },
  { title: "Git & GitHub Essentials", issuer: "Atlassian", date: "2023", color: "#c87847" },
  { title: "OOP with C#", issuer: "Udemy", date: "2024", color: "#c85b7d" },
  { title: "SQL Basics", issuer: "Khan Academy", date: "2023", color: "#5b8bc8" },
];

export const friends = [
  {
    name: "Luca",
    handle: "@luca_dev",
    what: "Building a Discord bot framework",
    url: "#",
    color: "#7c5cbf",
    emoji: "🤖",
  },
  {
    name: "Mia",
    handle: "@mia.design",
    what: "UI/UX designer — stunning Figma work",
    url: "#",
    color: "#c85b7d",
    emoji: "🎨",
  },
  {
    name: "Noah",
    handle: "@noahcodes",
    what: "Weather app with ML precipitation forecast",
    url: "#",
    color: "#4a8c5c",
    emoji: "⛅",
  },
  {
    name: "Sara",
    handle: "@sara_tech",
    what: "Built a study tracker that actually works",
    url: "#",
    color: "#c87847",
    emoji: "📚",
  },
  {
    name: "Felix",
    handle: "@flx_dev",
    what: "Homelab wizard, self-hosted everything",
    url: "#",
    color: "#5b8bc8",
    emoji: "🖥️",
  },
];

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
    color: "#7c5cbf",
    emoji: "🎵",
  },
  {
    id: "portfolio",
    title: "Portfolio",
    period: "2025",
    desc: "This portfolio — built from scratch with Next.js & Tailwind.",
    longDesc: `You're looking at it.\n\nBuilt with Next.js and Tailwind CSS. The bento grid layout was inspired by productivity dashboards — I wanted something that felt like a personal space, not a resume template.\n\nEverything is handcrafted: the loading screen, the grid, the interactive Leaflet map with photo markers, the contact form. No page builders, no templates.`,
    tags: ["Next.js", "TypeScript", "Tailwind", "Leaflet"],
    github: "https://github.com/Ni7i/memyselfandi",
    live: "https://enisshorra.ch",
    year: "2025",
    color: "#c85b7d",
    emoji: "🌐",
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
    color: "#4a8c5c",
    emoji: "⚙️",
  },
];

export const blogPosts = [
  {
    id: "unity-to-csharp",
    title: "Why I ditched Unity for pure C#",
    date: "March 2025",
    excerpt: "After building several game prototypes in Unity, I stripped everything back...",
    content: `After building several game prototypes in Unity, I found myself fighting the engine more than building actual game logic. Too much magic. Too many abstractions I didn't understand.\n\nSo I stripped everything back. No engine. Just C#, a window, and a game loop.\n\n**What I learned changes how you write code**\n\nThe first realization: you don't need a physics engine for most games. A simple AABB collision check handles 90% of 2D game physics. The moment I wrote that myself, I finally understood it.\n\nThe second: **state machines are everything**. Player states, enemy AI, menu transitions — all state machines. Once I had a clean FSM implementation, complex game behavior became trivial.\n\nThe third: your game loop IS your engine. Fixed timestep, delta time, input polling — get that right and everything else is just logic on top.\n\n**Should you try it?**\n\nYes. If you're learning game dev, build one game without an engine first. You'll learn more in two weeks than in months of Unity tutorials.`,
    tags: ["C#", "Game Dev", "Architecture"],
    readTime: "4 min",
  },
  {
    id: "wpf-modern-ui",
    title: "Making WPF not look like Windows XP",
    date: "January 2025",
    excerpt: "WPF has a reputation for ugly UIs. Here's how I make mine look modern...",
    content: `WPF has a reputation for ugly, dated UIs. Most WPF apps still look like they're from 2008. Here's how I make mine look modern.\n\n**Custom control templates — all of them**\n\nEvery default control — buttons, sliders, scrollbars — gets a complete template override. Yes, it's verbose. Yes, it's absolutely worth it. The default templates are the main reason WPF looks old.\n\n**No system colors**\n\nDefine your own color palette in ResourceDictionary. I use two background shades and one accent color. That's it. Don't touch SystemColors.\n\n**Smooth animations on everything**\n\nWPF's Storyboard system is genuinely powerful when used right. Every hover, transition, and loading state gets animated. This alone makes an app feel 10x more polished.\n\n**Load a modern font**\n\nInter, JetBrains Mono, or any modern font via FontFamily. The default Segoe UI is fine but a custom font immediately signals this isn't a default WPF app.\n\nThe result: apps people genuinely don't believe are built with WPF.`,
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
    id: "haram",
    src: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=200&h=140&fit=crop",
    title: "Masjid al-Haram",
    location: "Mecca, Saudi Arabia",
    lat: 21.4225,
    lng: 39.8262,
    date: "2024",
  },
  {
    id: "nabawi",
    src: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=200&h=140&fit=crop",
    title: "Masjid al-Nabawi",
    location: "Medina, Saudi Arabia",
    lat: 24.4672,
    lng: 39.6106,
    date: "2024",
  },
  {
    id: "istanbul",
    src: "https://images.unsplash.com/photo-1541862438-f02c53e4eced?w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1541862438-f02c53e4eced?w=200&h=140&fit=crop",
    title: "Blue Mosque",
    location: "Istanbul, Turkey",
    lat: 41.0055,
    lng: 28.9768,
    date: "2024",
  },
  {
    id: "prizren",
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=140&fit=crop",
    title: "Prizren",
    location: "Kosovo",
    lat: 42.2139,
    lng: 20.7397,
    date: "2024",
  },
  {
    id: "rome",
    src: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=200&h=140&fit=crop",
    title: "Roma",
    location: "Rome, Italy",
    lat: 41.9028,
    lng: 12.4964,
    date: "2024",
  },
  {
    id: "camel",
    src: "https://images.unsplash.com/photo-1553484771-898ed465e931?w=1200&q=80",
    thumb: "https://images.unsplash.com/photo-1553484771-898ed465e931?w=200&h=140&fit=crop",
    title: "Camel",
    location: "Arabian Peninsula",
    lat: 24.0,
    lng: 45.0,
    date: "2024",
  },
];

export const links = [
  { label: "GitHub", url: "https://github.com/Ni7i", icon: "🐙" },
  { label: "LinkedIn", url: "https://linkedin.com/in/enis-shorra", icon: "💼" },
  { label: "Discord", url: "#", icon: "💬" },
  { label: "Email", url: "mailto:shorra.enis@hotmail.com", icon: "✉️" },
];
