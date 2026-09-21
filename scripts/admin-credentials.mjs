#!/usr/bin/env node
// Creates the two admin environment variables:
//   ADMIN_PASSWORD_HASH  scrypt hash of the password you type (the password itself is never stored)
//   SESSION_SECRET       random key used to sign session cookies
//
// Usage: npm run admin:credentials
// Then paste both lines into Vercel → Settings → Environment Variables (and .env.local for local use).

import { randomBytes } from "node:crypto";
import { stdin, stdout, exit } from "node:process";
import { hashPassword } from "../lib/auth/password.ts";

const MIN_LENGTH = 12;

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
        if (char === "") {
          stdout.write("\n");
          exit(130);
        }
        if (char === "" || char === "\b") value = value.slice(0, -1);
        else value += char;
      }
    };
    stdin.on("data", onData);
  });
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

console.log("\nIn Vercel (Production + Preview) und für lokal in .env.local eintragen:\n");
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log(`SESSION_SECRET=${secret}`);
console.log("\nDas Passwort selbst wird nirgends gespeichert. Diese Werte nie committen.");
