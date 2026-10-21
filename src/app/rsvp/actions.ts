"use server";

import { headers } from "next/headers";
import { pickHousehold } from "@/lib/rsvp/code";
import { findHouseholds, loadInvitation, saveSubmission } from "@/lib/rsvp/invitation";
import type { Invitation } from "@/lib/rsvp/types";
import { validateSubmission } from "@/lib/rsvp/validate";
import { isRateLimited } from "@/lib/rate-limit";

const NOT_FOUND =
  "We couldn't find an invitation under that name. Please enter it as it appears on your invitation.";
const TOO_MANY = "Too many attempts. Please wait a minute and try again.";

export type GuestName = { firstName: string; lastName: string };

async function limited(action: string) {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  return isRateLimited(`${action}:${ip}`, 10, 60_000);
}

const validName = (value: unknown) => typeof value === "string" && value.trim() !== "" && value.length <= 80;

/** The household for this guest name, if the name belongs to an invited guest in it. */
async function authorize(name: GuestName, householdId?: unknown) {
  if (!validName(name?.firstName) || !validName(name?.lastName)) return { matches: [] };
  const matches = await findHouseholds(name.firstName, name.lastName);
  return { matches, chosen: pickHousehold(matches, householdId) };
}

export type LookupResult =
  | { kind: "found"; householdId: string; invitation: Invitation }
  | { kind: "choose"; households: { id: string; name: string }[] }
  | { kind: "error"; error: string };

/** Find an invitation by guest name. Several matches return household names to choose from. */
export async function lookupInvitation(name: GuestName, householdId?: string): Promise<LookupResult> {
  if (await limited("lookup")) return { kind: "error", error: TOO_MANY };
  const { matches, chosen } = await authorize(name, householdId);
  if (!matches.length) return { kind: "error", error: NOT_FOUND };
  if (!chosen) return { kind: "choose", households: matches };

  const found = await loadInvitation(chosen.id);
  return found ? { kind: "found", ...found } : { kind: "error", error: NOT_FOUND };
}

export type SubmitResult = { ok: true; confirmationCode: string } | { ok: false; error: string };

/** Save an RSVP. The name and household are re-checked and the submission re-validated. */
export async function submitRsvp(name: GuestName, householdId: string, input: unknown): Promise<SubmitResult> {
  if (await limited("submit")) return { ok: false, error: TOO_MANY };
  const { chosen } = await authorize(name, householdId);
  const found = chosen ? await loadInvitation(chosen.id) : null;
  if (!found) return { ok: false, error: NOT_FOUND };

  const result = validateSubmission(found.invitation, input);
  if (!result.ok) return result;

  const confirmationCode = await saveSubmission(found.householdId, found.invitation, result.data);
  return { ok: true, confirmationCode };
}
