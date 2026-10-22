import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { frostedPanel } from "@/components/page-hero";
import { primaryButton, secondaryButton } from "@/components/rsvp/fields";
import { getInvitationByLinkName } from "@/lib/invitation-lookup";
import { getWeddingSettings } from "@/lib/settings";
import photo from "@/assets/hero-beach.jpg";

export const metadata: Metadata = {
  title: "You're invited",
  robots: { index: false, follow: false },
};

const card = `${frostedPanel} flex w-full max-w-xl flex-col items-center gap-6 px-8 py-12 text-center sm:px-14`;
const divider = <div aria-hidden className="h-px w-24 bg-seafoam" />;
const eyebrow = "text-sm uppercase tracking-[0.3em] text-ink-muted";

/**
 * A household's personal invitation at /invitation/[linkName], addressed by
 * invitationGreeting(): one or two guests by full name, larger households by
 * invitation name.
 */
export default function Page({ params }: PageProps<"/invitation/[linkName]">) {
  return (
    <main className="relative flex flex-1 items-center justify-center px-4 py-24">
      <div aria-hidden className="absolute inset-0 -z-10">
        <Image
          src={photo}
          alt=""
          fill
          preload
          placeholder="blur"
          sizes="(max-width: 768px) 250vw, 100vw"
          className="object-cover object-center"
        />
      </div>
      <Suspense fallback={<LoadingCard />}>
        {params.then(({ linkName }) => (
          <Invitation linkName={linkName} />
        ))}
      </Suspense>
    </main>
  );
}

async function Invitation({ linkName }: { linkName: string }) {
  const [invitation, { coupleNames }] = await Promise.all([
    getInvitationByLinkName(decodeURIComponent(linkName)),
    getWeddingSettings(),
  ]);
  if (!invitation) return <NotFoundCard />;
  const [first, second] = coupleNames.split(" & ");

  return (
    <article className={card}>
      <p className={eyebrow}>You&apos;re invited</p>
      <p className="font-serif text-2xl text-balance italic sm:text-3xl">Dear {invitation.greeting},</p>
      <h1 className="font-serif text-5xl font-medium leading-tight sm:text-6xl">
        {first}
        <span className="block text-3xl text-ink-muted sm:text-4xl">&amp;</span>
        {second}
      </h1>
      <p className="max-w-sm text-lg text-balance text-ink-muted">request the pleasure of your company at their wedding</p>
      {divider}
      <div className="space-y-1 text-lg">
        <p className="font-serif text-2xl">[Saturday, Month Day, Year]</p>
        <p>[Ceremony time]</p>
        <p>[Venue name]</p>
        <p>[City, Florida]</p>
        <p className="text-ink-muted">Dress code: [Dress code]</p>
      </div>
      {divider}
      <p className="text-lg">Kindly reply by [RSVP date]</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/rsvp" className={primaryButton}>
          RSVP
        </Link>
        <Link href="/details" className={secondaryButton}>
          Wedding details
        </Link>
      </div>
      <Link href="/travel" className="text-sea underline">
        Travel and places to stay
      </Link>
    </article>
  );
}

/** Same message for any unknown, replaced, or deleted link, so it reveals nothing. */
function NotFoundCard() {
  return (
    <article className={card}>
      <p className={eyebrow}>Invitation</p>
      <h1 className="font-serif text-4xl font-medium text-balance sm:text-5xl">We couldn&apos;t find this invitation</h1>
      {divider}
      <p className="max-w-sm text-lg text-ink-muted">Please check the link, or RSVP by name.</p>
      <Link href="/rsvp" className={primaryButton}>
        RSVP
      </Link>
    </article>
  );
}

function LoadingCard() {
  return (
    <div className={card}>
      <p className={eyebrow}>You&apos;re invited</p>
      <p className="text-ink-muted">Opening your invitation…</p>
    </div>
  );
}
