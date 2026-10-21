export type RsvpStatus = "attending" | "declined";

export type InvitationGuest = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  isPlusOne: boolean;
  eventIds: string[];
  dietaryRestrictions: string | null;
  accessibilityNeeds: string | null;
};

export type InvitationEvent = {
  id: string;
  name: string;
  /** ISO start time, or null while the event is unpublished. */
  startsAt: string | null;
};

/** Everything one household may see about its own invitation. */
export type Invitation = {
  householdName: string;
  guests: InvitationGuest[];
  events: InvitationEvent[];
  /** responses[guestId][eventId]; missing means awaiting response. */
  responses: Record<string, Record<string, RsvpStatus>>;
  contactEmail: string | null;
  message: string | null;
  confirmationCode: string | null;
  deadlinePassed: boolean;
  /** IANA timezone for displaying event times. */
  timezone: string;
};
