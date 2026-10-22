import { Suspense } from "react";
import Link from "next/link";
import { cardClass } from "@/components/rsvp/fields";
import { type AuditAction, listAuditLog } from "@/lib/admin/audit";
import { getWeddingSettings } from "@/lib/settings";

const ACTION_LABEL: Record<AuditAction, string> = {
  "invitation.create": "Added invitation",
  "invitation.update": "Edited invitation",
  "invitation.delete": "Deleted invitation",
  "invitation.new_link": "New invitation link",
  "rsvp.correct": "Corrected RSVP",
  "export.csv": "Exported CSV",
};

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <h1 className="text-center font-serif text-4xl">Activity</h1>
      <p className="text-center text-ink-muted">Recent admin changes and exports, newest first.</p>
      <Suspense fallback={<p className="text-center text-ink-muted">Loading…</p>}>
        <ActivityList />
      </Suspense>
      <p className="text-center">
        <Link href="/admin" className="text-sea underline">
          Back to invitations
        </Link>
      </p>
    </div>
  );
}

/** Admin-only list. listAuditLog checks the admin session. */
async function ActivityList() {
  const [entries, { timezone }] = await Promise.all([listAuditLog(), getWeddingSettings()]);
  if (!entries.length) return <p className="text-center text-ink-muted">No activity yet.</p>;

  return (
    <ul className={`${cardClass} divide-y divide-sand-edge py-2 sm:py-2`}>
      {entries.map((entry) => (
        <li key={entry.id} className="space-y-1 py-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3">
            <p className="font-medium">{ACTION_LABEL[entry.action as AuditAction] ?? entry.action}</p>
            <time dateTime={entry.at.toISOString()} className="text-sm text-ink-muted">
              {entry.at.toLocaleString("en-US", { timeZone: timezone, dateStyle: "medium", timeStyle: "short" })}
            </time>
          </div>
          <p>{entry.summary}</p>
          <p className="text-sm text-ink-muted">by {entry.actorEmail}</p>
        </li>
      ))}
    </ul>
  );
}
