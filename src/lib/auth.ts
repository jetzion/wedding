import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import { isAdminEmail } from "@/lib/admin-emails";

/**
 * Admin authentication. Email and password only; accounts can exist only for
 * ADMIN_EMAILS. The public sign-up endpoint is disabled; the first account is
 * created through the setup page, which calls signUpEmail on the server.
 */
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: { enabled: true, minPasswordLength: 12 },
  disabledPaths: ["/sign-up/email"],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          if (!isAdminEmail(user.email)) {
            throw new APIError("FORBIDDEN", { message: "This email cannot have an account." });
          }
        },
      },
    },
  },
  plugins: [nextCookies()],
});
