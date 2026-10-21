import { describe, expect, it } from "vitest";
import { generateConfirmationCode, normalizeName, pickHousehold } from "@/lib/rsvp/code";

describe("confirmation codes", () => {
  it("generates references in GD-XXXXXX form without look-alike characters", () => {
    for (let i = 0; i < 200; i++) {
      expect(generateConfirmationCode()).toMatch(/^GD-[A-HJKMNP-Z2-9]{6}$/);
    }
  });

  it("generates unique references", () => {
    const codes = new Set(Array.from({ length: 1000 }, generateConfirmationCode));
    expect(codes.size).toBe(1000);
  });
});

describe("pickHousehold", () => {
  const rivera1 = { id: "h1", name: "The Rivera Household" };
  const rivera2 = { id: "h2", name: "Rivera Family" };

  it("picks the only match when no household is requested", () => {
    expect(pickHousehold([rivera1])).toBe(rivera1);
  });

  it("asks to choose when several households match", () => {
    expect(pickHousehold([rivera1, rivera2])).toBeUndefined();
  });

  it("allows a requested household only if it matched the guest's name", () => {
    expect(pickHousehold([rivera1, rivera2], "h2")).toBe(rivera2);
    expect(pickHousehold([rivera1], "some-other-household")).toBeUndefined();
    expect(pickHousehold([], "h1")).toBeUndefined();
  });
});

describe("normalizeName", () => {
  it("ignores case, outer spaces, and repeated inner spaces", () => {
    expect(normalizeName("  Rivera ")).toBe("rivera");
    expect(normalizeName("VAN   der Berg")).toBe("van der berg");
  });
});
