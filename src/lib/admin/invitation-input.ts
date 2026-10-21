import { z } from "zod";

const name = z.string().trim().max(80);

export const invitationSchema = z.object({
  name: z.string().trim().min(1, "Enter an invitation name.").max(120),
  contactEmail: z.union([z.literal(""), z.email("Enter a valid email or leave it blank.")]),
  guests: z
    .array(z.object({ firstName: name.min(1), lastName: name.min(1) }))
    .min(1, "Add at least one person."),
  plusOne: z.boolean(),
});

export type InvitationInput = z.infer<typeof invitationSchema>;

type Result = { ok: true; data: InvitationInput } | { ok: false; error: string };

/**
 * Read the invitation form. Guest rows left fully blank are skipped; a row
 * with only a first or last name is an error, because guests look up their
 * invitation by both names.
 */
export function parseInvitationForm(form: FormData): Result {
  const firstNames = form.getAll("firstName").map((v) => String(v).trim());
  const lastNames = form.getAll("lastName").map((v) => String(v).trim());
  const rows = firstNames.map((firstName, i) => ({ firstName, lastName: lastNames[i] ?? "" }));
  const filled = rows.filter((r) => r.firstName || r.lastName);
  if (filled.some((r) => !r.firstName || !r.lastName)) {
    return { ok: false, error: "Enter both a first and last name for each person." };
  }

  const parsed = invitationSchema.safeParse({
    name: String(form.get("name") ?? ""),
    contactEmail: String(form.get("contactEmail") ?? "").trim(),
    guests: filled,
    plusOne: form.get("plusOne") === "on",
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  return { ok: true, data: parsed.data };
}
