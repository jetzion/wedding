import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/placeholder-page";

export const metadata: Metadata = { title: "Travel" };

export default function Page() {
  return <PlaceholderPage title="Travel" />;
}
