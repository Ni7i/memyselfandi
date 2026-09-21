import { itemHandlers } from "@/lib/admin/crud";
import { postStore } from "@/lib/content/posts";
import { validateBlogPostInput } from "@/lib/content/validation";

export const { GET, PUT, DELETE } = itemHandlers(postStore, validateBlogPostInput);
