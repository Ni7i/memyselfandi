import "server-only";
import { getAuthConfig } from "@/lib/auth/config";
import { isKvConfigured } from "@/lib/kv";
import { REPOSITORY_URL } from "@/lib/site";

export interface DeploymentInfo {
  environment: string;
  branch: string | null;
  commitSha: string | null;
  commitMessage: string | null;
  commitAuthor: string | null;
  commitUrl: string | null;
  deploymentUrl: string | null;
  productionUrl: string | null;
  region: string | null;
  nodeVersion: string;
}

/** Vercel system environment variables; all of them are public metadata, not secrets. */
export function getDeploymentInfo(): DeploymentInfo {
  const env = process.env;
  const sha = env.VERCEL_GIT_COMMIT_SHA ?? null;
  return {
    environment: env.VERCEL_ENV ?? "development",
    branch: env.VERCEL_GIT_COMMIT_REF ?? null,
    commitSha: sha,
    commitMessage: env.VERCEL_GIT_COMMIT_MESSAGE?.split("\n")[0] ?? null,
    commitAuthor: env.VERCEL_GIT_COMMIT_AUTHOR_LOGIN ?? null,
    commitUrl: sha ? `${REPOSITORY_URL}/commit/${sha}` : null,
    deploymentUrl: env.VERCEL_URL ? `https://${env.VERCEL_URL}` : null,
    productionUrl: env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}` : null,
    region: env.VERCEL_REGION ?? null,
    nodeVersion: process.version,
  };
}

export interface ConfigCheck {
  label: string;
  variables: string;
  ok: boolean;
  note: string;
}

/** Reports only whether each setting is present and valid. Values never leave the server. */
export function getConfigChecks(): ConfigCheck[] {
  return [
    {
      label: "Admin-Login",
      variables: "ADMIN_PASSWORD_HASH, SESSION_SECRET",
      ok: getAuthConfig() !== null,
      note: "Passwort-Hash (scrypt) und Signatur-Schlüssel für die Session.",
    },
    {
      label: "Inhalte speichern",
      variables: "KV_REST_API_URL, KV_REST_API_TOKEN",
      ok: isKvConfigured(),
      note: "Upstash Redis aus dem Vercel Marketplace.",
    },
    {
      label: "Kontaktformular",
      variables: "RESEND_API_KEY",
      ok: Boolean(process.env.RESEND_API_KEY),
      note: "Versand der Nachrichten über Resend.",
    },
    {
      label: "Last.fm",
      variables: "LASTFM_API_KEY",
      ok: Boolean(process.env.LASTFM_API_KEY),
      note: "Optional, wird aktuell von keiner Seite genutzt.",
    },
  ];
}
