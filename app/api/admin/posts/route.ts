import { collectionHandlers } from "@/lib/admin/crud";
import { postStore } from "@/lib/content/posts";
import { validateBlogPostInput } from "@/lib/content/validation";

export const { GET, POST } = collectionHandlers(postStore, validateBlogPostInput, "/api/admin/posts");
