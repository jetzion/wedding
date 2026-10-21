"use server";

import { headers } from "next/headers";
import { loadInvitation, saveSubmission } from "@/lib/rsvp/invitation";
import type { Invitation } from "@/lib/rsvp/types";
import { validateSubmission } from "@/lib/rsvp/validate";
import { isRateLimited } from "@/lib/rate-limit";

const NOT_FOUND = "We couldn't find that invitation. Please check your code and try again.";
const TOO_MANY = "Too many attempts. Please wait a minute and try again.";

async function limited(action: string) {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  return isRateLimited(`${action}:${ip}`, 10, 60_000);
}

export type LookupResult = { ok: true; invitation: Invitation } | { ok: false; error: string };

/** Find an invitation by code. Errors are generic so codes cannot be probed. */
export async function lookupInvitation(code: string): Promise<LookupResult> {
  if (await limited("lookup")) return { ok: false, error: TOO_MANY };
  const found = typeof code === "string" && code.length <= 20 ? await loadInvitation(code) : null;
  return found ? { ok: true, invitation: found.invitation } : { ok: false, error: NOT_FOUND };
}

export type SubmitResult = { ok: true; confirmationCode: string } | { ok: false; error: string };

/** Save an RSVP. The code is re-checked and the whole submission re-validated on the server. */
export async function submitRsvp(code: string, input: unknown): Promise<SubmitResult> {
  if (await limited("submit")) return { ok: false, error: TOO_MANY };
  const found = typeof code === "string" && code.length <= 20 ? await loadInvitation(code) : null;
  if (!found) return { ok: false, error: NOT_FOUND };

  const result = validateSubmission(found.invitation, input);
  if (!result.ok) return result;

  const confirmationCode = await saveSubmission(found.householdId, found.invitation, result.data);
  return { ok: true, confirmationCode };
}
