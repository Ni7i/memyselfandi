import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guard";
import { projectStore } from "@/lib/content/projects";
import DeleteButton from "../../../_components/DeleteButton";
import ProjectForm from "../../../_components/ProjectForm";
import StorageNotice from "../../../_components/StorageNotice";

export const metadata: Metadata = { title: "Projekt bearbeiten" };

export default async function EditProjectPage(props: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await props.params;
  const [project, status] = await Promise.all([projectStore.get(slug, "admin"), projectStore.status()]);
  if (!project) notFound();

  return (
    <>
      <div className="adm-page-head">
        <div>
          <span className="adm-kicker">Projekt bearbeiten</span>
          <h1 className="adm-title">{project.title}</h1>
        </div>
        <DeleteButton
          endpoint={`/api/admin/projects/${encodeURIComponent(project.slug)}`}
          itemTitle={project.title}
          redirectTo="/admin/projects"
        />
      </div>
      <StorageNotice connected={status.connected} reachable={status.reachable} />
      <ProjectForm project={project} />
    </>
  );
}
