import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const manrope = localFont({
  src: "./fonts/manrope-latin.woff2",
  weight: "300 800",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
  variable: "--font-sans",
});
const fraunces = localFont({
  src: [
    {
      path: "./fonts/fraunces-latin.woff2",
      weight: "300 600",
      style: "normal",
    },
    {
      path: "./fonts/fraunces-latin-italic.woff2",
      weight: "300 600",
      style: "italic",
    },
  ],
  display: "swap",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "Enis Shorra",
  description: "Application developer from the Limmattal. Projects, skills and contact.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${fraunces.variable}`}>
      <body>{children}</body>
    </html>
  );
}
