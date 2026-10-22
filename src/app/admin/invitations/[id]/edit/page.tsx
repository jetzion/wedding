import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { editInvitation } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import { InvitationFields } from "@/components/admin/invitation-fields";
import { InvitationLink, NewLinkButton } from "@/components/admin/invitation-link";
import { cardClass } from "@/components/rsvp/fields";
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
    <>
      <section className={`${cardClass} mx-auto max-w-md space-y-3`}>
        <h2 className="text-sm uppercase tracking-[0.15em] text-ink-muted">Invitation link</h2>
        <InvitationLink linkName={invitation.linkName} />
        <p className="text-sm text-ink-muted">
          Renaming the invitation keeps this link. If it was shared by mistake, make a new one; the old link will
          stop working.
        </p>
        <NewLinkButton id={invitation.id} />
      </section>
      <AdminForm action={editInvitation} submitLabel="Save changes">
        <InvitationFields invitation={invitation} />
      </AdminForm>
    </>
  );
}
