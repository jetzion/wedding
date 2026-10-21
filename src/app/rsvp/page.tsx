import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { RsvpFlow } from "@/components/rsvp/rsvp-flow";
import image from "@/assets/page-rsvp.jpg";

export const metadata: Metadata = {
  title: "RSVP",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <main className="isolate flex flex-1 flex-col bg-shallows/40">
      <PageHero title="RSVP" image={image} />
      <div className="min-h-72 px-4 py-12 sm:min-h-96 sm:py-16">
        <RsvpFlow />
      </div>
    </main>
  );
}
