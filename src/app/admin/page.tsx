import { Suspense } from "react";
import Link from "next/link";
import { signOut } from "@/app/admin/actions";
import { InvitationFilterForm } from "@/components/admin/invitation-filter";
import { InvitationList, InvitationSummary } from "@/components/admin/invitation-list";
import { primaryButton, secondaryButton } from "@/components/rsvp/fields";
import { filterInvitations, readFilter } from "@/lib/admin/filter";
import { listInvitations } from "@/lib/admin/invitations";
import { requireAdmin } from "@/lib/admin/session";
import { getWeddingSettings } from "@/lib/settings";

export default function Page({ searchParams }: PageProps<"/admin">) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-8">
      <h1 className="text-center font-serif text-4xl">Invitations</h1>
      <Suspense fallback={<p className="text-center text-ink-muted">Loading invitations…</p>}>
        {searchParams.then((params) => (
          <Dashboard params={params} />
        ))}
      </Suspense>
    </div>
  );
}

/** Admin-only content. Reads the session per request and redirects anyone who is not an admin. */
async function Dashboard({ params }: { params: Record<string, string | string[] | undefined> }) {
  const session = await requireAdmin();
  const [invitations, settings] = await Promise.all([listInvitations(), getWeddingSettings()]);
  const filter = readFilter(params);
  const shown = filterInvitations(invitations, filter);
  const filtering = Boolean(filter.q || filter.status);

  return (
    <>
      {params.password === "changed" && (
        <p role="status" className="text-center text-sea">
          Your password was changed. Your other devices have been signed out.
        </p>
      )}
      <InvitationSummary invitations={invitations} />
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/admin/invitations/new" className={primaryButton}>
          Add invitation
        </Link>
        <a href="/admin/export" download className={secondaryButton}>
          Export CSV
        </a>
      </div>
      <InvitationFilterForm filter={filter} />
      {filtering && (
        <p className="text-center text-sm text-ink-muted">
          Showing {shown.length} of {invitations.length} invitations
        </p>
      )}
      {filtering && !shown.length ? (
        <p className="text-center text-ink-muted">No invitations match.</p>
      ) : (
        <InvitationList invitations={shown} timezone={settings.timezone} />
      )}
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-ink-muted">
        <span>Signed in as {session.user.email}</span>
        <Link href="/admin/password" className={secondaryButton}>
          Change password
        </Link>
        <form action={signOut}>
          <button type="submit" className={secondaryButton}>
            Sign out
          </button>
        </form>
      </div>
    </>
  );
}
