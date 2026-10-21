import { randomInt } from "node:crypto";

/** No look-alike characters (0/O, 1/I/L) so references are easy to read. */
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

/** A new RSVP confirmation reference, e.g. "GD-8KQ2ZP". */
export function generateConfirmationCode() {
  return `GD-${Array.from({ length: 6 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("")}`;
}

/**
 * Pick the household a request may access: the requested one only if it matched
 * the last name, or the only match when none was requested.
 */
export function pickHousehold<T extends { id: string }>(matches: T[], householdId?: unknown) {
  if (householdId === undefined) return matches.length === 1 ? matches[0] : undefined;
  return matches.find((m) => m.id === householdId);
}

/** Lowercase, trim, and collapse spaces, so " Rivera " matches "rivera". */
export function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, " ").toLowerCase();
}
