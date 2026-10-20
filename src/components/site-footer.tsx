import { getWeddingSettings } from "@/lib/settings";

export async function SiteFooter() {
  const { coupleNames } = await getWeddingSettings();

  return (
    <footer className="border-t border-sand-deep px-4 py-10 text-center">
      <p className="font-serif text-lg">{coupleNames}</p>
      <div aria-hidden className="mx-auto my-4 h-px w-16 bg-seafoam" />
      <p className="text-sm text-ink-muted">We can&apos;t wait to celebrate with you.</p>
    </footer>
  );
}
