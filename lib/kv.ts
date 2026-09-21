import "server-only";
import { createClient, type VercelKV } from "@vercel/kv";

/** True when an Upstash Redis store (Vercel Marketplace, formerly Vercel KV) is connected. */
export function isKvConfigured() {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

let client: VercelKV | null = null;

/**
 * Created on first use. The default `kv` export of @vercel/kv throws on any property
 * access when the variables are missing, so it is never touched unless isKvConfigured().
 */
export function getKv(): VercelKV {
  client ??= createClient({ url: process.env.KV_REST_API_URL!, token: process.env.KV_REST_API_TOKEN! });
  return client;
}
