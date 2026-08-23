/**
 * Promotes an existing account to the 'practitioner' role, giving it
 * access to /portal/admin (view all clients' documents).
 *
 * Usage:
 *   npm run set-role -- jen@example.com practitioner
 *
 * The account must already exist — have them sign up through the normal
 * portal signup form first, then run this once to grant access.
 */
import { sql } from "@vercel/postgres";

async function main() {
  const [, , email, role] = process.argv;

  if (!email || !role) {
    console.error("Usage: npm run set-role -- <email> <client|practitioner>");
    process.exit(1);
  }

  if (role !== "client" && role !== "practitioner") {
    console.error('Role must be "client" or "practitioner"');
    process.exit(1);
  }

  const result = await sql`
    UPDATE users SET role = ${role} WHERE email = ${email}
    RETURNING id, name, email, role;
  `;

  if (result.rows.length === 0) {
    console.error(`No account found for ${email} — they need to sign up first.`);
    process.exit(1);
  }

  console.log("Updated:", result.rows[0]);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
