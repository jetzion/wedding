import { describe, expect, it } from "vitest";
import { filterInvitations, readFilter } from "@/lib/admin/filter";

const invitations = [
  {
    name: "The Rivera Household",
    contactEmail: "alex@example.com",
    guests: [
      { name: "Alex Rivera", status: "attending" as const },
      { name: "Sam Rivera", status: "awaiting" as const },
    ],
  },
  { name: "The Test Family", contactEmail: null, guests: [{ name: "Robin Tester", status: "declined" as const }] },
];
const names = (list: typeof invitations) => list.map((i) => i.name);

describe("filterInvitations", () => {
  it("returns everything with an empty filter", () => {
    expect(names(filterInvitations(invitations, { q: "", status: "" }))).toEqual([
      "The Rivera Household",
      "The Test Family",
    ]);
  });

  it("searches invitation name, guest names, and email, ignoring case", () => {
    expect(names(filterInvitations(invitations, { q: "FAMILY", status: "" }))).toEqual(["The Test Family"]);
    expect(names(filterInvitations(invitations, { q: "robin", status: "" }))).toEqual(["The Test Family"]);
    expect(names(filterInvitations(invitations, { q: "alex@", status: "" }))).toEqual(["The Rivera Household"]);
    expect(filterInvitations(invitations, { q: "nobody", status: "" })).toEqual([]);
  });

  it("keeps invitations with any guest in the chosen status", () => {
    expect(names(filterInvitations(invitations, { q: "", status: "awaiting" }))).toEqual(["The Rivera Household"]);
    expect(names(filterInvitations(invitations, { q: "", status: "declined" }))).toEqual(["The Test Family"]);
    expect(filterInvitations(invitations, { q: "rivera", status: "declined" })).toEqual([]);
  });
});

describe("readFilter", () => {
  it("reads known values and ignores the rest", () => {
    expect(readFilter({ q: " rivera ", status: "awaiting" })).toEqual({ q: "rivera", status: "awaiting" });
    expect(readFilter({ q: ["a", "b"], status: "maybe" })).toEqual({ q: "a", status: "" });
    expect(readFilter({})).toEqual({ q: "", status: "" });
  });
});
