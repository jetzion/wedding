import { Suspense } from "react";
import Link from "next/link";
import { addInvitation } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import { InvitationFields } from "@/components/admin/invitation-fields";
import { requireAdmin } from "@/lib/admin/session";

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-center font-serif text-4xl">New invitation</h1>
      <Suspense fallback={<p className="text-center text-ink-muted">Loading…</p>}>
        <NewInvitationForm />
      </Suspense>
      <p className="text-center">
        <Link href="/admin" className="text-sea underline">
          Back to invitations
        </Link>
      </p>
    </div>
  );
}

/** Admin-only form. */
async function NewInvitationForm() {
  await requireAdmin();

  return (
    <AdminForm action={addInvitation} submitLabel="Create invitation">
      <InvitationFields />
    </AdminForm>
  );
}
