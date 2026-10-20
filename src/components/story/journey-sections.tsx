import { StoryCard, StoryPhoto, StorySection } from "@/components/story/story-section";
import { engagementPhotos, funQuestions, howWeMet, proposal, timeline } from "@/content/story";

export function HowWeMet() {
  return (
    <StorySection id="how-we-met" title="How We Met" tinted>
      <p className="mb-8 text-center text-sm uppercase tracking-[0.15em] text-ink-muted">
        {howWeMet.date} &middot; {howWeMet.place}
      </p>
      <div className="grid gap-8 sm:grid-cols-2">
        {howWeMet.perspectives.map((p) => (
          <div key={p.name} className="rounded-3xl bg-shell p-6 shadow-sm">
            <h3 className="mb-2 font-serif text-xl">{p.name} says&hellip;</h3>
            <p className="text-ink-muted">{p.text}</p>
          </div>
        ))}
      </div>
    </StorySection>
  );
}

export function Timeline() {
  return (
    <StorySection id="timeline" title="Our Timeline">
      <ol className="mx-auto max-w-xl border-l-2 border-seafoam">
        {timeline.map((item) => (
          <li key={item.title} className="relative pb-8 pl-8 last:pb-0">
            <span aria-hidden className="absolute top-1.5 -left-[9px] size-4 rounded-full border-2 border-seafoam bg-sand" />
            <p className="text-sm uppercase tracking-[0.15em] text-ink-muted">{item.date}</p>
            <h3 className="font-serif text-xl">{item.title}</h3>
            <p className="text-ink-muted">{item.text}</p>
          </li>
        ))}
      </ol>
    </StorySection>
  );
}

export function Proposal() {
  return (
    <StorySection id="proposal" title="The Proposal" tinted>
      <div className="mx-auto max-w-2xl">
        <StoryCard>
          <StoryPhoto photo={proposal.photo} sizes="(min-width: 672px) 672px, 100vw" />
          <div className="space-y-3 p-6 text-center">
            <p className="text-sm uppercase tracking-[0.15em] text-ink-muted">
              {proposal.date} &middot; {proposal.place}
            </p>
            <p className="text-ink-muted">{proposal.text}</p>
          </div>
        </StoryCard>
      </div>
    </StorySection>
  );
}

export function EngagementPhotos() {
  return (
    <StorySection id="engagement" title="Engagement Photos">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {engagementPhotos.map((photo, i) => (
          <div key={i} className="overflow-hidden rounded-2xl">
            <StoryPhoto photo={photo} sizes="(min-width: 640px) 33vw, 50vw" />
          </div>
        ))}
      </div>
    </StorySection>
  );
}

export function FunQuestions() {
  return (
    <StorySection id="fun-qa" title="Fun Q&A" tinted>
      <dl className="mx-auto grid max-w-2xl gap-4">
        {funQuestions.map((item) => (
          <div key={item.question} className="rounded-2xl bg-shell px-6 py-4 shadow-sm">
            <dt className="font-serif text-lg">{item.question}</dt>
            <dd className="text-ink-muted">{item.answer}</dd>
          </div>
        ))}
      </dl>
    </StorySection>
  );
}
