import { Suspense } from "react";
import Link from "next/link";
import { signOut } from "@/app/admin/actions";
import { InvitationList, InvitationSummary } from "@/components/admin/invitation-list";
import { primaryButton, secondaryButton } from "@/components/rsvp/fields";
import { listInvitations } from "@/lib/admin/invitations";
import { requireAdmin } from "@/lib/admin/session";
import { getWeddingSettings } from "@/lib/settings";

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <h1 className="text-center font-serif text-4xl">Invitations</h1>
      <Suspense fallback={<p className="text-center text-ink-muted">Loading invitations…</p>}>
        <Dashboard />
      </Suspense>
    </div>
  );
}

/** Admin-only content. Reads the session per request and redirects anyone who is not an admin. */
async function Dashboard() {
  const session = await requireAdmin();
  const [invitations, settings] = await Promise.all([listInvitations(), getWeddingSettings()]);

  return (
    <>
      <InvitationSummary invitations={invitations} />
      <div className="text-center">
        <Link href="/admin/invitations/new" className={primaryButton}>
          Add invitation
        </Link>
      </div>
      <InvitationList invitations={invitations} timezone={settings.timezone} />
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-ink-muted">
        <span>Signed in as {session.user.email}</span>
        <form action={signOut}>
          <button type="submit" className={secondaryButton}>
            Sign out
          </button>
        </form>
      </div>
    </>
  );
}
