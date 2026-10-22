import type { Metadata } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { GuestWeddingChat } from "@/components/wedding-chat";
import { getWeddingSettings } from "@/lib/settings";

const starters = ["When is the wedding?", "Where should I stay?", "How do I RSVP?"];
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "Our Wedding", template: "%s | Our Wedding" },
  description: "Wedding details, travel information, and RSVP.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { firstNames } = await getWeddingSettings();

  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <SiteHeader />
        {children}
        <SiteFooter />
        <Suspense fallback={null}>
          <GuestWeddingChat
            speakers={firstNames}
            starters={[...firstNames.map((name) => `Who is ${name}?`), ...starters]}
          />
        </Suspense>
      </body>
    </html>
  );
}
