import { itemHandlers } from "@/lib/admin/crud";
import { projectStore } from "@/lib/content/projects";
import { validateProjectInput } from "@/lib/content/validation";

export const { GET, PUT, DELETE } = itemHandlers(projectStore, validateProjectInput);
