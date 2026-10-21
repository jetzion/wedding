import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { removeInvitation } from "@/app/admin/actions";
import { cardClass, secondaryButton } from "@/components/rsvp/fields";
import { getInvitation } from "@/lib/admin/invitations";

const dangerButton = "rounded-full bg-coral px-8 py-3 text-shell transition-colors hover:bg-coral/85";

export default function Page({ params }: PageProps<"/admin/invitations/[id]/delete">) {
  return (
    <div className="space-y-6">
      <h1 className="text-center font-serif text-4xl">Delete invitation</h1>
      <Suspense fallback={<p className="text-center text-ink-muted">Loading…</p>}>
        {params.then(({ id }) => (
          <ConfirmDelete id={id} />
        ))}
      </Suspense>
    </div>
  );
}

/** Admin-only confirmation. getInvitation checks the admin session. */
async function ConfirmDelete({ id }: { id: string }) {
  const invitation = await getInvitation(id);
  if (!invitation) notFound();

  return (
    <form action={removeInvitation} className={`${cardClass} mx-auto max-w-md space-y-5`}>
      <input type="hidden" name="id" value={invitation.id} />
      <h2 className="font-serif text-2xl">{invitation.name}</h2>
      <ul className="list-disc space-y-1 pl-5">
        {invitation.guests.map((guest) => (
          <li key={guest.id}>{guest.name}</li>
        ))}
      </ul>
      <p className="text-coral">
        This removes the invitation and everyone on it
        {invitation.respondedAt ? ", including their RSVP answers" : ""}. It cannot be undone.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/admin" className={secondaryButton}>
          Cancel
        </Link>
        <button type="submit" className={dangerButton}>
          Delete invitation
        </button>
      </div>
    </form>
  );
}
