"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { GalleryPhoto } from "@/content/engagement";

const isWide = (photo: GalleryPhoto) => photo.src.width > photo.src.height;

/**
 * Grid tile for photo i. Tall photos take one cell; wide photos take two
 * (alternating sides from sm up) and fill out rows with a tall photo; a wide
 * last photo closes the gallery at full width.
 */
function tileClass(photos: GalleryPhoto[], i: number) {
  if (!isWide(photos[i])) return "aspect-[2/3]";
  if (i === photos.length - 1) return "col-span-2 aspect-[3/2] sm:col-span-3 sm:aspect-[16/9]";
  const wideBefore = photos.slice(0, i).filter(isWide).length;
  return `col-span-2 aspect-[3/2] sm:aspect-auto ${wideBefore % 2 ? "sm:col-start-2" : ""}`;
}

/** Even photo grid; tapping a photo opens it full-size with next/previous. */
export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (index === null) dialogRef.current?.close();
    else if (!dialogRef.current?.open) dialogRef.current?.showModal();
  }, [index]);

  const step = (delta: number) =>
    setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length));

  const current = index === null ? null : photos[index];

  return (
    <>
      <ul className="grid grid-flow-dense grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {photos.map((photo, i) => (
          <li key={photo.src.src} className={tileClass(photos, i)}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              className="relative block size-full overflow-hidden rounded-2xl"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                placeholder="blur"
                fill
                sizes={isWide(photo) ? "(min-width: 1024px) 660px, (min-width: 640px) 66vw, 100vw" : "(min-width: 1024px) 320px, (min-width: 640px) 33vw, 50vw"}
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        onClose={() => setIndex(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-ink/90"
      >
        {current && (
          <div className="flex h-dvh w-screen flex-col items-center justify-center gap-3 p-4">
            <div className="relative h-full w-full">
              <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
            </div>
            <p className="text-center text-sm text-shell">{current.alt}</p>
            <div className="flex items-center gap-4 text-shell">
              <button type="button" onClick={() => step(-1)} className="rounded-full px-4 py-2 hover:bg-shell/10">
                &larr; Previous
              </button>
              <span className="text-sm">
                {index! + 1} / {photos.length}
              </span>
              <button type="button" onClick={() => step(1)} className="rounded-full px-4 py-2 hover:bg-shell/10">
                Next &rarr;
              </button>
              <button type="button" onClick={() => setIndex(null)} className="rounded-full px-4 py-2 hover:bg-shell/10">
                Close
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
