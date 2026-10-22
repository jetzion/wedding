import { randomInt } from "node:crypto";

/** No look-alike characters (0/o, 1/i/l) and no u, so codes are easy to read. */
const ALPHABET = "abcdefghjkmnpqrstvwxyz23456789";
const CODE_LENGTH = 6;
const MAX_SLUG_LENGTH = 40;

/**
 * The readable part of an invitation link: "The Etzion Family" becomes
 * "the-etzion-family". Accents are dropped and anything that is not a letter
 * or digit becomes a hyphen.
 */
export function linkSlug(name: string) {
  const slug = name
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/^-+|-+$/g, "");
  return slug || "invitation";
}

/**
 * A new, unguessable link name, e.g. "the-etzion-family-k7m2qx". The random
 * code has 30^6 (about 729 million) possibilities.
 */
export function newLinkName(name: string) {
  const code = Array.from({ length: CODE_LENGTH }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
  return `${linkSlug(name)}-${code}`;
}

/** The form link names are stored in, so lookups ignore case and outer spaces. */
export function normalizeLinkName(linkName: string) {
  return linkName.trim().toLowerCase();
}

const LINK_NAME = new RegExp(`^[a-z0-9]+(-[a-z0-9]+)*-[${ALPHABET}]{${CODE_LENGTH}}$`);

/** Whether a normalized link name has the shape newLinkName() makes: a slug, a hyphen, and a code. */
export function isLinkName(linkName: string) {
  return linkName.length <= MAX_SLUG_LENGTH + 1 + CODE_LENGTH && LINK_NAME.test(linkName);
}
