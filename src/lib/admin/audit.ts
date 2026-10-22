import "server-only";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { auditLog } from "@/db/schema";
import { requireAdmin } from "@/lib/admin/session";

export type AuditAction =
  | "invitation.create"
  | "invitation.update"
  | "invitation.delete"
  | "invitation.new_link"
  | "rsvp.correct"
  | "export.csv";

/**
 * The insert for one audit record, to run inside the same db.batch as the
 * change it describes, so both are saved or neither is. Build summaries with
 * src/lib/admin/audit-summary.ts.
 */
export function auditEntry(actorEmail: string, action: AuditAction, targetId: string | null, summary: string) {
  return db.insert(auditLog).values({ actorEmail, action, targetId, summary });
}

/** The latest audit records, newest first. Admins only. */
export async function listAuditLog(limit = 200) {
  await requireAdmin();
  return db.select().from(auditLog).orderBy(desc(auditLog.at)).limit(limit);
}
