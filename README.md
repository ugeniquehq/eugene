# Well Adjusted

Marketing site + client portal for Dr. Jen's practice. Next.js 14 (App
Router) + TypeScript, Auth.js for accounts, Vercel Postgres for records,
Vercel Blob for client documents.

## What's here

- `app/` — pages: home, about, contact, portal login, portal dashboard
- `components/` — Nav, Footer, AlignmentLine (the signature scroll element)
- `auth.ts` — Auth.js config (Credentials provider)
- `lib/db.ts` — Postgres queries
- `lib/blob.ts` — file upload helper for client documents
- `scripts/init-db.ts` — creates the `users` and `documents` tables

Branding is placeholder — every color/font lives in `app/globals.css` as a
CSS variable, so swapping in Jen's real logo and palette is a find-and-
replace, not a rebuild.

## 1. Open in VS Code

```bash
cd well-adjusted
npm install
```

## 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial scaffold"
gh repo create well-adjusted --private --source=. --push
# or create the repo on github.com and:
# git remote add origin <your-repo-url>
# git push -u origin main
```

## 3. Connect to Vercel

- Import the GitHub repo at vercel.com/new
- In the Vercel project, go to **Storage** and create:
  - A **Postgres** database (Neon-backed)
  - A **Blob** store
- Both automatically add their env vars (`POSTGRES_URL`, `BLOB_READ_WRITE_TOKEN`, etc.) to the project.
- Add one more env var yourself: `AUTH_SECRET` — generate with `npx auth secret`.

## 4. Pull env vars locally and set up the database

```bash
vercel link
vercel env pull .env.local
npm run db:init
```

## 5. Run locally

```bash
npm run dev
```

## Deploying

Push to `main` — Vercel auto-deploys. It'll be live on your `*.vercel.app`
domain; attach Jen's real domain later from the Vercel project's **Domains**
tab.

## A note on Next.js version

This uses Next 14.2.35 to match your other projects. `npm audit` currently
flags several advisories only patched in Next 15/16 (mostly DoS and cache-
related, not auth-bypass). Since this site will hold real client health
data, it's worth deciding once whether to stay on 14.x for consistency or
upgrade — not urgent before launch, but worth revisiting before the portal
holds real records.

## Next steps

- Swap placeholder copy on the About and Contact pages for Jen's real bio, services, and hours
- Replace the placeholder palette in `app/globals.css` once branding files arrive
- Decide how documents land in a client's portal — likely: reuse the existing intake-form `.docx` generator, then `uploadClientDocument()` from `lib/blob.ts` and insert a row into `documents`
- Contact form currently doesn't send anywhere — wire to an email provider (e.g. Resend) or a booking tool once chosen
