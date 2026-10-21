import { describe, expect, it } from "vitest";
import { generateConfirmationCode, generateInvitationCode, hashCode, normalizeCode } from "@/lib/rsvp/code";

describe("invitation codes", () => {
  it("generates codes in XXXX-XXXX form without look-alike characters", () => {
    for (let i = 0; i < 200; i++) {
      expect(generateInvitationCode()).toMatch(/^[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}$/);
    }
  });

  it("generates unique codes", () => {
    const codes = new Set(Array.from({ length: 1000 }, generateInvitationCode));
    expect(codes.size).toBe(1000);
  });

  it("normalizes case, spaces, and dashes", () => {
    expect(normalizeCode(" k7qm r2xh ")).toBe("K7QMR2XH");
    expect(normalizeCode("K7QM-R2XH")).toBe("K7QMR2XH");
  });

  it("hashes equivalent codes identically and never returns the code itself", () => {
    expect(hashCode("k7qm-r2xh")).toBe(hashCode("K7QM R2XH"));
    expect(hashCode("K7QM-R2XH")).toMatch(/^[0-9a-f]{64}$/);
    expect(hashCode("K7QM-R2XH")).not.toBe(hashCode("K7QM-R2XJ"));
  });

  it("generates confirmation references in GD-XXXXXX form", () => {
    expect(generateConfirmationCode()).toMatch(/^GD-[A-HJKMNP-Z2-9]{6}$/);
  });
});
