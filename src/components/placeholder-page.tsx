import type { StaticImageData } from "next/image";
import { PageHero } from "@/components/page-hero";

/** Temporary page body for sections that are not built yet. */
export function PlaceholderPage({ title, image }: { title: string; image: StaticImageData }) {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero title={title} image={image} />
      <div className="flex flex-1 flex-col items-center gap-6 px-6 py-16 text-center">
        <div aria-hidden className="h-px w-24 bg-seafoam" />
        <p className="max-w-md text-lg text-ink-muted">Coming soon.</p>
      </div>
    </main>
  );
}
