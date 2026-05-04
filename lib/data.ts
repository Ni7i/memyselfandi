export const personal = {
  name: "Enis",
  surname: "Shorra",
  role: "C# · .NET · UI Developer",
  age: 17,
  location: "Deutschland",
  email: "shorra.enis@hotmail.com",
  github: "https://github.com/Ni7i",
  linkedin: "https://linkedin.com/in/enis-shorra",
  discord: "enis.shorra",
  bio: "17-year-old CS student building things with C# and .NET. Strong OOP mindset, eye for clean UI design.",
  facts: [
    "I build game logic systems for fun",
    "Strong OOP & design patterns",
    "Eye for minimal UI design",
    "Open for internships",
    "Powered by energy drinks",
  ],
};

export const tech = ["C#", ".NET", "TypeScript", "React", "Next.js", "Git", "Figma", "SQL"];

export const projects = [
  {
    title: "WhitePlayer",
    period: "2024 – now",
    desc: "Minimal music player with clean WPF UI and smooth animations.",
    tags: ["C#", ".NET", "WPF"],
    github: "https://github.com/Ni7i",
    live: "",
  },
  {
    title: "Portfolio",
    period: "2025",
    desc: "This portfolio — built from scratch with Next.js & Tailwind.",
    tags: ["Next.js", "TypeScript", "Tailwind"],
    github: "https://github.com/Ni7i/memyselfandi",
    live: "https://memyselfandi-two.vercel.app",
  },
  {
    title: "Game Logic Engine",
    period: "2024",
    desc: "Reusable game logic with state machines, event bus & ECS.",
    tags: ["C#", "OOP", "Patterns"],
    github: "https://github.com/Ni7i",
    live: "",
  },
];

// Bilder in public/gallery/ ablegen und hier eintragen
// z.B. "/gallery/foto1.jpg" — einfach Dateien in public/gallery/ kopieren
export const galleryImages: string[] = [
  // Platzhalter — eigene Bilder hier eintragen:
  // "/gallery/bild1.jpg",
  // "/gallery/bild2.jpg",
  // "/gallery/bild3.jpg",
  // "/gallery/bild4.jpg",
];

export const links = [
  { label: "GitHub", url: "https://github.com/Ni7i" },
  { label: "LinkedIn", url: "https://linkedin.com/in/enis-shorra" },
  { label: "Discord", url: "#" },
  { label: "Email", url: "mailto:shorra.enis@hotmail.com" },
  { label: "Portfolio Repo", url: "https://github.com/Ni7i/memyselfandi" },
];
