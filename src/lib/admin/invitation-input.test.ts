import { describe, expect, it } from "vitest";
import { parseInvitationForm } from "@/lib/admin/invitation-input";

function form(fields: Record<string, string | string[]>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    for (const v of [value].flat()) data.append(key, v);
  }
  return data;
}

describe("parseInvitationForm", () => {
  it("reads guests and skips blank rows", () => {
    const result = parseInvitationForm(
      form({
        name: " The Test Household ",
        contactEmail: "",
        firstName: ["Alex", "", "Sam"],
        lastName: ["Tester", "", "Tester"],
        plusOne: "on",
      }),
    );
    expect(result).toEqual({
      ok: true,
      data: {
        name: "The Test Household",
        contactEmail: "",
        guests: [
          { firstName: "Alex", lastName: "Tester" },
          { firstName: "Sam", lastName: "Tester" },
        ],
        removeIds: [],
        plusOne: true,
      },
    });
  });

  it("rejects a guest with only a first name", () => {
    const result = parseInvitationForm(form({ name: "X", firstName: ["Alex"], lastName: [""] }));
    expect(result).toEqual({ ok: false, error: "Enter both a first and last name for each person." });
  });

  it("requires at least one person", () => {
    const result = parseInvitationForm(form({ name: "X", firstName: [""], lastName: [""] }));
    expect(result).toEqual({ ok: false, error: "Add at least one person." });
  });

  it("requires a name and a valid email", () => {
    const people = { firstName: ["Alex"], lastName: ["Tester"] };
    expect(parseInvitationForm(form({ name: " ", ...people }))).toMatchObject({ ok: false });
    expect(parseInvitationForm(form({ name: "X", contactEmail: "nope", ...people }))).toEqual({
      ok: false,
      error: "Enter a valid email or leave it blank.",
    });
  });

  it("keeps existing guest ids and reads removals", () => {
    const keep = "11111111-1111-4111-8111-111111111111";
    const drop = "22222222-2222-4222-8222-222222222222";
    const result = parseInvitationForm(
      form({
        name: "X",
        guestId: [keep, drop, ""],
        firstName: ["Alex", "", "Robin"],
        lastName: ["Tester", "", "Tester"],
        remove: drop,
      }),
    );
    expect(result).toMatchObject({
      ok: true,
      data: {
        guests: [
          { id: keep, firstName: "Alex", lastName: "Tester" },
          { firstName: "Robin", lastName: "Tester" },
        ],
        removeIds: [drop],
      },
    });
  });

  it("rejects blanking an existing guest instead of removing them", () => {
    const id = "11111111-1111-4111-8111-111111111111";
    const result = parseInvitationForm(form({ name: "X", guestId: [id], firstName: [""], lastName: [""] }));
    expect(result).toEqual({ ok: false, error: "Enter both a first and last name for each person." });
  });

  it("requires someone to remain after removals", () => {
    const id = "11111111-1111-4111-8111-111111111111";
    const result = parseInvitationForm(
      form({ name: "X", guestId: [id], firstName: ["Alex"], lastName: ["Tester"], remove: id }),
    );
    expect(result).toEqual({ ok: false, error: "Add at least one person." });
  });
});
