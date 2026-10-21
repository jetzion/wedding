import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { getWeddingSettings } from "@/lib/settings";

export async function SiteHeader() {
  const { coupleNames } = await getWeddingSettings();

  return (
    <header className="relative z-40 border-b border-sand-edge">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="font-serif text-xl leading-tight font-medium text-balance sm:text-2xl">
          {coupleNames}
        </Link>
        <SiteNav />
      </div>
    </header>
  );
}
