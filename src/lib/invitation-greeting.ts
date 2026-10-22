type GreetingGuest = { firstName: string | null; lastName: string | null; isPlusOne: boolean };
type Named = { firstName: string; lastName: string | null };

/** The invitation name with "Family" added, unless it already ends in "Family". */
function familyName(invitationName: string) {
  const name = invitationName.trim();
  return /\bfamily$/i.test(name) ? name : `${name} Family`;
}

const fullName = (g: Named) => [g.firstName, g.lastName].filter(Boolean).join(" ");

/** "John and Jane Smith" (and Guest) with a shared last name, else "John Smith and Jane Doe" or "John Smith, Jane Doe and Guest". */
function coupleName([a, b]: Named[], plusOne: boolean) {
  if (a.lastName && a.lastName.toLowerCase() === b.lastName?.toLowerCase()) {
    return `${a.firstName} and ${b.firstName} ${b.lastName}${plusOne ? " and Guest" : ""}`;
  }
  return plusOne ? `${fullName(a)}, ${fullName(b)} and Guest` : `${fullName(a)} and ${fullName(b)}`;
}

/**
 * Who the invitation page is addressed to. One guest: "Jane Doe"; two:
 * "John and Jane Smith" with a shared last name, else "John Smith and Jane
 * Doe"; three or more: the invitation name plus "Family" ("The Smiths"
 * becomes "The Smiths Family", "The Smith Family" stays). A plus-one slot adds
 * "and Guest" to one or two names. With nobody named, the invitation name as
 * is. Guests are in invitation order.
 */
export function invitationGreeting(invitationName: string, guests: GreetingGuest[]) {
  const named = guests.filter((g): g is GreetingGuest & Named => !g.isPlusOne && Boolean(g.firstName));
  const plusOne = guests.some((g) => g.isPlusOne);
  if (named.length === 0) return invitationName;
  if (named.length > 2) return familyName(invitationName);
  if (named.length === 2) return coupleName(named, plusOne);
  return plusOne ? `${fullName(named[0])} and Guest` : fullName(named[0]);
}
