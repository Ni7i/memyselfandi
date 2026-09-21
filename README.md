# enisshorra.ch

Persönliches Portfolio von Enis Shorra: Next.js 16 (App Router), React 19, TypeScript, gehostet auf Vercel.

```bash
npm ci
npm run dev        # http://localhost:3000
npm test           # Vitest
npm run build
```

## Admin (`/admin`)

Verwaltung von Projekten und Blogposts, dazu ein Dashboard und Deployment-Infos.

**Anmeldung.** Das Passwort wird nie im Klartext gespeichert, nur als scrypt-Hash (N=2^17, r=8, p=1) in `ADMIN_PASSWORD_HASH`. Geprüft wird es ausschließlich serverseitig in `POST /api/admin/login`: zeitkonstanter Vergleich, höchstens 5 Fehlversuche pro 15 Minuten und IP. Nach dem Login gibt es ein mit HMAC-SHA256 signiertes Session-Cookie (`__Host-admin_session`, HttpOnly, Secure, SameSite=Strict, 8 h gültig). Der Signaturschlüssel wird aus `SESSION_SECRET` und dem Passwort-Hash abgeleitet. Ein neues Passwort oder ein neues Secret meldet deshalb alle Sessions ab.

**Zugriffsschutz auf zwei Ebenen.** `proxy.ts` leitet ohne gültige Session auf `/admin/login` um bzw. antwortet mit 401. Zusätzlich prüft jede Admin-Seite (`requireAdmin`) und jede Admin-API-Route die Session selbst. Schreibende Requests von fremden Origins werden mit 403 abgelehnt.

Zugangsdaten erzeugen:

```bash
npm run admin:credentials
```

Das Skript fragt das Passwort verdeckt ab und gibt `ADMIN_PASSWORD_HASH` und `SESSION_SECRET` aus. Beide Werte in Vercel eintragen und für lokal in `.env.local` (nie committen).

## Inhalte

Projekte und Blogposts liegen in **Upstash Redis** (Vercel Marketplace, Nachfolger von Vercel KV). Es gibt je einen Hash `content:projects` bzw. `content:posts` mit einem JSON-Eintrag pro Slug. Zugriff über das vorhandene `@vercel/kv`.

- Ohne Redis zeigt die Website den Standardinhalt aus `lib/content/seed.ts`, der Admin ist dann schreibgeschützt (Schreibversuche → 503).
- Bei der ersten Änderung wird der Standardinhalt einmal nach Redis kopiert. Danach ist Redis die einzige Quelle.
- Öffentliche Seiten lesen bei jedem Request (`force-dynamic`), Änderungen sind also sofort live. Fällt Redis aus, sehen Besucher den Standardinhalt, der Admin bekommt eine Fehlermeldung.
- Alles, was aus Redis kommt, wird vor dem Rendern erneut validiert (z. B. nur `http(s)`-Links).

## Environment Variables

| Variable | Pflicht | Zweck |
| --- | --- | --- |
| `ADMIN_PASSWORD_HASH` | für `/admin` | scrypt-Hash des Admin-Passworts (`npm run admin:credentials`) |
| `SESSION_SECRET` | für `/admin` | ≥ 32 Zeichen, signiert das Session-Cookie |
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | zum Bearbeiten | werden beim Verbinden der Upstash-Datenbank automatisch gesetzt |
| `RESEND_API_KEY`, `RESEND_EMAIL_DOMAIN` | Kontaktformular | Versand über Resend |
| `CONTACT_EMAIL` | optional | Empfänger des Kontaktformulars |
| `LASTFM_API_KEY`, `LASTFM_USERNAME` | optional | `/api/lastfm`, derzeit von keiner Seite genutzt |

Vorlage: `.env.example`. Keine dieser Variablen darf mit `NEXT_PUBLIC_` beginnen.

## Deployment (Vercel)

1. `npm run admin:credentials` ausführen.
2. Vercel → Projekt `memyselfandi` → Settings → Environment Variables: `ADMIN_PASSWORD_HASH` und `SESSION_SECRET` für Production (und bei Bedarf Preview) anlegen.
3. Vercel → Storage → Upstash for Redis → Datenbank erstellen und mit dem Projekt verbinden (setzt die `KV_*`-Variablen).
4. Neu deployen (Push auf `main` oder „Redeploy"), damit die Variablen greifen.
5. `https://enisshorra.ch/admin` öffnen und anmelden.
