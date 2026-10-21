import type { StaticImageData } from "next/image";
import { frostedPanel, PageHero } from "@/components/page-hero";

/** Temporary page body for sections that are not built yet. */
export function PlaceholderPage({ title, image }: { title: string; image: StaticImageData }) {
  return (
    <main className="isolate flex flex-1 flex-col">
      <PageHero title={title} image={image} />
      <div className="flex min-h-72 flex-1 flex-col items-center gap-6 px-6 py-16 text-center sm:min-h-96">
        <div className={`${frostedPanel} flex flex-col items-center gap-6 px-10 py-6`}>
          <div aria-hidden className="h-px w-24 bg-seafoam" />
          <p className="max-w-md text-lg text-ink-muted">Coming soon.</p>
        </div>
      </div>
    </main>
  );
}
