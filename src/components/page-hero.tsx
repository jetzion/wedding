import Image, { type StaticImageData } from "next/image";

/** Translucent sand panel that keeps text readable on top of a photo. */
export const frostedPanel = "rounded-3xl bg-sand/85 shadow-sm backdrop-blur-sm";

/**
 * Photo banner with the page title on a frosted panel. The photo is twice the
 * banner's height and fades to transparent over its lower half, which runs
 * behind the page content below. Render it inside an `isolate` container (the
 * page's <main>) so the photo sits above that container's background but
 * below its content.
 */
export function PageHero({ title, image }: { title: string; image: StaticImageData }) {
  return (
    <section className="relative flex min-h-72 items-center justify-center px-4 py-16 sm:min-h-96">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-144 sm:h-192">
        <Image
          src={image}
          alt=""
          fill
          preload
          placeholder="blur"
          sizes="(max-width: 768px) 250vw, (max-width: 1280px) 150vw, 100vw"
          className="object-cover mask-b-from-50% mask-b-to-100%"
        />
      </div>
      <div className={`${frostedPanel} px-10 py-6 text-center`}>
        <h1 className="font-serif text-4xl font-medium sm:text-5xl">{title}</h1>
      </div>
    </section>
  );
}
