import "server-only";
import { StorageUnavailableError, type createCollection } from "@/lib/content/collection";

type Store<T extends { slug: string; updatedAt: string | null }> = ReturnType<typeof createCollection<T>>;

/** Loads a collection for an admin page, turning a storage outage into a message instead of a crash. */
export async function loadForAdmin<T extends { slug: string; updatedAt: string | null }>(store: Store<T>) {
  const status = await store.status();
  try {
    return { items: await store.list("admin"), status, error: null };
  } catch (error) {
    if (error instanceof StorageUnavailableError) return { items: [] as T[], status, error: error.message };
    throw error;
  }
}
