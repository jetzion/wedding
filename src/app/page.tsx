export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-ink-muted">
        Save the date
      </p>
      <h1 className="font-serif text-5xl font-medium sm:text-6xl">
        Our Wedding
      </h1>
      <div aria-hidden className="h-px w-24 bg-seafoam" />
      <p className="max-w-md text-lg text-ink-muted">
        Details are on their way. Please check back soon.
      </p>
      <a
        href="#"
        className="rounded-full bg-sea px-8 py-3 text-shell transition-colors hover:bg-sea-dark"
      >
        RSVP
      </a>
    </main>
  );
}
