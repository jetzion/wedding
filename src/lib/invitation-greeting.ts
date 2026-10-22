type GreetingGuest = { firstName: string | null; lastName: string | null; isPlusOne: boolean };

/**
 * Who the invitation page is addressed to. One guest: "Jane Doe"; two:
 * "John Smith and Jane Doe"; three or more: the invitation name, such as
 * "The Smith Family". A plus-one slot adds "and Guest" to one or two names.
 * Guests are in invitation order.
 */
export function invitationGreeting(invitationName: string, guests: GreetingGuest[]) {
  const names = guests
    .filter((g) => !g.isPlusOne && g.firstName)
    .map((g) => [g.firstName, g.lastName].filter(Boolean).join(" "));
  if (names.length === 0 || names.length > 2) return invitationName;
  const withGuest = guests.some((g) => g.isPlusOne) ? [...names, "Guest"] : names;
  return withGuest.length === 3
    ? `${withGuest[0]}, ${withGuest[1]} and ${withGuest[2]}`
    : withGuest.join(" and ");
}
