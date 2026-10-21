import Image from "next/image";
import type { ReactNode } from "react";
import { frostedPanel } from "@/components/page-hero";
import type { Photo } from "@/content/story";

/**
 * A titled Our Story section. Tinted sections use the pale aqua background.
 * Use overPhoto when the heading sits on top of the page banner photo.
 */
export function StorySection({
  id,
  title,
  tinted = false,
  overPhoto = false,
  children,
}: {
  id: string;
  title: string;
  tinted?: boolean;
  overPhoto?: boolean;
  children: ReactNode;
}) {
  const heading = (
    <>
      <h2 id={id} className="text-center font-serif text-3xl font-medium sm:text-4xl">
        {title}
      </h2>
      <div aria-hidden className="mx-auto mt-4 h-px w-24 bg-seafoam" />
    </>
  );

  return (
    <section aria-labelledby={id} className={tinted ? "bg-shallows/60" : undefined}>
      <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
        {overPhoto ? (
          <div className={`${frostedPanel} mx-auto mb-10 w-fit px-10 py-6`}>{heading}</div>
        ) : (
          <div className="mb-10">{heading}</div>
        )}
        {children}
      </div>
    </section>
  );
}

/** A photo, or a "Photo coming soon" box when there is none yet. */
export function StoryPhoto({ photo, sizes }: { photo: Photo; sizes: string }) {
  if (!photo) {
    return (
      <div className="flex aspect-[3/2] w-full items-center justify-center border-2 border-dashed border-sand-edge bg-sand text-sm uppercase tracking-[0.2em] text-ink-muted">
        Photo coming soon
      </div>
    );
  }
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      placeholder="blur"
      sizes={sizes}
      className="aspect-[3/2] w-full object-cover"
    />
  );
}

/** White rounded card used throughout Our Story. */
export function StoryCard({ children }: { children: ReactNode }) {
  return <div className="overflow-hidden rounded-3xl border border-sand-edge bg-shell shadow-sm">{children}</div>;
}
