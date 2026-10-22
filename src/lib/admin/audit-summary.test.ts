import { describe, expect, it } from "vitest";
import {
  correctionSummary,
  createdSummary,
  deletedSummary,
  exportSummary,
  updatedSummary,
} from "@/lib/admin/audit-summary";

const unchanged = { oldName: "The Smiths", newName: "The Smiths", added: 0, removed: 0, plusOneBefore: false, plusOneAfter: false };

describe("audit summaries", () => {
  it("describes a new invitation", () => {
    expect(createdSummary("The Smiths", 2, true)).toBe("The Smiths: 2 people and a plus-one");
    expect(createdSummary("Jane Doe", 1, false)).toBe("Jane Doe: 1 person");
  });

  it("lists what an edit changed", () => {
    expect(updatedSummary({ ...unchanged, newName: "The Smith Family", added: 1, plusOneAfter: true })).toBe(
      'The Smith Family: renamed from "The Smiths", 1 person added, plus-one added',
    );
    expect(updatedSummary({ ...unchanged, removed: 2, plusOneBefore: true })).toBe(
      "The Smiths: 2 people removed, plus-one removed",
    );
    expect(updatedSummary(unchanged)).toBe("The Smiths: details updated");
  });

  it("describes a deletion, an RSVP correction, and an export", () => {
    expect(deletedSummary("The Smiths", 3)).toBe("The Smiths: deleted with 3 guests");
    expect(correctionSummary("The Smiths", ["attending", "declined", null, "attending"])).toBe(
      "The Smiths: 2 attending, 1 declined, 1 awaiting",
    );
    expect(exportSummary(1)).toBe("CSV with 1 guest");
  });
});
