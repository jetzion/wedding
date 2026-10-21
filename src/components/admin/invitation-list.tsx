import Link from "next/link";
import { cardClass } from "@/components/rsvp/fields";
import type { AdminInvitation } from "@/lib/admin/invitations";
import { type GuestStatus, summarize } from "@/lib/admin/status";

const statusStyle: Record<GuestStatus, { label: string; className: string }> = {
  attending: { label: "Attending", className: "bg-sea text-shell" },
  declined: { label: "Declined", className: "bg-coral/15 text-coral" },
  awaiting: { label: "Awaiting response", className: "border border-sand-edge text-ink-muted" },
};

function StatusBadge({ status }: { status: GuestStatus }) {
  const { label, className } = statusStyle[status];
  return <span className={`shrink-0 rounded-full px-3 py-1 text-sm ${className}`}>{label}</span>;
}

/** Totals across all invitations. */
export function InvitationSummary({ invitations }: { invitations: AdminInvitation[] }) {
  const totals = summarize(invitations);
  const items = [
    ["Invitations", totals.invitations],
    ["Guests", totals.guests],
    ["Attending", totals.attending],
    ["Declined", totals.declined],
    ["Awaiting", totals.awaiting],
  ] as const;

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {items.map(([label, value]) => (
        <div key={label} className={`${cardClass} text-center sm:p-5`}>
          <dt className="text-sm uppercase tracking-[0.15em] text-ink-muted">{label}</dt>
          <dd className="font-serif text-3xl">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** One card per invitation, listing each person and their RSVP status. */
export function InvitationList({ invitations, timezone }: { invitations: AdminInvitation[]; timezone: string }) {
  if (!invitations.length) return <p className="text-center text-ink-muted">No invitations yet.</p>;

  return (
    <ul className="space-y-4">
      {invitations.map((invitation) => (
        <li key={invitation.id} className={`${cardClass} space-y-4`}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-serif text-2xl">{invitation.name}</h2>
            <p className="text-sm text-ink-muted">
              {invitation.respondedAt
                ? `Responded ${invitation.respondedAt.toLocaleDateString("en-US", { timeZone: timezone, dateStyle: "medium" })}`
                : "No response yet"}
            </p>
          </div>

          <ul className="divide-y divide-sand-edge">
            {invitation.guests.map((guest) => (
              <li key={guest.id} className="flex items-start justify-between gap-3 py-2">
                <div>
                  <p>{guest.name}</p>
                  {guest.dietaryRestrictions && (
                    <p className="text-sm text-ink-muted">Dietary: {guest.dietaryRestrictions}</p>
                  )}
                  {guest.accessibilityNeeds && (
                    <p className="text-sm text-ink-muted">Accessibility: {guest.accessibilityNeeds}</p>
                  )}
                </div>
                <StatusBadge status={guest.status} />
              </li>
            ))}
          </ul>

          {(invitation.contactEmail || invitation.confirmationCode || invitation.message) && (
            <dl className="grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
              {invitation.contactEmail && (
                <>
                  <dt className="text-ink-muted">Email</dt>
                  <dd className="break-all">{invitation.contactEmail}</dd>
                </>
              )}
              {invitation.confirmationCode && (
                <>
                  <dt className="text-ink-muted">Confirmation</dt>
                  <dd>{invitation.confirmationCode}</dd>
                </>
              )}
              {invitation.message && (
                <>
                  <dt className="text-ink-muted">Note</dt>
                  <dd>{invitation.message}</dd>
                </>
              )}
            </dl>
          )}

          <p className="flex justify-end gap-4 text-sm">
            <Link href={`/admin/invitations/${invitation.id}/rsvp`} className="text-sea underline">
              Correct RSVP
            </Link>
            <Link href={`/admin/invitations/${invitation.id}/edit`} className="text-sea underline">
              Edit
            </Link>
            <Link href={`/admin/invitations/${invitation.id}/delete`} className="text-coral underline">
              Delete
            </Link>
          </p>
        </li>
      ))}
    </ul>
  );
}
