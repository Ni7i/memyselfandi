// Pure scrypt helpers. No environment access here, so the credentials
// script (scripts/admin-credentials.mjs) can import this file directly.
import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from "node:crypto";

// OWASP minimum for scrypt: N=2^17, r=8, p=1.
const DEFAULT_COST = 2 ** 17;
const BLOCK_SIZE = 8;
const PARALLELISM = 1;
const SALT_BYTES = 16;
const KEY_BYTES = 64;
const MAX_PASSWORD_LENGTH = 1024;
const PREFIX = "scrypt";

export interface PasswordHash {
  cost: number;
  blockSize: number;
  parallelism: number;
  salt: Buffer;
  key: Buffer;
}

function derive(password: string, salt: Buffer, length: number, options: ScryptOptions) {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(password.normalize("NFKC"), salt, length, options, (error, key) =>
      error ? reject(error) : resolve(key),
    );
  });
}

function scryptOptions(cost: number, blockSize: number, parallelism: number): ScryptOptions {
  // Node rejects scrypt calls above maxmem, so allow twice the memory the parameters need.
  return { N: cost, r: blockSize, p: parallelism, maxmem: 256 * cost * blockSize };
}

/**
 * Hashes a password into the storable format
 * `scrypt.<N>.<r>.<p>.<salt>.<key>` (base64url, no `$`, so .env parsers leave it alone).
 */
export async function hashPassword(password: string, cost = DEFAULT_COST): Promise<string> {
  const salt = randomBytes(SALT_BYTES);
  const key = await derive(password, salt, KEY_BYTES, scryptOptions(cost, BLOCK_SIZE, PARALLELISM));
  return [PREFIX, cost, BLOCK_SIZE, PARALLELISM, salt.toString("base64url"), key.toString("base64url")].join(".");
}

export function parsePasswordHash(stored: string): PasswordHash | null {
  const parts = stored.trim().split(".");
  if (parts.length !== 6 || parts[0] !== PREFIX) return null;

  const [cost, blockSize, parallelism] = parts.slice(1, 4).map(Number);
  const salt = Buffer.from(parts[4], "base64url");
  const key = Buffer.from(parts[5], "base64url");

  const isPowerOfTwo = Number.isInteger(cost) && cost > 1 && (cost & (cost - 1)) === 0;
  if (!isPowerOfTwo || cost < 2 ** 14 || cost > 2 ** 20) return null;
  if (!Number.isInteger(blockSize) || blockSize < 1 || blockSize > 32) return null;
  if (!Number.isInteger(parallelism) || parallelism < 1 || parallelism > 16) return null;
  if (salt.length < SALT_BYTES || key.length < 32) return null;

  return { cost, blockSize, parallelism, salt, key };
}

export async function verifyPassword(password: string, hash: PasswordHash): Promise<boolean> {
  if (password.length === 0 || password.length > MAX_PASSWORD_LENGTH) return false;
  const candidate = await derive(
    password,
    hash.salt,
    hash.key.length,
    scryptOptions(hash.cost, hash.blockSize, hash.parallelism),
  );
  return timingSafeEqual(candidate, hash.key);
}
