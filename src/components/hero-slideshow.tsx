"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useState } from "react";

const INTERVAL_MS = 6000;

/**
 * Full-bleed background photos that cross-fade in turn. Photos are centered, so
 * any cropping is even on both sides. Holds on the first photo when reduced
 * motion is preferred.
 */
export function HeroSlideshow({ images }: { images: StaticImageData[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setCurrent((i) => (i + 1) % images.length), INTERVAL_MS);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <div aria-hidden className="absolute inset-0 -z-10">
      {images.map((image, i) => (
        <Image
          key={image.src}
          src={image}
          alt=""
          fill
          preload={i === 0}
          placeholder="blur"
          sizes="(max-width: 768px) 250vw, 100vw"
          className={`object-cover object-center transition-opacity duration-1500 ${i === current ? "opacity-100" : "opacity-0"}`}
        />
      ))}
    </div>
  );
}
