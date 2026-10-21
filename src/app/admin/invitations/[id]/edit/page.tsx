import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { editInvitation } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import { InvitationFields } from "@/components/admin/invitation-fields";
import { getInvitation } from "@/lib/admin/invitations";

export default function Page({ params }: PageProps<"/admin/invitations/[id]/edit">) {
  return (
    <div className="space-y-6">
      <h1 className="text-center font-serif text-4xl">Edit invitation</h1>
      <Suspense fallback={<p className="text-center text-ink-muted">Loading…</p>}>
        {params.then(({ id }) => (
          <EditInvitationForm id={id} />
        ))}
      </Suspense>
      <p className="text-center">
        <Link href="/admin" className="text-sea underline">
          Back to invitations
        </Link>
      </p>
    </div>
  );
}

/** Admin-only form. getInvitation checks the admin session. */
async function EditInvitationForm({ id }: { id: string }) {
  const invitation = await getInvitation(id);
  if (!invitation) notFound();

  return (
    <AdminForm action={editInvitation} submitLabel="Save changes">
      <InvitationFields invitation={invitation} />
    </AdminForm>
  );
}
