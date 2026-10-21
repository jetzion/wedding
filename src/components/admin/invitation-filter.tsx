import Link from "next/link";
import { secondaryButton } from "@/components/rsvp/fields";
import type { InvitationFilter } from "@/lib/admin/filter";

const inputClass = "rounded-2xl border border-sand-edge bg-sand/40 px-4 py-2.5 focus:border-sea";

/** GET form that filters the invitation list through the URL (?q=&status=). */
export function InvitationFilterForm({ filter }: { filter: InvitationFilter }) {
  return (
    <form action="/admin" className="flex flex-wrap items-end justify-center gap-3">
      <label className="flex-1 basis-48 space-y-1.5">
        <span className="block text-sm uppercase tracking-[0.15em] text-ink-muted">Search</span>
        <input
          type="search"
          name="q"
          defaultValue={filter.q}
          placeholder="Name or email"
          maxLength={100}
          className={`${inputClass} w-full`}
        />
      </label>
      <label className="space-y-1.5">
        <span className="block text-sm uppercase tracking-[0.15em] text-ink-muted">Status</span>
        <select name="status" defaultValue={filter.status} className={inputClass}>
          <option value="">Any</option>
          <option value="attending">Attending</option>
          <option value="declined">Declined</option>
          <option value="awaiting">Awaiting response</option>
        </select>
      </label>
      <button type="submit" className={secondaryButton}>
        Filter
      </button>
      {(filter.q || filter.status) && (
        <Link href="/admin" className="py-3 text-sea underline">
          Clear
        </Link>
      )}
    </form>
  );
}
