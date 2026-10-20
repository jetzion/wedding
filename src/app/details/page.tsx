import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";
import image from "@/assets/page-details.jpg";

export const metadata: Metadata = { title: "Wedding Details" };

export default function Page() {
  return <PlaceholderPage title="Wedding Details" image={image} />;
}
