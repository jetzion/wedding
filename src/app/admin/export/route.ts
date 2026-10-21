import { guestsCsv } from "@/lib/admin/csv";
import { listInvitations } from "@/lib/admin/invitations";
import { requireAdmin } from "@/lib/admin/session";
import { getWeddingSettings } from "@/lib/settings";

/** Download every guest and RSVP status as CSV. Admins only. */
export async function GET() {
  await requireAdmin();
  const [invitations, settings] = await Promise.all([listInvitations(), getWeddingSettings()]);
  const today = new Date().toLocaleDateString("en-CA", { timeZone: settings.timezone });

  return new Response(`﻿${guestsCsv(invitations, settings.timezone)}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="guests-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
