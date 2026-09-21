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
  currently: "Building small tools with C#, .NET and Blazor",
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
    id: "taksim-mosque",
    src: "/gallery/istanbul-2.jpg",
    thumb: "/gallery/istanbul-2.jpg",
    title: "Taksim Camii",
    location: "Istanbul, Turkey",
    lat: 41.0369,
    lng: 28.9851,
    date: "2025",
  },
  {
    id: "blue-mosque-exterior",
    src: "/gallery/istanbul-4.jpg",
    thumb: "/gallery/istanbul-4.jpg",
    title: "Blue Mosque · Sultanahmet",
    location: "Istanbul, Turkey",
    lat: 41.0050,
    lng: 28.9774,
    date: "2025",
  },
  {
    id: "istiklal-street",
    src: "/gallery/istanbul-5.jpg",
    thumb: "/gallery/istanbul-5.jpg",
    title: "İstiklal Caddesi",
    location: "Istanbul, Turkey",
    lat: 41.0333,
    lng: 28.9809,
    date: "2025",
  },
  {
    id: "kosovo-sunset",
    src: "/gallery/new-1.jpg",
    thumb: "/gallery/new-1.jpg",
    title: "Kosovo Sunset",
    location: "Prizren, Kosovo",
    lat: 42.2151,
    lng: 20.7406,
    date: "2024",
  },
  {
    id: "vierwaldstaettersee",
    src: "/gallery/new-2.jpg",
    thumb: "/gallery/new-2.jpg",
    title: "Vierwaldstättersee",
    location: "Lake Lucerne, Switzerland",
    lat: 47.0200,
    lng: 8.4603,
    date: "2024",
  },
  {
    id: "roche-tower",
    src: "/gallery/new-3.jpg",
    thumb: "/gallery/new-3.jpg",
    title: "Roche Tower · Basel",
    location: "Basel, Switzerland",
    lat: 47.5596,
    lng: 7.5886,
    date: "2024",
  },
  {
    id: "kutüphane",
    src: "/gallery/new-4.jpg",
    thumb: "/gallery/new-4.jpg",
    title: "Kütüphane",
    location: "Istanbul, Turkey",
    lat: 41.0165,
    lng: 28.9741,
    date: "2025",
  },
];

export const links = [
  { label: "GitHub", url: "https://github.com/Ni7i", icon: "🐙" },
  { label: "LinkedIn", url: "https://linkedin.com/in/enis-shorra", icon: "💼" },
  { label: "Discord", url: "#", icon: "💬" },
  { label: "Email", url: "mailto:shorra.enis@hotmail.com", icon: "✉️" },
];
