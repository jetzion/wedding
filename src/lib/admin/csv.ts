import type { GuestStatus } from "@/lib/admin/status";

type ExportInvitation = {
  name: string;
  contactEmail: string | null;
  message: string | null;
  confirmationCode: string | null;
  respondedAt: Date | null;
  guests: {
    firstName: string | null;
    lastName: string | null;
    isPlusOne: boolean;
    status: GuestStatus;
    dietaryRestrictions: string | null;
    accessibilityNeeds: string | null;
  }[];
};

const STATUS_LABEL: Record<GuestStatus, string> = {
  attending: "Attending",
  declined: "Declined",
  awaiting: "Awaiting response",
};

const HEADER = [
  "Invitation",
  "First name",
  "Last name",
  "Plus-one",
  "Status",
  "Dietary",
  "Accessibility",
  "Contact email",
  "Confirmation code",
  "Responded",
  "Note",
];

/**
 * One CSV cell. Text starting with a formula character gets a leading
 * apostrophe so spreadsheets show it instead of running it; cells with commas,
 * quotes, or line breaks are quoted.
 */
export function csvCell(value: string | null) {
  const text = /^[=+\-@\t\r]/.test(value ?? "") ? `'${value}` : (value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

/** CSV with one row per guest. Dates are shown as YYYY-MM-DD in the wedding's timezone. */
export function guestsCsv(invitations: ExportInvitation[], timezone: string) {
  const day = (d: Date | null) => (d ? d.toLocaleDateString("en-CA", { timeZone: timezone }) : "");
  const rows = invitations.flatMap((i) =>
    i.guests.map((g) => [
      i.name,
      g.firstName,
      g.lastName,
      g.isPlusOne ? "Yes" : "No",
      STATUS_LABEL[g.status],
      g.dietaryRestrictions,
      g.accessibilityNeeds,
      i.contactEmail,
      i.confirmationCode,
      day(i.respondedAt),
      i.message,
    ]),
  );
  return [HEADER, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n") + "\r\n";
}
