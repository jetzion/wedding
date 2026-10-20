import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";
import image from "@/assets/page-details.jpg";

export const metadata: Metadata = { title: "Details" };

export default function Page() {
  return <PlaceholderPage title="Details" image={image} />;
}
