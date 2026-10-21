import { z } from "zod";
import type { Invitation } from "@/lib/rsvp/types";

const optionalText = (max: number) => z.string().trim().max(max).optional().default("");

export const submissionSchema = z.object({
  guests: z
    .array(
      z.object({
        id: z.uuid(),
        firstName: optionalText(80),
        lastName: optionalText(80),
        dietaryRestrictions: optionalText(500),
        accessibilityNeeds: optionalText(500),
        responses: z.record(z.uuid(), z.enum(["attending", "declined"])),
      }),
    )
    .min(1)
    .max(20),
  contactEmail: z.email().trim().max(200),
  message: optionalText(1000),
});

export type Submission = z.infer<typeof submissionSchema>;

type Result = { ok: true; data: Submission } | { ok: false; error: string };

/**
 * Check a submission against the household's own invitation. Rejects unknown
 * guests, missing or extra events, and attending plus-ones without a name.
 */
export function validateSubmission(invitation: Invitation, input: unknown): Result {
  const parsed = submissionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please check the form and try again." };
  const data = parsed.data;

  if (invitation.deadlinePassed) {
    return { ok: false, error: "The RSVP deadline has passed." };
  }

  const submittedIds = data.guests.map((g) => g.id).sort();
  const invitedIds = invitation.guests.map((g) => g.id).sort();
  if (submittedIds.join() !== invitedIds.join()) {
    return { ok: false, error: "Please answer for every guest on your invitation." };
  }

  for (const guest of data.guests) {
    const invited = invitation.guests.find((g) => g.id === guest.id)!;
    const answered = Object.keys(guest.responses).sort().join();
    if (answered !== [...invited.eventIds].sort().join()) {
      return { ok: false, error: "Please answer for every event." };
    }
    const attending = Object.values(guest.responses).includes("attending");
    if (invited.isPlusOne && attending && !guest.firstName) {
      return { ok: false, error: "Please enter your guest's name." };
    }
  }

  return { ok: true, data };
}
