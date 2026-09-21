// In-memory stand-in for the @vercel/kv client, covering the commands the app uses.
// Mirrors Redis/Upstash semantics: values round-trip through JSON, empty hashes disappear.

type Hash = Map<string, unknown>;

const strings = new Map<string, unknown>();
const hashes = new Map<string, Hash>();
let failing = false;

const copy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

function guard() {
  if (failing) throw new Error("UpstashError: connection refused");
}

export const memoryKv = {
  async ping() {
    guard();
    return "PONG";
  },
  async exists(...keys: string[]) {
    guard();
    return keys.filter((key) => strings.has(key) || hashes.has(key)).length;
  },
  async get<T>(key: string): Promise<T | null> {
    guard();
    return strings.has(key) ? (copy(strings.get(key)) as T) : null;
  },
  async set(key: string, value: unknown) {
    guard();
    strings.set(key, copy(value));
    return "OK";
  },
  async del(...keys: string[]) {
    guard();
    return keys.filter((key) => strings.delete(key) || hashes.delete(key)).length;
  },
  async incr(key: string) {
    guard();
    const next = Number(strings.get(key) ?? 0) + 1;
    strings.set(key, next);
    return next;
  },
  async expire() {
    guard();
    return 1;
  },
  async hgetall<T>(key: string): Promise<T | null> {
    guard();
    const hash = hashes.get(key);
    return hash ? (Object.fromEntries([...hash].map(([field, value]) => [field, copy(value)])) as T) : null;
  },
  async hsetnx(key: string, field: string, value: unknown) {
    guard();
    const hash = hashes.get(key) ?? new Map();
    if (hash.has(field)) return 0;
    hash.set(field, copy(value));
    hashes.set(key, hash);
    return 1;
  },
  async hset(key: string, record: Record<string, unknown>) {
    guard();
    const hash = hashes.get(key) ?? new Map();
    let added = 0;
    for (const [field, value] of Object.entries(record)) {
      if (!hash.has(field)) added += 1;
      hash.set(field, copy(value));
    }
    hashes.set(key, hash);
    return added;
  },
  async hexists(key: string, field: string) {
    guard();
    return hashes.get(key)?.has(field) ? 1 : 0;
  },
  async hdel(key: string, ...fields: string[]) {
    guard();
    const hash = hashes.get(key);
    if (!hash) return 0;
    const removed = fields.filter((field) => hash.delete(field)).length;
    if (hash.size === 0) hashes.delete(key);
    return removed;
  },
};

export const memoryState = {
  reset() {
    strings.clear();
    hashes.clear();
    failing = false;
  },
  /** Makes every command throw, like an unreachable Redis. */
  fail(value = true) {
    failing = value;
  },
  hash(key: string) {
    return hashes.get(key);
  },
  string(key: string) {
    return strings.get(key);
  },
  /** Writes directly, bypassing validation, like a hand edit in the Upstash console. */
  rawHashSet(key: string, field: string, value: unknown) {
    const hash = hashes.get(key) ?? new Map();
    hash.set(field, value);
    hashes.set(key, hash);
  },
};
