export type WeddingSettings = {
  coupleNames: string;
  firstNames: string[];
  /** IANA timezone for all wedding dates and the RSVP deadline. */
  timezone: string;
  /** ISO 8601 start of the ceremony. */
  weddingDate: string;
  /** ISO 8601 instant after which RSVPs can no longer be changed. */
  rsvpDeadline: string;
};

/** Wedding settings. Temporary values until the database is added (PLAN.md step 2). */
export async function getWeddingSettings(): Promise<WeddingSettings> {
  return {
    coupleNames: "Greg Garfinkel & Daniella Etzion",
    firstNames: ["Greg", "Daniella"],
    timezone: "America/New_York",
    // Placeholders until the real date and deadline are set.
    weddingDate: "2027-08-14T17:00:00-04:00",
    rsvpDeadline: "2027-06-01T23:59:00-04:00",
  };
}
