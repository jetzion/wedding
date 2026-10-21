import { Suspense } from "react";
import Link from "next/link";
import { addInvitation } from "@/app/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import { TextField } from "@/components/rsvp/fields";
import { requireAdmin } from "@/lib/admin/session";

const PEOPLE_ROWS = 6;

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

/** Admin-only form. Guests find this invitation by typing a person's first and last name exactly. */
async function NewInvitationForm() {
  await requireAdmin();

  return (
    <AdminForm action={addInvitation} submitLabel="Create invitation">
      <TextField label="Invitation name" name="name" placeholder="The Rivera Household" required maxLength={120} />
      <TextField label="Contact email" name="contactEmail" type="email" hint="Optional." maxLength={200} />
      <fieldset className="space-y-3">
        <legend className="font-serif text-xl">People</legend>
        <p className="text-sm text-ink-muted">
          Guests look up their invitation by first and last name, so spell them as the guest will type them.
          Leave extra rows blank.
        </p>
        {Array.from({ length: PEOPLE_ROWS }, (_, i) => (
          <div key={i} className="grid grid-cols-2 gap-3">
            <TextField label="First name" name="firstName" required={i === 0} maxLength={80} autoComplete="off" />
            <TextField label="Last name" name="lastName" required={i === 0} maxLength={80} autoComplete="off" />
          </div>
        ))}
      </fieldset>
      <label className="flex items-center gap-3">
        <input type="checkbox" name="plusOne" className="size-5 accent-sea" />
        <span>Allow a plus-one (the guest names them when they RSVP)</span>
      </label>
    </AdminForm>
  );
}
