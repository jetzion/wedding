"use client";

import { useState } from "react";
import { newInvitationLink } from "@/app/admin/actions";

const smallButton = "rounded-full border border-sea px-4 py-1.5 text-sm text-sea transition-colors hover:bg-shallows";

/** An invitation's link with a button that copies the full address. */
export function InvitationLink({ linkName }: { linkName: string }) {
  const [copied, setCopied] = useState(false);
  const path = `/invitation/${linkName}`;

  async function copy() {
    await navigator.clipboard.writeText(`${window.location.origin}${path}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <a href={path} target="_blank" rel="noreferrer" className="break-all text-sea underline">
        {path}
      </a>
      <button type="button" onClick={copy} className={smallButton}>
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}

/** Replaces the invitation's link code after a confirmation; the old link stops working. */
export function NewLinkButton({ id }: { id: string }) {
  return (
    <form
      action={newInvitationLink}
      onSubmit={(e) => {
        if (!confirm("Make a new link? The current link will stop working for anyone who has it.")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className={smallButton}>
        New link
      </button>
    </form>
  );
}
