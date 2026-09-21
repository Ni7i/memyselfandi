#!/usr/bin/env node
// Creates the two admin environment variables:
//   ADMIN_PASSWORD_HASH  scrypt hash of the password you type (the password itself is never stored)
//   SESSION_SECRET       random key used to sign session cookies
//
// Usage:
//   npm run admin:credentials              prints both lines, for .env.local or manual entry in Vercel
//   npm run admin:credentials -- --vercel  writes both straight to Vercel Production, without printing them
//
// After --vercel, redeploy production so the new values take effect.

import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { argv, exit, stdin, stdout } from "node:process";
import { hashPassword } from "../lib/auth/password.ts";

const MIN_LENGTH = 12;
const CTRL_C = String.fromCharCode(3);
const BACKSPACE = String.fromCharCode(8);
const DELETE = String.fromCharCode(127);
const toVercel = argv.includes("--vercel");

function prompt(question) {
  return new Promise((resolve) => {
    stdout.write(question);
    // Piped input (e.g. CI): read a single line without echo handling.
    if (!stdin.isTTY) {
      let buffer = "";
      stdin.setEncoding("utf8");
      stdin.on("data", (chunk) => (buffer += chunk));
      stdin.on("end", () => resolve(buffer.split(/\r?\n/)[0] ?? ""));
      return;
    }

    let value = "";
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    const onData = (chunk) => {
      for (const char of chunk) {
        if (char === "\r" || char === "\n") {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.off("data", onData);
          stdout.write("\n");
          resolve(value);
          return;
        }
        if (char === CTRL_C) {
          stdout.write("\n");
          exit(130);
        }
        if (char === DELETE || char === BACKSPACE) value = value.slice(0, -1);
        else value += char;
      }
    };
    stdin.on("data", onData);
  });
}

/** Sets a Production variable through the Vercel CLI; the value goes via stdin, never argv. */
function setVercelVariable(name, value) {
  const result = spawnSync("vercel", ["env", "add", name, "production", "--force", "--yes"], {
    input: value,
    encoding: "utf8",
  });
  if (result.error) {
    console.error(`Vercel CLI nicht gefunden (${result.error.message}). Installieren: npm i -g vercel`);
    exit(1);
  }
  if (result.status !== 0) {
    console.error(`${name} konnte nicht gesetzt werden:\n${(result.stderr || result.stdout).trim()}`);
    exit(1);
  }
  console.log(`✓ ${name} in Vercel (Production) gesetzt`);
}

const password = await prompt("Neues Admin-Passwort: ");
if (password.length < MIN_LENGTH) {
  console.error(`Das Passwort muss mindestens ${MIN_LENGTH} Zeichen lang sein.`);
  exit(1);
}
if (stdin.isTTY) {
  const confirmation = await prompt("Passwort wiederholen: ");
  if (confirmation !== password) {
    console.error("Die Passwörter stimmen nicht überein.");
    exit(1);
  }
}

const hash = await hashPassword(password);
const secret = randomBytes(32).toString("base64url");

if (toVercel) {
  setVercelVariable("ADMIN_PASSWORD_HASH", hash);
  setVercelVariable("SESSION_SECRET", secret);
  console.log("\nFertig. Jetzt Production neu deployen, damit die Werte greifen.");
} else {
  console.log("\nIn Vercel (Production) und für lokal in .env.local eintragen:\n");
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log(`SESSION_SECRET=${secret}`);
  console.log("\nDas Passwort selbst wird nirgends gespeichert. Diese Werte nie committen.");
}
