import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";
import image from "@/assets/page-story.jpg";

export const metadata: Metadata = { title: "Our Story" };

export default function Page() {
  return <PlaceholderPage title="Our Story" image={image} />;
}
