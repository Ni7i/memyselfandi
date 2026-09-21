import { projectLink } from "@/lib/content/format";
import type { Project } from "@/lib/content/types";

interface Props {
  project: Project;
  /** Shown for top projects, as 01, 02, … */
  number?: number;
  /** Link to the project's own page instead of its repository or live site. */
  internal?: boolean;
}

export default function ProjectRow({ project, number, internal = false }: Props) {
  const { href, external } = internal ? { href: `/projects/${project.slug}`, external: false } : projectLink(project);
  return (
    <a className="archive-row" href={href} {...(external ? { rel: "noreferrer", target: "_blank" } : {})}>
      {number !== undefined && <span className="archive-number">{String(number).padStart(2, "0")}</span>}
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <span className="archive-stack">{project.stack.join(" · ")}</span>
      <span className="archive-arrow" aria-hidden="true">{external ? "↗" : "→"}</span>
    </a>
  );
}
