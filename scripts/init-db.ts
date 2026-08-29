/**
 * Run once after provisioning Vercel Postgres:
 *   npm run db:init
 * (needs POSTGRES_URL in your local .env — `vercel env pull` gets it)
 */
import { sql } from "@vercel/postgres";

async function main() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  // Safe to run even if the table already existed before this column was added.
  await sql`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'client';
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS documents (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      blob_url TEXT NOT NULL,
      uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;

  // Safe to run even if the table already existed before this column was added.
  await sql`
    ALTER TABLE documents ADD COLUMN IF NOT EXISTS answers JSONB;
  `;

  // "kind" is the stable identifier used to look up a client's documents
  // (e.g. 'Food Diary'), independent of "title" — which, once a client can
  // submit a Food Diary or Temperature Record more than once, starts
  // varying per round ("Food Diary — Round 2") for display. Existing rows
  // predate rounds, so title and kind are identical for them; backfill
  // kind from title once, then leave both to diverge going forward.
  await sql`
    ALTER TABLE documents ADD COLUMN IF NOT EXISTS kind TEXT;
  `;
  await sql`
    UPDATE documents SET kind = title WHERE kind IS NULL;
  `;

  // Which submission this is for document types a client may repeat
  // (Food Diary, Temperature Record) — defaults to 1 so existing rows are
  // unaffected. Health History stays single-instance and always round 1.
  await sql`
    ALTER TABLE documents ADD COLUMN IF NOT EXISTS round INTEGER NOT NULL DEFAULT 1;
  `;

  console.log("Tables ready: users, documents");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
