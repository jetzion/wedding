import { describe, expect, it } from "vitest";
import type { Invitation } from "@/lib/rsvp/types";
import { validateSubmission } from "@/lib/rsvp/validate";

const CEREMONY = "11111111-1111-4111-8111-111111111111";
const RECEPTION = "22222222-2222-4222-8222-222222222222";
const ALEX = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const PLUS_ONE = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const STRANGER = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";

const guest = (id: string, isPlusOne = false) => ({
  id,
  firstName: isPlusOne ? null : "Alex",
  lastName: isPlusOne ? null : "Test",
  isPlusOne,
  eventIds: [CEREMONY, RECEPTION],
  dietaryRestrictions: null,
  accessibilityNeeds: null,
});

const invitation: Invitation = {
  householdName: "Test Household",
  guests: [guest(ALEX), guest(PLUS_ONE, true)],
  events: [
    { id: CEREMONY, name: "Ceremony", startsAt: null },
    { id: RECEPTION, name: "Reception", startsAt: null },
  ],
  responses: {},
  contactEmail: null,
  message: null,
  confirmationCode: null,
  deadlinePassed: false,
  timezone: "America/New_York",
};

const both = (status: "attending" | "declined") => ({ [CEREMONY]: status, [RECEPTION]: status });

const valid = {
  guests: [
    { id: ALEX, responses: both("attending") },
    { id: PLUS_ONE, firstName: "Jordan", lastName: "Guest", responses: both("attending") },
  ],
  contactEmail: "alex@example.com",
  message: "Can't wait!",
};

describe("validateSubmission", () => {
  it("accepts a complete, valid submission", () => {
    expect(validateSubmission(invitation, valid)).toMatchObject({ ok: true });
  });

  it("rejects submissions after the deadline", () => {
    const result = validateSubmission({ ...invitation, deadlinePassed: true }, valid);
    expect(result).toEqual({ ok: false, error: "The RSVP deadline has passed." });
  });

  it("rejects a guest who is not on the invitation", () => {
    const input = { ...valid, guests: [...valid.guests, { id: STRANGER, responses: both("attending") }] };
    expect(validateSubmission(invitation, input).ok).toBe(false);
  });

  it("rejects a submission missing an invited guest", () => {
    expect(validateSubmission(invitation, { ...valid, guests: [valid.guests[0]] }).ok).toBe(false);
  });

  it("rejects missing answers for an invited event", () => {
    const input = { ...valid, guests: [{ id: ALEX, responses: { [CEREMONY]: "attending" } }, valid.guests[1]] };
    expect(validateSubmission(invitation, input).ok).toBe(false);
  });

  it("rejects answers for an event the guest is not invited to", () => {
    const ceremonyOnly = { ...invitation, guests: [{ ...guest(ALEX), eventIds: [CEREMONY] }] };
    const input = { ...valid, guests: [{ id: ALEX, responses: both("attending") }] };
    expect(validateSubmission(ceremonyOnly, input).ok).toBe(false);
  });

  it("requires a name for an attending plus-one", () => {
    const input = { ...valid, guests: [valid.guests[0], { id: PLUS_ONE, responses: both("attending") }] };
    expect(validateSubmission(invitation, input)).toEqual({ ok: false, error: "Please enter your guest's name." });
  });

  it("allows a declining plus-one without a name", () => {
    const input = { ...valid, guests: [valid.guests[0], { id: PLUS_ONE, responses: both("declined") }] };
    expect(validateSubmission(invitation, input).ok).toBe(true);
  });

  it("rejects an invalid email and invalid statuses", () => {
    expect(validateSubmission(invitation, { ...valid, contactEmail: "not-an-email" }).ok).toBe(false);
    const badStatus = { ...valid, guests: [{ id: ALEX, responses: both("maybe" as "attending") }, valid.guests[1]] };
    expect(validateSubmission(invitation, badStatus).ok).toBe(false);
  });

  it("trims text fields", () => {
    const result = validateSubmission(invitation, { ...valid, message: "  Hi!  " });
    expect(result.ok && result.data.message).toBe("Hi!");
  });
});
