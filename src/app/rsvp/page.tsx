import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";
import image from "@/assets/page-rsvp.jpg";

export const metadata: Metadata = { title: "RSVP" };

export default function Page() {
  return <PlaceholderPage title="RSVP" image={image} />;
}
