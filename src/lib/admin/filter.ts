import type { GuestStatus } from "@/lib/admin/status";

export type InvitationFilter = { q: string; status: GuestStatus | "" };

const STATUSES: GuestStatus[] = ["attending", "declined", "awaiting"];

type Filterable = {
  name: string;
  contactEmail: string | null;
  guests: { name: string; status: GuestStatus }[];
};

/** Read the filter from URL search params, ignoring unknown values. */
export function readFilter(params: Record<string, string | string[] | undefined>): InvitationFilter {
  const first = (v: string | string[] | undefined) => String([v].flat()[0] ?? "").trim();
  const status = first(params.status);
  return { q: first(params.q).slice(0, 100), status: STATUSES.find((s) => s === status) ?? "" };
}

/**
 * Invitations matching the search text (invitation name, any guest's name,
 * or contact email; case-insensitive) and having at least one guest with the
 * chosen status.
 */
export function filterInvitations<T extends Filterable>(invitations: T[], { q, status }: InvitationFilter): T[] {
  const needle = q.toLowerCase();
  return invitations.filter((i) => {
    const text = [i.name, i.contactEmail ?? "", ...i.guests.map((g) => g.name)].join("\n").toLowerCase();
    return text.includes(needle) && (!status || i.guests.some((g) => g.status === status));
  });
}
