import "server-only";
import { getKv, isKvConfigured } from "@/lib/kv";

const MAX_FAILED_ATTEMPTS = 5;
const WINDOW_SECONDS = 15 * 60;

// Used only when Redis is not connected (local development). On serverless hosting
// each instance keeps its own map, so Redis is what makes the limit reliable.
const memoryAttempts = new Map<string, { count: number; resetAt: number }>();

function attemptsKey(clientId: string) {
  return `admin:login-failures:${clientId}`;
}

function memoryCount(clientId: string) {
  const entry = memoryAttempts.get(clientId);
  if (!entry || entry.resetAt <= Date.now()) {
    memoryAttempts.delete(clientId);
    return 0;
  }
  return entry.count;
}

export async function isLoginBlocked(clientId: string): Promise<boolean> {
  if (isKvConfigured()) {
    try {
      return ((await getKv().get<number>(attemptsKey(clientId))) ?? 0) >= MAX_FAILED_ATTEMPTS;
    } catch (error) {
      console.error("Login rate limit could not be read", error instanceof Error ? error.name : error);
    }
  }
  return memoryCount(clientId) >= MAX_FAILED_ATTEMPTS;
}

export async function recordFailedLogin(clientId: string): Promise<void> {
  if (isKvConfigured()) {
    try {
      const count = await getKv().incr(attemptsKey(clientId));
      if (count === 1) await getKv().expire(attemptsKey(clientId), WINDOW_SECONDS);
      return;
    } catch (error) {
      console.error("Login rate limit could not be written", error instanceof Error ? error.name : error);
    }
  }
  const count = memoryCount(clientId) + 1;
  const resetAt = memoryAttempts.get(clientId)?.resetAt ?? Date.now() + WINDOW_SECONDS * 1000;
  memoryAttempts.set(clientId, { count, resetAt });
}

export async function clearFailedLogins(clientId: string): Promise<void> {
  memoryAttempts.delete(clientId);
  if (!isKvConfigured()) return;
  try {
    await getKv().del(attemptsKey(clientId));
  } catch (error) {
    console.error("Login rate limit could not be reset", error instanceof Error ? error.name : error);
  }
}

/** Vercel overwrites x-forwarded-for with the real client address. */
export function clientIdFromRequest(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}
