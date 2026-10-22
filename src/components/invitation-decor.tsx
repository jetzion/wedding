import Image from "next/image";
import background from "@/assets/invitation-background.jpg";

/**
 * Watercolor stationery behind the invitation card: palms, ocean, white sand,
 * and a gold frame. Purely decorative; it sits behind the card's content.
 */
export function InvitationDecor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl">
      <Image src={background} alt="" fill placeholder="blur" sizes="(max-width: 640px) 100vw, 576px" className="object-cover" />
    </div>
  );
}

/** A thin gold rule with a small diamond in the middle. */
export function GoldDivider() {
  return (
    <div aria-hidden className="flex items-center gap-2">
      <span className="h-px w-12 bg-linear-to-r from-transparent to-gold" />
      <span className="size-1.5 rotate-45 bg-gold" />
      <span className="h-px w-12 bg-linear-to-l from-transparent to-gold" />
    </div>
  );
}
