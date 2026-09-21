import "server-only";
import { getKv, isKvConfigured } from "@/lib/kv";

export class StorageUnavailableError extends Error {
  constructor(message = "Der Speicher ist nicht verbunden.") {
    super(message);
    this.name = "StorageUnavailableError";
  }
}

export class ConflictError extends Error {
  constructor(slug: string) {
    super(`Der Slug "${slug}" ist bereits vergeben.`);
    this.name = "ConflictError";
  }
}

export class NotFoundError extends Error {
  constructor(slug: string) {
    super(`"${slug}" wurde nicht gefunden.`);
    this.name = "NotFoundError";
  }
}

interface CollectionOptions<T> {
  /** Redis hash holding one JSON entry per slug. */
  key: string;
  seed: () => T[];
  parse: (value: unknown) => T | null;
  compare: (a: T, b: T) => number;
}

export type ReadMode = "public" | "admin";

/**
 * A slug-keyed collection in a Redis hash, falling back to seed data until the
 * first write. A separate marker key records that seeding happened, so deleting
 * every entry does not bring the seed content back.
 */
export function createCollection<T extends { slug: string; updatedAt: string | null }>(options: CollectionOptions<T>) {
  const markerKey = `${options.key}:seeded`;

  function sorted(items: T[]) {
    return [...items].sort(options.compare);
  }

  function assertConfigured() {
    if (!isKvConfigured()) throw new StorageUnavailableError();
  }

  async function withStorage<R>(operation: () => Promise<R>): Promise<R> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof ConflictError || error instanceof NotFoundError || error instanceof StorageUnavailableError) {
        throw error;
      }
      console.error(`Redis operation on ${options.key} failed`, error instanceof Error ? error.name : error);
      throw new StorageUnavailableError("Der Speicher ist gerade nicht erreichbar.");
    }
  }

  async function ensureSeeded() {
    if (await getKv().exists(markerKey)) return;
    // hsetnx keeps anything written concurrently instead of overwriting it with seed data.
    await Promise.all(options.seed().map((item) => getKv().hsetnx(options.key, item.slug, item)));
    await getKv().set(markerKey, new Date().toISOString());
  }

  /**
   * Public reads never fail: without Redis, or if it is unreachable, visitors see
   * the seed content. Admin reads report the outage instead of hiding it.
   */
  async function list(mode: ReadMode): Promise<T[]> {
    if (!isKvConfigured()) return sorted(options.seed());
    try {
      const [seeded, entries] = await Promise.all([
        getKv().exists(markerKey),
        getKv().hgetall<Record<string, unknown>>(options.key),
      ]);
      if (!seeded) return sorted(options.seed());
      const items = Object.values(entries ?? {})
        .map(options.parse)
        .filter((item): item is T => item !== null);
      return sorted(items);
    } catch (error) {
      console.error(`Redis read of ${options.key} failed`, error instanceof Error ? error.name : error);
      if (mode === "admin") throw new StorageUnavailableError("Der Speicher ist gerade nicht erreichbar.");
      return sorted(options.seed());
    }
  }

  async function get(slug: string, mode: ReadMode): Promise<T | null> {
    return (await list(mode)).find((item) => item.slug === slug) ?? null;
  }

  async function create(input: Omit<T, "updatedAt">): Promise<T> {
    assertConfigured();
    return withStorage(async () => {
      await ensureSeeded();
      const item = { ...input, updatedAt: new Date().toISOString() } as T;
      if (!(await getKv().hsetnx(options.key, item.slug, item))) throw new ConflictError(item.slug);
      return item;
    });
  }

  async function update(slug: string, input: Omit<T, "updatedAt">): Promise<T> {
    assertConfigured();
    return withStorage(async () => {
      await ensureSeeded();
      if (!(await getKv().hexists(options.key, slug))) throw new NotFoundError(slug);
      const item = { ...input, updatedAt: new Date().toISOString() } as T;
      if (item.slug !== slug) {
        // Renaming: claim the new slug first so an existing entry is never overwritten.
        if (!(await getKv().hsetnx(options.key, item.slug, item))) throw new ConflictError(item.slug);
        await getKv().hdel(options.key, slug);
      } else {
        await getKv().hset(options.key, { [slug]: item });
      }
      return item;
    });
  }

  async function remove(slug: string): Promise<void> {
    assertConfigured();
    return withStorage(async () => {
      await ensureSeeded();
      if (!(await getKv().hdel(options.key, slug))) throw new NotFoundError(slug);
    });
  }

  async function status() {
    if (!isKvConfigured()) return { connected: false, reachable: false, seeded: false } as const;
    try {
      return { connected: true, reachable: true, seeded: Boolean(await getKv().exists(markerKey)) } as const;
    } catch {
      return { connected: true, reachable: false, seeded: false } as const;
    }
  }

  return { list, get, create, update, remove, status };
}
