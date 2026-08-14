import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Enis Shorra",
  description: "Developer from Switzerland. Eighteen, and building.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
