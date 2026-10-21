import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/page-hero";
import { RsvpFlow } from "@/components/rsvp/rsvp-flow";
import image from "@/assets/page-rsvp.jpg";

export const metadata: Metadata = {
  title: "RSVP",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="flex flex-1 flex-col">
      <PageHero title="RSVP" image={image} />
      <div className="bg-shallows/40 px-4 py-12 sm:py-16">
        <Suspense>
          <RsvpFlow />
        </Suspense>
      </div>
    </main>
  );
}
