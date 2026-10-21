import { describe, expect, it } from "vitest";
import { answerField, parseRsvpCorrection } from "@/lib/admin/rsvp-correction";
import type { InvitationGuest } from "@/lib/rsvp/types";

const EVENT = "e0000000-0000-4000-8000-000000000000";
const guest = (id: string, isPlusOne = false): InvitationGuest => ({
  id,
  firstName: isPlusOne ? null : "Alex",
  lastName: isPlusOne ? null : "Tester",
  isPlusOne,
  eventIds: [EVENT],
  dietaryRestrictions: null,
  accessibilityNeeds: null,
});
const guests = [guest("g1"), guest("p1", true)];

function form(fields: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.append(key, value);
  return data;
}

describe("parseRsvpCorrection", () => {
  it("reads answers, clears awaiting, and reads plus-one names", () => {
    const result = parseRsvpCorrection(
      guests,
      form({
        [answerField("g1", EVENT)]: "awaiting",
        [answerField("p1", EVENT)]: "attending",
        "firstName:p1": " Robin ",
        "lastName:p1": "",
      }),
    );
    expect(result).toEqual({
      ok: true,
      data: {
        answers: [
          { guestId: "g1", eventId: EVENT, status: null },
          { guestId: "p1", eventId: EVENT, status: "attending" },
        ],
        plusOneNames: [{ guestId: "p1", firstName: "Robin", lastName: null }],
      },
    });
  });

  it("requires an answer for every guest and event", () => {
    const result = parseRsvpCorrection(guests, form({ [answerField("g1", EVENT)]: "declined" }));
    expect(result).toEqual({ ok: false, error: "Choose an answer for every guest and event." });
  });

  it("rejects unknown answer values", () => {
    for (const value of ["maybe", "toString"]) {
      const result = parseRsvpCorrection([guest("g1")], form({ [answerField("g1", EVENT)]: value }));
      expect(result).toMatchObject({ ok: false });
    }
  });

  it("requires a first name for an attending plus-one", () => {
    const result = parseRsvpCorrection(
      guests,
      form({ [answerField("g1", EVENT)]: "declined", [answerField("p1", EVENT)]: "attending" }),
    );
    expect(result).toEqual({ ok: false, error: "Enter a first name for an attending plus-one." });
  });

  it("ignores answers for guests outside the household", () => {
    const result = parseRsvpCorrection(
      [guest("g1")],
      form({ [answerField("g1", EVENT)]: "declined", [answerField("other", EVENT)]: "attending" }),
    );
    expect(result).toEqual({
      ok: true,
      data: { answers: [{ guestId: "g1", eventId: EVENT, status: "declined" }], plusOneNames: [] },
    });
  });
});
