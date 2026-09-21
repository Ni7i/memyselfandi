import "server-only";
import type { createCollection } from "@/lib/content/collection";
import type { ValidationResult } from "@/lib/content/validation";
import {
  errorResponse,
  json,
  noContent,
  readJsonBody,
  rejectUnauthenticated,
  rejectUnauthorizedMutation,
  storeErrorResponse,
} from "./http";

type Store<T extends { slug: string; updatedAt: string | null }> = ReturnType<typeof createCollection<T>>;
type Validate<T> = (input: unknown) => ValidationResult<Omit<T, "updatedAt">>;
type ItemContext = { params: Promise<{ slug: string }> };

/** GET (list, including drafts) and POST (create) for /api/admin/<collection>. */
export function collectionHandlers<T extends { slug: string; updatedAt: string | null }>(
  store: Store<T>,
  validate: Validate<T>,
  basePath: string,
) {
  return {
    async GET(request: Request) {
      const denied = rejectUnauthenticated(request);
      if (denied) return denied;
      try {
        return json({ items: await store.list("admin") });
      } catch (error) {
        return storeErrorResponse(error);
      }
    },

    async POST(request: Request) {
      const denied = rejectUnauthorizedMutation(request);
      if (denied) return denied;
      const parsed = await readJsonBody(request);
      if (!parsed.ok) return parsed.response;
      const result = validate(parsed.body);
      if (!result.ok) return errorResponse(400, "Bitte die markierten Felder prüfen.", result.errors);
      try {
        const item = await store.create(result.value);
        return json({ item }, 201, { Location: `${basePath}/${item.slug}` });
      } catch (error) {
        return storeErrorResponse(error);
      }
    },
  };
}

/** GET, PUT and DELETE for /api/admin/<collection>/[slug]. */
export function itemHandlers<T extends { slug: string; updatedAt: string | null }>(store: Store<T>, validate: Validate<T>) {
  return {
    async GET(request: Request, { params }: ItemContext) {
      const denied = rejectUnauthenticated(request);
      if (denied) return denied;
      const { slug } = await params;
      try {
        const item = await store.get(slug, "admin");
        return item ? json({ item }) : errorResponse(404, `"${slug}" wurde nicht gefunden.`);
      } catch (error) {
        return storeErrorResponse(error);
      }
    },

    async PUT(request: Request, { params }: ItemContext) {
      const denied = rejectUnauthorizedMutation(request);
      if (denied) return denied;
      const { slug } = await params;
      const parsed = await readJsonBody(request);
      if (!parsed.ok) return parsed.response;
      const result = validate(parsed.body);
      if (!result.ok) return errorResponse(400, "Bitte die markierten Felder prüfen.", result.errors);
      try {
        return json({ item: await store.update(slug, result.value) });
      } catch (error) {
        return storeErrorResponse(error);
      }
    },

    async DELETE(request: Request, { params }: ItemContext) {
      const denied = rejectUnauthorizedMutation(request);
      if (denied) return denied;
      const { slug } = await params;
      try {
        await store.remove(slug);
        return noContent();
      } catch (error) {
        return storeErrorResponse(error);
      }
    },
  };
}
