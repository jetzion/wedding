"use server";

import { createHash, timingSafeEqual } from "node:crypto";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { isAdminEmail } from "@/lib/admin-emails";
import { parseInvitationForm } from "@/lib/admin/invitation-input";
import { createInvitation, deleteInvitation, updateInvitation } from "@/lib/admin/invitations";
import { loadHouseholdRsvp, saveRsvpCorrection } from "@/lib/admin/rsvp";
import { parseRsvpCorrection } from "@/lib/admin/rsvp-correction";
import { requireAdmin } from "@/lib/admin/session";
import { auth } from "@/lib/auth";
import { isRateLimited } from "@/lib/rate-limit";

export type FormResult = { error?: string };

const WRONG = "Email or password is incorrect.";
const TOO_MANY = "Too many attempts. Please wait a minute and try again.";

async function limited(action: string) {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  return isRateLimited(`${action}:${ip}`, 5, 60_000);
}

const field = (form: FormData, name: string) => String(form.get(name) ?? "").trim();

/** Compare secrets without leaking their length or content through timing. */
function sameSecret(given: string, expected: string) {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(given), digest(expected));
}

/** Sign in an admin with email and password. */
export async function signIn(_: FormResult, form: FormData): Promise<FormResult> {
  if (await limited("admin-sign-in")) return { error: TOO_MANY };
  const email = field(form, "email");
  const password = String(form.get("password") ?? "");
  if (!isAdminEmail(email)) return { error: WRONG };
  try {
    await auth.api.signInEmail({ body: { email, password } });
  } catch (error) {
    if (error instanceof APIError) return { error: WRONG };
    throw error;
  }
  redirect("/admin");
}

/** Create an admin account. Requires ADMIN_SETUP_CODE and an email on ADMIN_EMAILS. */
export async function setUp(_: FormResult, form: FormData): Promise<FormResult> {
  if (await limited("admin-setup")) return { error: TOO_MANY };
  const setupCode = process.env.ADMIN_SETUP_CODE;
  if (!setupCode || !sameSecret(field(form, "code"), setupCode)) {
    return { error: "That setup code is not right." };
  }
  const email = field(form, "email");
  const password = String(form.get("password") ?? "");
  if (!isAdminEmail(email)) return { error: "This email is not on the admin list." };
  if (password !== String(form.get("confirm") ?? "")) return { error: "The passwords do not match." };
  try {
    await auth.api.signUpEmail({ body: { email, password, name: email } });
  } catch (error) {
    if (error instanceof APIError) return { error: error.message };
    throw error;
  }
  redirect("/admin");
}

/** Sign out the current admin. */
export async function signOut() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/admin/sign-in");
}

/** Create an invitation from the admin form. */
export async function addInvitation(_: FormResult, form: FormData): Promise<FormResult> {
  await requireAdmin();
  const parsed = parseInvitationForm(form);
  if (!parsed.ok) return { error: parsed.error };
  await createInvitation(parsed.data);
  redirect("/admin");
}

/** Delete an invitation after the admin confirms on its delete page. */
export async function removeInvitation(form: FormData) {
  await requireAdmin();
  const id = z.uuid().parse(form.get("id"));
  await deleteInvitation(id);
  redirect("/admin");
}

/** Save changes from the edit invitation form. */
export async function editInvitation(_: FormResult, form: FormData): Promise<FormResult> {
  await requireAdmin();
  const id = z.uuid().parse(form.get("id"));
  const parsed = parseInvitationForm(form);
  if (!parsed.ok) return { error: parsed.error };
  const error = await updateInvitation(id, parsed.data);
  if (error) return { error };
  redirect("/admin");
}

/** Save an admin's correction to one household's RSVP answers. */
export async function correctRsvp(_: FormResult, form: FormData): Promise<FormResult> {
  await requireAdmin();
  const loaded = await loadHouseholdRsvp(String(form.get("id") ?? ""));
  if (!loaded) return { error: "This invitation no longer exists." };
  const parsed = parseRsvpCorrection(loaded.invitation.guests, form);
  if (!parsed.ok) return { error: parsed.error };
  await saveRsvpCorrection(parsed.data);
  redirect("/admin");
}
