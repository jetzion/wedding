import { guestsCsv } from "@/lib/admin/csv";
import { auditEntry } from "@/lib/admin/audit";
import { exportSummary } from "@/lib/admin/audit-summary";
import { listInvitations } from "@/lib/admin/invitations";
import { requireAdmin } from "@/lib/admin/session";
import { getWeddingSettings } from "@/lib/settings";

/** Download every guest and RSVP status as CSV, and record the export. Admins only. */
export async function GET() {
  const { user } = await requireAdmin();
  const [invitations, settings] = await Promise.all([listInvitations(), getWeddingSettings()]);
  const guestCount = invitations.reduce((n, i) => n + i.guests.length, 0);
  await auditEntry(user.email, "export.csv", null, exportSummary(guestCount));
  const today = new Date().toLocaleDateString("en-CA", { timeZone: settings.timezone });

  return new Response(`﻿${guestsCsv(invitations, settings.timezone)}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="guests-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
