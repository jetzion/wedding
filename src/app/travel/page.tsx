import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";
import image from "@/assets/page-travel.jpg";

export const metadata: Metadata = { title: "Travel" };

export default function Page() {
  return <PlaceholderPage title="Travel" image={image} />;
}
