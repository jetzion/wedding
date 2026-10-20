import Image, { type StaticImageData } from "next/image";

/** Photo banner with the page title on a frosted panel. */
export function PageHero({ title, image }: { title: string; image: StaticImageData }) {
  return (
    <section className="relative flex min-h-72 items-center justify-center px-4 py-16 sm:min-h-96">
      <Image
        src={image}
        alt=""
        fill
        preload
        placeholder="blur"
        sizes="(max-width: 768px) 150vw, 100vw"
        className="-z-10 object-cover"
      />
      <div className="rounded-3xl bg-sand/85 px-10 py-6 text-center shadow-sm backdrop-blur-sm">
        <h1 className="font-serif text-4xl font-medium sm:text-5xl">{title}</h1>
      </div>
    </section>
  );
}
