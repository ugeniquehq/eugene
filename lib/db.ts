import { sql } from "@vercel/postgres";

export { sql };

export type ClientUser = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
};

export type ClientDocument = {
  id: string;
  user_id: string;
  title: string;
  blob_url: string;
  uploaded_at: string;
};

export type ClientSummary = {
  id: string;
  name: string;
  email: string;
  document_count: number;
};

export async function getUserByEmail(email: string): Promise<ClientUser | null> {
  const { rows } = await sql<ClientUser>`
    SELECT id, name, email, password_hash, role, created_at
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

/** Unscoped lookup — only call this after confirming the caller is a practitioner. */
export async function getDocumentById(documentId: string): Promise<ClientDocument | null> {
  const { rows } = await sql<ClientDocument>`
    SELECT id, user_id, title, blob_url, uploaded_at
    FROM documents
    WHERE id = ${documentId}
    LIMIT 1;
  `;
  return rows[0] ?? null;
}

/** All client accounts (excludes practitioners), with how many documents each has on file. */
export async function getAllClients(): Promise<ClientSummary[]> {
  const { rows } = await sql<ClientSummary>`
    SELECT
      u.id,
      u.name,
      u.email,
      COUNT(d.id)::int AS document_count
    FROM users u
    LEFT JOIN documents d ON d.user_id = u.id
    WHERE u.role = 'client'
    GROUP BY u.id, u.name, u.email
    ORDER BY u.name ASC;
  `;
  return rows;
}

export type HealthHistoryDoc = {
  id: string;
  blob_url: string;
  answers: Record<string, unknown> | null;
};

export async function getHealthHistoryForUser(userId: string): Promise<HealthHistoryDoc | null> {
  const { rows } = await sql<HealthHistoryDoc>`
    SELECT id, blob_url, answers
    FROM documents
    WHERE user_id = ${userId} AND title = 'Health History'
    LIMIT 1;
  `;
  return rows[0] ?? null;
}

export async function insertHealthHistory(
  userId: string,
  blobUrl: string,
  answers: Record<string, unknown>
): Promise<void> {
  await sql`
    INSERT INTO documents (user_id, title, blob_url, answers)
    VALUES (${userId}, 'Health History', ${blobUrl}, ${JSON.stringify(answers)});
  `;
}

export async function updateHealthHistory(
  documentId: string,
  blobUrl: string,
  answers: Record<string, unknown>
): Promise<void> {
  await sql`
    UPDATE documents
    SET blob_url = ${blobUrl}, answers = ${JSON.stringify(answers)}, uploaded_at = now()
    WHERE id = ${documentId};
  `;
}

export async function getClientById(userId: string): Promise<Pick<ClientUser, "id" | "name" | "email"> | null> {
  const { rows } = await sql<Pick<ClientUser, "id" | "name" | "email">>`
    SELECT id, name, email
    FROM users
    WHERE id = ${userId} AND role = 'client'
    LIMIT 1;
  `;
  return rows[0] ?? null;
}
export type FoodDiaryDoc = {
  id: string;
  blob_url: string;
  answers: Record<string, unknown> | null;
};

export async function getFoodDiaryForUser(userId: string): Promise<FoodDiaryDoc | null> {
  const { rows } = await sql<FoodDiaryDoc>`
    SELECT id, blob_url, answers
    FROM documents
    WHERE user_id = ${userId} AND title = 'Food Diary'
    LIMIT 1;
  `;
  return rows[0] ?? null;
}

export async function insertFoodDiary(
  userId: string,
  blobUrl: string,
  answers: Record<string, unknown>
): Promise<void> {
  await sql`
    INSERT INTO documents (user_id, title, blob_url, answers)
    VALUES (${userId}, 'Food Diary', ${blobUrl}, ${JSON.stringify(answers)});
  `;
}

export async function updateFoodDiary(
  documentId: string,
  blobUrl: string,
  answers: Record<string, unknown>
): Promise<void> {
  await sql`
    UPDATE documents
    SET blob_url = ${blobUrl}, answers = ${JSON.stringify(answers)}, uploaded_at = now()
    WHERE id = ${documentId};
  `;
}
export type TemperatureRecordDoc = {
  id: string;
  blob_url: string;
  answers: Record<string, unknown> | null;
};

export async function getTemperatureRecordForUser(userId: string): Promise<TemperatureRecordDoc | null> {
  const { rows } = await sql<TemperatureRecordDoc>`
    SELECT id, blob_url, answers
    FROM documents
    WHERE user_id = ${userId} AND title = 'Temperature Record'
    LIMIT 1;
  `;
  return rows[0] ?? null;
}

export async function insertTemperatureRecord(
  userId: string,
  blobUrl: string,
  answers: Record<string, unknown>
): Promise<void> {
  await sql`
    INSERT INTO documents (user_id, title, blob_url, answers)
    VALUES (${userId}, 'Temperature Record', ${blobUrl}, ${JSON.stringify(answers)});
  `;
}

export async function updateTemperatureRecord(
  documentId: string,
  blobUrl: string,
  answers: Record<string, unknown>
): Promise<void> {
  await sql`
    UPDATE documents
    SET blob_url = ${blobUrl}, answers = ${JSON.stringify(answers)}, uploaded_at = now()
    WHERE id = ${documentId};
  `;
}