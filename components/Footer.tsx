import { personal } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="py-8 px-6 text-center" style={{ borderTop: "1px solid #2a2a3e" }}>
      <p className="text-sm" style={{ color: "#64748b" }}>
        © {new Date().getFullYear()} {personal.name} — mit Next.js & Tailwind gebaut
      </p>
    </footer>
  );
}
