/** Short audit summaries: invitation names and counts only, never notes, emails, or messages. */

const count = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export function createdSummary(name: string, people: number, plusOne: boolean) {
  return `${name}: ${count(people, "person", "people")}${plusOne ? " and a plus-one" : ""}`;
}

export function updatedSummary(change: {
  oldName: string;
  newName: string;
  added: number;
  removed: number;
  plusOneBefore: boolean;
  plusOneAfter: boolean;
}) {
  const parts = [
    change.oldName !== change.newName && `renamed from "${change.oldName}"`,
    change.added > 0 && `${count(change.added, "person", "people")} added`,
    change.removed > 0 && `${count(change.removed, "person", "people")} removed`,
    !change.plusOneBefore && change.plusOneAfter && "plus-one added",
    change.plusOneBefore && !change.plusOneAfter && "plus-one removed",
  ].filter(Boolean);
  return `${change.newName}: ${parts.length ? parts.join(", ") : "details updated"}`;
}

export function deletedSummary(name: string, people: number) {
  return `${name}: deleted with ${count(people, "guest")}`;
}

export function correctionSummary(name: string, statuses: ("attending" | "declined" | null)[]) {
  const n = (s: (typeof statuses)[number]) => statuses.filter((x) => x === s).length;
  return `${name}: ${n("attending")} attending, ${n("declined")} declined, ${n(null)} awaiting`;
}

export function exportSummary(guests: number) {
  return `CSV with ${count(guests, "guest")}`;
}
