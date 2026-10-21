import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { isAdminEmail } from "@/lib/admin-emails";
import { auth } from "@/lib/auth";

/**
 * The signed-in admin's session, or a redirect to sign-in. Call this first in
 * every admin page and every admin server action. The email is re-checked
 * against ADMIN_EMAILS on each call, so removing an email revokes access.
 * The session lookup queries the database, so it runs at request time only
 * (connection()); during a prerender the query would be cut off.
 */
export async function requireAdmin() {
  await connection();
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !isAdminEmail(session.user.email)) redirect("/admin/sign-in");
  return session;
}
