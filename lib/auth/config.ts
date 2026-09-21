import "server-only";
import { createHmac } from "node:crypto";
import { parsePasswordHash, type PasswordHash } from "./password";

const MIN_SECRET_LENGTH = 32;

export interface AuthConfig {
  passwordHash: PasswordHash;
  sessionKey: Buffer;
}

/**
 * Reads the admin credentials from server-only environment variables.
 * Returns null when they are missing or malformed, which disables login entirely
 * instead of falling back to a default.
 */
export function getAuthConfig(): AuthConfig | null {
  const storedHash = process.env.ADMIN_PASSWORD_HASH;
  const secret = process.env.SESSION_SECRET;

  if (!storedHash) {
    if (process.env.ADMIN_PASSWORD) {
      console.error("ADMIN_PASSWORD is not supported. Store a hash in ADMIN_PASSWORD_HASH (npm run admin:credentials).");
    }
    return null;
  }

  const passwordHash = parsePasswordHash(storedHash);
  if (!passwordHash) {
    console.error("ADMIN_PASSWORD_HASH is malformed. Generate it with npm run admin:credentials.");
    return null;
  }
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    console.error(`SESSION_SECRET must be at least ${MIN_SECRET_LENGTH} characters.`);
    return null;
  }

  // Binding the key to the password hash invalidates all sessions when the password changes.
  const sessionKey = createHmac("sha256", secret).update("admin-session-jwt\0").update(storedHash.trim()).digest();
  return { passwordHash, sessionKey };
}
