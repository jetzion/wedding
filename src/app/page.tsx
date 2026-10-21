import Link from "next/link";
import heroBeach from "@/assets/hero-beach.jpg";
import heroBeachPensacola from "@/assets/hero-beach-pensacola.jpg";
import heroBeachPalms from "@/assets/hero-beach-palms.jpg";
import heroBeachShore from "@/assets/hero-beach-shore.jpg";
import { HeroSlideshow } from "@/components/hero-slideshow";

const heroImages = [heroBeach, heroBeachShore, heroBeachPalms, heroBeachPensacola];

export default function Home() {
  return (
    <main className="relative flex flex-1 items-center justify-center px-4 py-24">
      <HeroSlideshow images={heroImages} />
      <div className="flex max-w-xl flex-col items-center gap-6 rounded-3xl bg-sand/85 px-8 py-12 text-center shadow-sm backdrop-blur-sm sm:px-14">
        <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">
          Save the date
        </p>
        <h1 className="font-serif text-5xl font-medium sm:text-6xl">
          Our Wedding
        </h1>
        <div aria-hidden className="h-px w-24 bg-seafoam" />
        <p className="max-w-md text-lg text-ink-muted">
          Details are on their way. Please check back soon.
        </p>
        <Link
          href="/rsvp"
          className="rounded-full bg-sea px-8 py-3 text-shell transition-colors hover:bg-sea-dark"
        >
          RSVP
        </Link>
      </div>
    </main>
  );
}
