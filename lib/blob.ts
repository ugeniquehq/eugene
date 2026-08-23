import { put } from "@vercel/blob";

/**
 * Uploads a client document (e.g. a generated intake .docx) to Vercel Blob
 * and returns the public URL to store alongside the record in Postgres.
 */
export async function uploadClientDocument(
  fileName: string,
  file: Buffer | Blob
) {
  const blob = await put(`clients/${fileName}`, file, {
    access: "public",
    addRandomSuffix: true,
  });
  return blob.url;
}
