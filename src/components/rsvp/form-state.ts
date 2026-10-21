import type { Invitation, InvitationGuest, RsvpStatus } from "@/lib/rsvp/types";

export type GuestState = {
  id: string;
  firstName: string;
  lastName: string;
  dietaryRestrictions: string;
  accessibilityNeeds: string;
  responses: Record<string, RsvpStatus | undefined>;
};

export type FormState = { guests: GuestState[]; contactEmail: string; message: string };

/** Start from the household's saved answers, if any. */
export function initialFormState(invitation: Invitation): FormState {
  return {
    guests: invitation.guests.map((g) => ({
      id: g.id,
      firstName: g.firstName ?? "",
      lastName: g.lastName ?? "",
      dietaryRestrictions: g.dietaryRestrictions ?? "",
      accessibilityNeeds: g.accessibilityNeeds ?? "",
      responses: Object.fromEntries(g.eventIds.map((e) => [e, invitation.responses[g.id]?.[e]])),
    })),
    contactEmail: invitation.contactEmail ?? "",
    message: invitation.message ?? "",
  };
}

export const isAttending = (guest: GuestState) => Object.values(guest.responses).includes("attending");

/** Quick checks before review. The server repeats all checks on submit. */
export function formErrors(invitation: Invitation, state: FormState): string[] {
  const errors: string[] = [];
  state.guests.forEach((guest, i) => {
    const invited = invitation.guests[i];
    const name = displayName(invited, guest);
    if (Object.values(guest.responses).some((r) => !r)) errors.push(`Please answer every event for ${name}.`);
    if (invited.isPlusOne && isAttending(guest) && !guest.firstName.trim()) {
      errors.push("Please enter your guest's first name.");
    }
  });
  if (!/^\S+@\S+\.\S+$/.test(state.contactEmail.trim())) errors.push("Please enter a valid email address.");
  return errors;
}

export function displayName(invited: InvitationGuest, guest?: GuestState) {
  const first = guest?.firstName.trim() || invited.firstName;
  const last = guest?.lastName.trim() || invited.lastName;
  if (invited.isPlusOne && !first) return "Your guest";
  return [first, last].filter(Boolean).join(" ");
}

/** The payload for submitRsvp. */
export function toSubmission(state: FormState) {
  return {
    guests: state.guests.map((g) => ({ ...g, responses: g.responses as Record<string, RsvpStatus> })),
    contactEmail: state.contactEmail.trim(),
    message: state.message,
  };
}
