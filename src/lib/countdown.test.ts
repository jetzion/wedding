import { describe, expect, it } from "vitest";
import { timeUntil } from "@/lib/countdown";

const target = Date.parse("2027-08-14T21:00:00Z");

describe("timeUntil", () => {
  it("splits the remaining time into days, hours, minutes, and seconds", () => {
    const now = target - ((2 * 24 + 3) * 3600 + 4 * 60 + 5) * 1000;
    expect(timeUntil(target, now)).toEqual({ days: 2, hours: 3, minutes: 4, seconds: 5 });
  });

  it("drops partial seconds", () => {
    expect(timeUntil(target, target - 1500)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 1 });
  });

  it("returns null once the moment arrives", () => {
    expect(timeUntil(target, target - 999)).toBeNull();
    expect(timeUntil(target, target)).toBeNull();
    expect(timeUntil(target, target + 60_000)).toBeNull();
  });
});
