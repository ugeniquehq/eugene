import { sql } from "@vercel/postgres";
import { isIntakeComplete } from "@/lib/intake-completion";
import type { IntakeAnswers } from "@/lib/intake-answers";

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

export type ClientDetail = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  document_count: number;
  first_name: string;
  last_name: string;
  intake_date: string | null;
  intake_started: boolean;
  intake_complete: boolean;
};

// Splits a single stored "name" field into a best-guess first/last pair.
// Used as a fallback for clients who signed up before the intake form
// captured first/last name separately (or haven't completed intake yet).
function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return { first: fullName, last: "" };
  return { first: parts[0], last: parts.slice(1).join(" ") };
}

/**
 * All client accounts with the fields the admin client list sorts and
 * filters by: name (split first/last, preferring what they entered on
 * their Health History intake over the single name captured at signup),
 * email, phone, document count, and their intake date — the
 * personal.dateOfJoining value captured the first time they opened the
 * Health History form, which (unlike uploaded_at) doesn't change if they
 * later edit their answers.
 */
export async function getAllClientsDetailed(): Promise<ClientDetail[]> {
  const { rows } = await sql<{
    id: string;
    name: string;
    email: string;
    document_count: number;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    intake_date: string | null;
    health_answers: IntakeAnswers | null;
  }>`
    SELECT
      u.id,
      u.name,
      u.email,
      COUNT(DISTINCT d.id)::int AS document_count,
      hh.answers->'personal'->>'firstName' AS first_name,
      hh.answers->'personal'->>'lastName' AS last_name,
      hh.answers->'personal'->>'phone' AS phone,
      hh.answers->'personal'->>'dateOfJoining' AS intake_date,
      hh.answers AS health_answers
    FROM users u
    LEFT JOIN documents d ON d.user_id = u.id
    LEFT JOIN documents hh ON hh.user_id = u.id AND hh.title = 'Health History'
    WHERE u.role = 'client'
    GROUP BY u.id, u.name, u.email, hh.answers
    ORDER BY u.name ASC;
  `;

  return rows.map((row) => {
    const fallback = splitName(row.name);
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      document_count: row.document_count,
      first_name: row.first_name || fallback.first,
      last_name: row.last_name || fallback.last,
      intake_date: row.intake_date,
      intake_started: row.health_answers != null,
      intake_complete: isIntakeComplete(row.health_answers),
    };
  });
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
  round: number;
  uploaded_at: string;
};

// A client may run the Food Diary more than once (e.g. a 6- or 12-month
// re-check) — each run is a "round", stored as its own row rather than
// overwriting the last one. "Food Diary" is round 1's display title, for
// continuity with rows saved before rounds existed; later rounds are
// labelled "Food Diary — Round N" so admin's plain document list can tell
// them apart. All rounds share kind = 'Food Diary' for lookups.
function foodDiaryTitle(round: number): string {
  return round <= 1 ? "Food Diary" : `Food Diary — Round ${round}`;
}

/** Every Food Diary round a client has saved, oldest first. */
export async function getFoodDiaryRoundsForUser(userId: string): Promise<FoodDiaryDoc[]> {
  const { rows } = await sql<FoodDiaryDoc>`
    SELECT id, blob_url, answers, round, uploaded_at
    FROM documents
    WHERE user_id = ${userId} AND kind = 'Food Diary'
    ORDER BY round ASC;
  `;
  return rows;
}

/** A specific round, or (when omitted) the most recent one the client has saved. */
export async function getFoodDiaryForUser(userId: string, round?: number): Promise<FoodDiaryDoc | null> {
  if (round) {
    const { rows } = await sql<FoodDiaryDoc>`
      SELECT id, blob_url, answers, round, uploaded_at
      FROM documents
      WHERE user_id = ${userId} AND kind = 'Food Diary' AND round = ${round}
      LIMIT 1;
    `;
    return rows[0] ?? null;
  }
  const { rows } = await sql<FoodDiaryDoc>`
    SELECT id, blob_url, answers, round, uploaded_at
    FROM documents
    WHERE user_id = ${userId} AND kind = 'Food Diary'
    ORDER BY round DESC
    LIMIT 1;
  `;
  return rows[0] ?? null;
}

export async function insertFoodDiary(
  userId: string,
  blobUrl: string,
  answers: Record<string, unknown>,
  round: number
): Promise<void> {
  await sql`
    INSERT INTO documents (user_id, title, kind, blob_url, answers, round)
    VALUES (${userId}, ${foodDiaryTitle(round)}, 'Food Diary', ${blobUrl}, ${JSON.stringify(answers)}, ${round});
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
  round: number;
  uploaded_at: string;
};

// Same "rounds" pattern as the Food Diary above — a client may be asked to
// repeat the 14-day temperature record months later, so each run is its
// own row rather than overwriting the last one.
function temperatureRecordTitle(round: number): string {
  return round <= 1 ? "Temperature Record" : `Temperature Record — Round ${round}`;
}

/** Every Temperature Record round a client has saved, oldest first. */
export async function getTemperatureRecordRoundsForUser(userId: string): Promise<TemperatureRecordDoc[]> {
  const { rows } = await sql<TemperatureRecordDoc>`
    SELECT id, blob_url, answers, round, uploaded_at
    FROM documents
    WHERE user_id = ${userId} AND kind = 'Temperature Record'
    ORDER BY round ASC;
  `;
  return rows;
}

/** A specific round, or (when omitted) the most recent one the client has saved. */
export async function getTemperatureRecordForUser(userId: string, round?: number): Promise<TemperatureRecordDoc | null> {
  if (round) {
    const { rows } = await sql<TemperatureRecordDoc>`
      SELECT id, blob_url, answers, round, uploaded_at
      FROM documents
      WHERE user_id = ${userId} AND kind = 'Temperature Record' AND round = ${round}
      LIMIT 1;
    `;
    return rows[0] ?? null;
  }
  const { rows } = await sql<TemperatureRecordDoc>`
    SELECT id, blob_url, answers, round, uploaded_at
    FROM documents
    WHERE user_id = ${userId} AND kind = 'Temperature Record'
    ORDER BY round DESC
    LIMIT 1;
  `;
  return rows[0] ?? null;
}

export async function insertTemperatureRecord(
  userId: string,
  blobUrl: string,
  answers: Record<string, unknown>,
  round: number
): Promise<void> {
  await sql`
    INSERT INTO documents (user_id, title, kind, blob_url, answers, round)
    VALUES (${userId}, ${temperatureRecordTitle(round)}, 'Temperature Record', ${blobUrl}, ${JSON.stringify(answers)}, ${round});
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