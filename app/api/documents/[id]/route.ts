import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDocumentForUser } from "@/lib/db";
import { getSignedDownloadUrl } from "@/lib/blob";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const doc = await getDocumentForUser(params.id, session.user.id as string);
  if (!doc) {
    // Either it doesn't exist, or it belongs to someone else — same
    // response either way, so we don't leak which.
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  try {
    const signedUrl = await getSignedDownloadUrl(doc.blob_url);
    return NextResponse.redirect(signedUrl);
  } catch (err) {
    console.error("Failed to generate signed download URL:", err);
    return NextResponse.json({ error: "Could not open this document right now." }, { status: 500 });
  }
}
