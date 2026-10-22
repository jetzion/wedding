import { describe, expect, it } from "vitest";
import { invitationGreeting } from "@/lib/invitation-greeting";

const guest = (firstName: string, lastName: string) => ({ firstName, lastName, isPlusOne: false });
const plusOne = { firstName: null, lastName: null, isPlusOne: true };

describe("invitationGreeting", () => {
  it("uses the full name of a single guest", () => {
    expect(invitationGreeting("Jane's invitation", [guest("Jane", "Doe")])).toBe("Jane Doe");
  });

  it("lists both full names for a couple, in invitation order", () => {
    expect(invitationGreeting("Smith and Doe", [guest("John", "Smith"), guest("Jane", "Doe")])).toBe(
      "John Smith and Jane Doe",
    );
  });

  it("uses the invitation name for three or more guests", () => {
    const family = [guest("John", "Smith"), guest("Jane", "Smith"), guest("Sam", "Smith")];
    expect(invitationGreeting("The Smith Family", family)).toBe("The Smith Family");
    expect(invitationGreeting("The Smith Family", [...family, plusOne])).toBe("The Smith Family");
  });

  it("adds Guest for a plus-one slot", () => {
    expect(invitationGreeting("Jane Doe", [guest("Jane", "Doe"), plusOne])).toBe("Jane Doe and Guest");
    expect(invitationGreeting("Smiths", [guest("John", "Smith"), guest("Jane", "Doe"), plusOne])).toBe(
      "John Smith, Jane Doe and Guest",
    );
  });

  it("does not use a plus-one's name, even once the guest has entered it", () => {
    const namedPlusOne = { firstName: "Jamie", lastName: "Plusone", isPlusOne: true };
    expect(invitationGreeting("Jane Doe", [guest("Jane", "Doe"), namedPlusOne])).toBe("Jane Doe and Guest");
  });

  it("falls back to the invitation name when nobody is named", () => {
    expect(invitationGreeting("The Doe Household", [])).toBe("The Doe Household");
    expect(invitationGreeting("The Doe Household", [plusOne])).toBe("The Doe Household");
  });

  it("leaves out a missing last name", () => {
    expect(invitationGreeting("Cher", [{ firstName: "Cher", lastName: null, isPlusOne: false }])).toBe("Cher");
  });
});
