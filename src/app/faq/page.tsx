import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";
import image from "@/assets/page-faq.jpg";

export const metadata: Metadata = { title: "FAQ" };

export default function Page() {
  return <PlaceholderPage title="FAQ" image={image} />;
}
