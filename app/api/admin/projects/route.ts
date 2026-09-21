import { collectionHandlers } from "@/lib/admin/crud";
import { projectStore } from "@/lib/content/projects";
import { validateProjectInput } from "@/lib/content/validation";

export const { GET, POST } = collectionHandlers(projectStore, validateProjectInput, "/api/admin/projects");
