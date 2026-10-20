import type { Metadata } from "next";
import { MemoryGame } from "@/components/game/memory-game";
import { engagementPhotos } from "@/content/engagement";
import { education } from "@/content/story";

export const metadata: Metadata = { title: "Game" };

const photos = [...engagementPhotos, ...education.map((grad) => grad.photo)];

export default function Page() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12 sm:py-16">
      <h1 className="font-serif text-4xl font-medium sm:text-5xl">Match the Memories</h1>
      <div aria-hidden className="mt-4 mb-8 h-px w-24 bg-seafoam" />
      <MemoryGame photos={photos} />
    </main>
  );
}
