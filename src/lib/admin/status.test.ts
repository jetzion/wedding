import { describe, expect, it } from "vitest";
import { guestStatus, summarize } from "@/lib/admin/status";

describe("guestStatus", () => {
  it("is awaiting when nothing is answered", () => {
    expect(guestStatus(["e1"], {})).toBe("awaiting");
  });

  it("is attending when any invited event is accepted", () => {
    expect(guestStatus(["e1", "e2"], { e1: "declined", e2: "attending" })).toBe("attending");
  });

  it("is declined only when every invited event is declined", () => {
    expect(guestStatus(["e1"], { e1: "declined" })).toBe("declined");
    expect(guestStatus(["e1", "e2"], { e1: "declined" })).toBe("awaiting");
  });

  it("ignores answers for events the guest is not invited to", () => {
    expect(guestStatus(["e1"], { e2: "attending" })).toBe("awaiting");
  });

  it("is awaiting, not declined, for a guest invited to no events", () => {
    expect(guestStatus([], {})).toBe("awaiting");
  });
});

describe("summarize", () => {
  it("counts invitations and guests by status", () => {
    const invitations = [
      { guests: [{ status: "attending" as const }, { status: "declined" as const }] },
      { guests: [{ status: "awaiting" as const }] },
    ];
    expect(summarize(invitations)).toEqual({ invitations: 2, guests: 3, attending: 1, declined: 1, awaiting: 1 });
  });
});
