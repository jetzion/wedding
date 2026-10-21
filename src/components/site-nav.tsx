"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks } from "@/lib/nav";

/** Main navigation with the current page marked. Reads the URL, so render it inside Suspense. */
export function ActiveSiteNav() {
  return <SiteNav pathname={usePathname()} />;
}

/** Main navigation: inline links on desktop, a toggle menu on mobile. */
export function SiteNav({ pathname }: { pathname?: string }) {
  const [open, setOpen] = useState(false);

  const links = navLinks.map(({ href, label }) => (
    <li key={href}>
      <Link
        href={href}
        onClick={() => setOpen(false)}
        aria-current={pathname === href ? "page" : undefined}
        className="block py-2 tracking-wide whitespace-nowrap text-ink-muted transition-colors hover:text-sea aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:decoration-seafoam aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8"
      >
        {label}
      </Link>
    </li>
  ));

  return (
    <nav aria-label="Main">
      <ul className="hidden gap-8 lg:flex">{links}</ul>

      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        className="rounded-full px-4 py-2 text-sm uppercase tracking-[0.2em] text-ink lg:hidden"
      >
        {open ? "Close" : "Menu"}
      </button>

      {open && (
        <ul
          id="mobile-menu"
          className="absolute inset-x-0 top-full flex flex-col items-center gap-2 border-b border-sand-edge bg-sand py-6 text-lg lg:hidden"
        >
          {links}
        </ul>
      )}
    </nav>
  );
}
