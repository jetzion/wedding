import { z } from "zod";

const name = z.string().trim().max(80);

export const invitationSchema = z.object({
  name: z.string().trim().min(1, "Enter an invitation name.").max(120),
  contactEmail: z.union([z.literal(""), z.email("Enter a valid email or leave it blank.")]),
  guests: z
    .array(z.object({ id: z.uuid().optional(), firstName: name.min(1), lastName: name.min(1) }))
    .min(1, "Add at least one person.")
    .max(20),
  removeIds: z.array(z.uuid()),
  plusOne: z.boolean(),
});

export type InvitationInput = z.infer<typeof invitationSchema>;

type Result = { ok: true; data: InvitationInput } | { ok: false; error: string };

/**
 * Read the invitation form. Each person row has a first name, last name, and
 * a guest id (blank for new people). New rows left fully blank are skipped;
 * a row with only a first or last name is an error, because guests look up
 * their invitation by both names. Existing guests are removed only through
 * their "remove" checkbox, never by blanking their name.
 */
export function parseInvitationForm(form: FormData): Result {
  const values = (key: string) => form.getAll(key).map((v) => String(v).trim());
  const [firstNames, lastNames, ids] = [values("firstName"), values("lastName"), values("guestId")];
  const removeIds = values("remove");
  const rows = firstNames.map((firstName, i) => ({
    id: ids[i] || undefined,
    firstName,
    lastName: lastNames[i] ?? "",
  }));
  const kept = rows.filter((r) => !(r.id && removeIds.includes(r.id)));
  const filled = kept.filter((r) => r.id || r.firstName || r.lastName);
  if (filled.some((r) => !r.firstName || !r.lastName)) {
    return { ok: false, error: "Enter both a first and last name for each person." };
  }

  const parsed = invitationSchema.safeParse({
    name: String(form.get("name") ?? ""),
    contactEmail: String(form.get("contactEmail") ?? "").trim(),
    guests: filled,
    removeIds,
    plusOne: form.get("plusOne") === "on",
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  return { ok: true, data: parsed.data };
}
