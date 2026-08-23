import { sql } from "@vercel/postgres";

export { sql };

export type ClientUser = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
};

export type ClientDocument = {
  id: string;
  user_id: string;
  title: string;
  blob_url: string;
  uploaded_at: string;
};

export async function getUserByEmail(email: string): Promise<ClientUser | null> {
  const { rows } = await sql<ClientUser>`
    SELECT id, name, email, password_hash, created_at
    FROM users
    WHERE email = ${email}
    LIMIT 1;
  `;
  return rows[0] ?? null;
}

export async function getDocumentsForUser(userId: string): Promise<ClientDocument[]> {
  const { rows } = await sql<ClientDocument>`
    SELECT id, user_id, title, blob_url, uploaded_at
    FROM documents
    WHERE user_id = ${userId}
    ORDER BY uploaded_at DESC;
  `;
  return rows;
}

export async function getDocumentForUser(
  documentId: string,
  userId: string
): Promise<ClientDocument | null> {
  const { rows } = await sql<ClientDocument>`
    SELECT id, user_id, title, blob_url, uploaded_at
    FROM documents
    WHERE id = ${documentId} AND user_id = ${userId}
    LIMIT 1;
  `;
  return rows[0] ?? null;
}
