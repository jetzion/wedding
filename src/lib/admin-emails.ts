/** Parse a comma-separated email list into normalized addresses. */
export function parseEmailList(list: string | undefined): string[] {
  return (list ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/** Whether this email is on the ADMIN_EMAILS allowlist. Case and surrounding spaces are ignored. */
export function isAdminEmail(email: string, list = process.env.ADMIN_EMAILS): boolean {
  return parseEmailList(list).includes(email.trim().toLowerCase());
}
