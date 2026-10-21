import { Suspense } from "react";
import Link from "next/link";
import { changePassword } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import { PasswordFields } from "@/components/admin/password-fields";
import { requireAdmin } from "@/lib/admin/session";

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-center font-serif text-4xl">Change password</h1>
      <Suspense fallback={<p className="text-center text-ink-muted">Loading…</p>}>
        <ChangePasswordForm />
      </Suspense>
      <p className="text-center">
        <Link href="/admin" className="text-sea underline">
          Back to invitations
        </Link>
      </p>
    </div>
  );
}

/** Admin-only form. Changing the password signs out the admin's other devices. */
async function ChangePasswordForm() {
  const session = await requireAdmin();

  return (
    <AdminForm action={changePassword} submitLabel="Change password">
      <p className="text-ink-muted">
        Signed in as {session.user.email}. Your other devices will be signed out.
      </p>
      <PasswordFields variant="change" />
    </AdminForm>
  );
}
