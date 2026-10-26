import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const display = localFont({
  src: [
    { path: "./fonts/fraunces-latin.woff2", style: "normal" },
    { path: "./fonts/fraunces-latin-italic.woff2", style: "italic" },
  ],
  weight: "100 900",
  variable: "--font-display",
  display: "swap",
});

const text = localFont({
  src: "./fonts/manrope-latin.woff2",
  weight: "200 800",
  variable: "--font-text",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Enis Shorra",
  description: "An illustrated autobiography of Enis Shorra, application developer in training at IMS Baden.",
};

// Before first paint: drawings that will animate start hidden, unless the reader prefers less motion.
const motionScript = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("draw-pending")}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
