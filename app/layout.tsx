import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// A pen hand for what Enis says, a book face for what he tells, a terminal face for dates and code,
// and one joined script for the words the thread writes at the end.
const hand = localFont({
  src: [
    { path: "./fonts/kalam-300-latin.woff2", weight: "300" },
    { path: "./fonts/kalam-400-latin.woff2", weight: "400" },
    { path: "./fonts/kalam-700-latin.woff2", weight: "700" },
  ],
  variable: "--font-hand",
  display: "swap",
});

const book = localFont({
  src: [
    { path: "./fonts/source-serif-4-latin.woff2", style: "normal" },
    { path: "./fonts/source-serif-4-italic-latin.woff2", style: "italic" },
  ],
  weight: "300 700",
  variable: "--font-book",
  display: "swap",
});

const mono = localFont({
  src: [
    { path: "./fonts/plex-mono-400-latin.woff2", weight: "400" },
    { path: "./fonts/plex-mono-500-latin.woff2", weight: "500" },
  ],
  variable: "--font-code",
  display: "swap",
});

const script = localFont({
  src: "./fonts/sacramento-latin.woff2",
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Enis Shorra",
  description: "An illustrated autobiography of Enis Shorra, application developer in training at IMS Baden.",
};

// Before first paint: mark that scripts run, so drawings are placed inline rather than as images.
const motionScript = `document.documentElement.classList.add("js")`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hand.variable} ${book.variable} ${mono.variable} ${script.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
