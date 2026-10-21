import { createHash, randomInt } from "node:crypto";

/** No look-alike characters (0/O, 1/I/L) so codes are easy to type. */
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
const CODE_LENGTH = 8;

function randomChars(length: number) {
  return Array.from({ length }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
}

/** A new invitation code, e.g. "K7QM-R2XH". About 40 bits of randomness. */
export function generateInvitationCode() {
  const raw = randomChars(CODE_LENGTH);
  return `${raw.slice(0, 4)}-${raw.slice(4)}`;
}

/** A new RSVP confirmation reference, e.g. "GD-8KQ2ZP". */
export function generateConfirmationCode() {
  return `GD-${randomChars(6)}`;
}

/** Uppercase and strip spaces and dashes, so "k7qm r2xh" matches "K7QM-R2XH". */
export function normalizeCode(code: string) {
  return code.toUpperCase().replace(/[\s-]/g, "");
}

/** SHA-256 hash of the normalized code. Only the hash is stored. */
export function hashCode(code: string) {
  return createHash("sha256").update(normalizeCode(code)).digest("hex");
}
