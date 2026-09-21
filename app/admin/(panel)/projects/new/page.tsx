import type { Metadata } from "next";
import { loadForAdmin } from "@/lib/admin/load";
import { requireAdmin } from "@/lib/auth/guard";
import { projectStore } from "@/lib/content/projects";
import ProjectForm from "../../../_components/ProjectForm";
import StorageNotice from "../../../_components/StorageNotice";

export const metadata: Metadata = { title: "Neues Projekt" };

export default async function NewProjectPage() {
  await requireAdmin();
  const { items, status, error } = await loadForAdmin(projectStore);
  const nextOrder = items.reduce((max, project) => Math.max(max, project.order), 0) + 1;

  return (
    <>
      <div className="adm-page-head">
        <div>
          <span className="adm-kicker">Projekte</span>
          <h1 className="adm-title">Neues <em>Projekt</em></h1>
        </div>
      </div>
      <StorageNotice connected={status.connected} reachable={status.reachable && !error} />
      <ProjectForm nextOrder={nextOrder} />
    </>
  );
}
