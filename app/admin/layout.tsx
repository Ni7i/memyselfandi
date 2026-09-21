import type { Metadata } from "next";
import { ADMIN_TITLE } from "@/lib/site";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: ADMIN_TITLE, template: `%s · ${ADMIN_TITLE}` },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="adm" lang="de">
      {children}
    </div>
  );
}
