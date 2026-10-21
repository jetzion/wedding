import { describe, expect, it } from "vitest";
import { isAdminEmail, parseEmailList } from "@/lib/admin-emails";

const list = "admin@example.com, Planner@Example.com ,";

describe("parseEmailList", () => {
  it("trims, lowercases, and drops empty entries", () => {
    expect(parseEmailList(list)).toEqual(["admin@example.com", "planner@example.com"]);
  });

  it("returns an empty list when unset", () => {
    expect(parseEmailList(undefined)).toEqual([]);
  });
});

describe("isAdminEmail", () => {
  it("accepts listed emails regardless of case and spaces", () => {
    expect(isAdminEmail(" ADMIN@example.com ", list)).toBe(true);
    expect(isAdminEmail("planner@example.com", list)).toBe(true);
  });

  it("rejects unlisted emails", () => {
    expect(isAdminEmail("guest@example.com", list)).toBe(false);
  });

  it("rejects everyone when the list is unset or empty", () => {
    expect(isAdminEmail("admin@example.com", undefined)).toBe(false);
    expect(isAdminEmail("", "")).toBe(false);
  });
});
