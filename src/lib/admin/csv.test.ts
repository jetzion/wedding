import { describe, expect, it } from "vitest";
import { csvCell, guestsCsv } from "@/lib/admin/csv";

describe("csvCell", () => {
  it("leaves plain text alone and empties null", () => {
    expect(csvCell("Alex")).toBe("Alex");
    expect(csvCell(null)).toBe("");
  });

  it("quotes commas, quotes, and line breaks", () => {
    expect(csvCell("Rivera, Alex")).toBe('"Rivera, Alex"');
    expect(csvCell('say "hi"')).toBe('"say ""hi"""');
    expect(csvCell("line\nbreak")).toBe('"line\nbreak"');
  });

  it("defuses spreadsheet formulas", () => {
    expect(csvCell("=HYPERLINK(1)")).toBe("'=HYPERLINK(1)");
    expect(csvCell("+1")).toBe("'+1");
    expect(csvCell("-1")).toBe("'-1");
    expect(csvCell("@SUM(A1)")).toBe("'@SUM(A1)");
    expect(csvCell("=A1,B1")).toBe(`"'=A1,B1"`);
  });
});

describe("guestsCsv", () => {
  it("writes one row per guest", () => {
    const csv = guestsCsv(
      [
        {
          name: "The Test Household",
          contactEmail: "test@example.com",
          message: null,
          confirmationCode: "ABC123",
          respondedAt: new Date("2027-01-02T03:00:00Z"),
          guests: [
            {
              firstName: "Alex",
              lastName: "Tester",
              isPlusOne: false,
              status: "attending",
              dietaryRestrictions: "Vegetarian",
              accessibilityNeeds: null,
            },
            {
              firstName: null,
              lastName: null,
              isPlusOne: true,
              status: "awaiting",
              dietaryRestrictions: null,
              accessibilityNeeds: null,
            },
          ],
        },
      ],
      "America/New_York",
    );
    expect(csv.split("\r\n")).toEqual([
      "Invitation,First name,Last name,Plus-one,Status,Dietary,Accessibility,Contact email,Confirmation code,Responded,Note",
      "The Test Household,Alex,Tester,No,Attending,Vegetarian,,test@example.com,ABC123,2027-01-01,",
      "The Test Household,,,Yes,Awaiting response,,,test@example.com,ABC123,2027-01-01,",
      "",
    ]);
  });
});
