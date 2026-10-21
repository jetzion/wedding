import { Suspense } from "react";
import { signOut } from "@/app/admin/actions";
import { cardClass, secondaryButton } from "@/components/rsvp/fields";
import { requireAdmin } from "@/lib/admin";

export default function Page() {
  return (
    <div className={`${cardClass} mx-auto max-w-md space-y-5 text-center`}>
      <h1 className="font-serif text-4xl">Admin</h1>
      <Suspense fallback={<p className="text-ink-muted">Checking your sign-in…</p>}>
        <SignedIn />
      </Suspense>
    </div>
  );
}

/** Admin-only content. Reads the session per request and redirects anyone who is not an admin. */
async function SignedIn() {
  const session = await requireAdmin();

  return (
    <>
      <p className="text-ink-muted">Signed in as {session.user.email}</p>
      <form action={signOut}>
        <button type="submit" className={secondaryButton}>
          Sign out
        </button>
      </form>
    </>
  );
}
