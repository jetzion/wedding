import "server-only";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { households } from "@/db/schema";
import { isLinkName, normalizeLinkName } from "@/lib/invitation-link";

/**
 * The invitation a link points to, for the public invitation page. Returns the
 * invitation's name only, never its guests or answers, or null when the link is
 * malformed, replaced, or deleted. Not cached, so a replaced link stops working
 * at once.
 */
export async function getInvitationByLinkName(linkName: string): Promise<{ name: string } | null> {
  const normalized = normalizeLinkName(linkName);
  if (!isLinkName(normalized)) return null;
  const [row] = await db
    .select({ name: households.name })
    .from(households)
    .where(eq(households.linkName, normalized));
  return row ?? null;
}
