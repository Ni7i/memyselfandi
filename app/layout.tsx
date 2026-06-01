import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono, Amiri } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const instrumentSerif = Instrument_Serif({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-display" });
const jetbrainsMono = JetBrains_Mono({ weight: ["400", "500"], subsets: ["latin"], variable: "--font-mono" });
const amiri = Amiri({ weight: ["400", "700"], subsets: ["arabic", "latin"], variable: "--font-arabic" });

export const metadata: Metadata = {
  title: "Enis Shorra",
  description: "17-year-old coder from Switzerland — C#, .NET, Blazor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} ${amiri.variable}`}>
      <body>{children}</body>
    </html>
  );
}
