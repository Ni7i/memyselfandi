# enisshorra.ch

Persönliches Portfolio von Enis Shorra: Next.js 16 (App Router), React 19, TypeScript, gehostet auf Vercel.

```bash
npm ci
npm run dev        # http://localhost:3000
npm test           # Vitest
npm run build
```

## Admin (`/admin`)

Verwaltung von Projekten und Blogposts, dazu ein Dashboard mit Live-Status der Website und Deployment-Infos.

**Anmeldung.** Das Passwort wird nie im Klartext gespeichert, nur als scrypt-Hash (N=2^17, r=8, p=1) in `ADMIN_PASSWORD_HASH`. Geprüft wird es ausschließlich serverseitig in `POST /api/admin/login`: zeitkonstanter Vergleich, höchstens 5 Fehlversuche pro 15 Minuten und IP. Nach dem Login gibt es ein **JWT** (HS256, RFC 7519) im Cookie `__Host-admin_session` (HttpOnly, Secure, SameSite=Strict). Es gilt **15 Minuten** und wird nicht verlängert; danach ist eine neue Anmeldung nötig. Der Admin zeigt die verbleibende Zeit an, und läuft sie beim Schreiben ab, bleiben die Eingaben im Formular erhalten. Der Signaturschlüssel wird aus `SESSION_SECRET` und dem Passwort-Hash abgeleitet. Ein neues Passwort oder ein neues Secret meldet deshalb alle Sessions ab.

**Zugriffsschutz auf zwei Ebenen.** `proxy.ts` leitet ohne gültige Session auf `/admin/login` um bzw. antwortet mit 401. Zusätzlich prüft jede Admin-Seite (`requireAdmin`) und jede Admin-API-Route die Session selbst. Schreibende Requests von fremden Origins werden mit 403 abgelehnt.

Zugangsdaten erzeugen:

```bash
npm run admin:credentials -- --vercel
```

Das Skript fragt das Passwort verdeckt ab und schreibt `ADMIN_PASSWORD_HASH` und `SESSION_SECRET` direkt in Vercel (Production), ohne sie anzuzeigen. Danach Production neu deployen. Ohne `--vercel` gibt es beide Werte aus, etwa für `.env.local` (nie committen). Ein vergessenes Passwort lässt sich nicht wiederherstellen, einfach neu setzen.

**Status-Bericht.** Das Dashboard prüft bei jedem Aufruf live: Startseite, Blog-Übersicht, einen Blogpost, eine Projektseite, `robots.txt`, `sitemap.xml`, die Datenbank (Ping), den Mailversand (Absender-Domain bei Resend verifiziert), die Login-Konfiguration und dass die Admin-API ohne Anmeldung 401 liefert.

## Inhalte

Öffentlich: Projekt-Archiv auf der Startseite, `/blog` (Übersicht), `/blog/<slug>` und `/projects/<slug>`. `/projects` leitet auf das Archiv der Startseite um.


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
| `KV_REST_API_URL`, `KV_REST_API_TOKEN` | zum Bearbeiten | werden beim Verbinden der Upstash-Datenbank automatisch gesetzt (nur Production verbunden, damit Previews und lokale Tests nie echte Inhalte ändern) |
| `RESEND_API_KEY`, `RESEND_EMAIL_DOMAIN` | Kontaktformular | Versand über Resend |
| `CONTACT_EMAIL` | optional | Empfänger des Kontaktformulars |
| `LASTFM_API_KEY`, `LASTFM_USERNAME` | optional | `/api/lastfm`, derzeit von keiner Seite genutzt |

Vorlage: `.env.example`. Keine dieser Variablen darf mit `NEXT_PUBLIC_` beginnen.

## Deployment (Vercel)

1. `npm run admin:credentials -- --vercel` ausführen (setzt `ADMIN_PASSWORD_HASH` und `SESSION_SECRET` in Production).
2. Vercel → Storage → Upstash for Redis (Tarif Free, Auto-Upgrade aus) mit dem Projekt verbinden. Das setzt die `KV_*`-Variablen.
3. Neu deployen (Push auf `main` oder „Redeploy"), damit die Variablen greifen.
4. `https://enisshorra.ch/admin` öffnen und anmelden.
