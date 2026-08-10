import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enis Shorra",
  description: "17-year-old coder from Switzerland — C#, .NET, Blazor",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
