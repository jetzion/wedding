import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isAdminEmail } from "@/lib/admin-emails";
import { auth } from "@/lib/auth";

/**
 * The signed-in admin's session, or a redirect to sign-in. Call this first in
 * every admin page and every admin server action. The email is re-checked
 * against ADMIN_EMAILS on each call, so removing an email revokes access.
 */
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !isAdminEmail(session.user.email)) redirect("/admin/sign-in");
  return session;
}
