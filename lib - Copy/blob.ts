import { put, del, issueSignedToken, presignUrl } from "@vercel/blob";

/**
 * Uploads a client document (e.g. a generated intake .docx) to Vercel Blob
 * as a PRIVATE object — appropriate for client health records, since
 * private blobs require authentication for every read, unlike public
 * blobs which are fetchable by anyone with the URL.
 *
 * Returns the pathname (not a fetchable URL) — store this in the database
 * and use getSignedDownloadUrl() whenever a client needs to actually open
 * the file, rather than linking to it directly.
 */
export async function uploadClientDocument(
  fileName: string,
  file: Buffer | Blob
): Promise<{ pathname: string }> {
  const blob = await put(`clients/${fileName}`, file, {
    access: "private",
    addRandomSuffix: true,
  });
  return { pathname: blob.pathname };
}

/**
 * Deletes a previously-uploaded document — used when a client updates
 * their health history, so the old version doesn't linger in storage.
 */
export async function deleteClientDocument(pathname: string): Promise<void> {
  await del(pathname);
}

/**
 * Generates a short-lived signed URL for downloading a private blob.
 * Call this fresh each time a document is opened — do not store or
 * reuse the result, since it expires quickly by design.
 */
export async function getSignedDownloadUrl(pathname: string): Promise<string> {
  const validUntil = Date.now() + 5 * 60 * 1000; // 5 minutes
  const token = await issueSignedToken({
    pathname,
    operations: ["get"],
    validUntil,
  });
  const { presignedUrl } = await presignUrl(token, {
    pathname,
    operation: "get",
    access: "private",
    validUntil,
  });
  return presignedUrl;
}
