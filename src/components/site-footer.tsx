import { getWeddingSettings } from "@/lib/settings";

export async function SiteFooter() {
  const { coupleNames } = await getWeddingSettings();

  return (
    <footer>
      <svg
        aria-hidden
        viewBox="0 0 1440 48"
        preserveAspectRatio="none"
        className="relative -mt-8 block h-8 w-full sm:-mt-12 sm:h-12"
      >
        <path
          d="M0 24 C240 48 480 0 720 24 S1200 48 1440 24 V48 H0 Z"
          className="fill-shallows"
        />
        <path
          d="M0 24 C240 48 480 0 720 24 S1200 48 1440 24"
          fill="none"
          strokeWidth="1.5"
          className="stroke-seafoam"
        />
      </svg>
      <div className="bg-shallows px-4 pt-6 pb-24 text-center sm:pb-10">
        <p className="font-serif text-lg">{coupleNames}</p>
        <div aria-hidden className="mx-auto my-4 h-px w-16 bg-seafoam" />
        <p className="text-sm text-ink-muted">We can&apos;t wait to celebrate with you.</p>
      </div>
    </footer>
  );
}
