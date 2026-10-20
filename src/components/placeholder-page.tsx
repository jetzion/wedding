/** Temporary page body for sections that are not built yet. */
export function PlaceholderPage({ title }: { title: string }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <h1 className="font-serif text-4xl font-medium sm:text-5xl">{title}</h1>
      <div aria-hidden className="h-px w-24 bg-seafoam" />
      <p className="max-w-md text-lg text-ink-muted">Coming soon.</p>
    </main>
  );
}
