import { StoryCard, StoryPhoto, StorySection } from "@/components/story/story-section";
import { childhood, couple, education, loveNotes } from "@/content/story";

const halfWidth = "(min-width: 640px) 50vw, 100vw";

export function MeetTheCouple() {
  return (
    <StorySection id="meet" title="Meet the Couple">
      <div className="grid gap-8 sm:grid-cols-2">
        {couple.map((person) => (
          <StoryCard key={person.name}>
            <StoryPhoto photo={person.photo} sizes={halfWidth} />
            <div className="space-y-4 p-6">
              <h3 className="text-center font-serif text-2xl">{person.name}</h3>
              <p className="text-ink-muted">{person.bio}</p>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                {person.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt className="uppercase tracking-[0.15em] text-ink-muted">{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </StoryCard>
        ))}
      </div>
    </StorySection>
  );
}

export function EarlyChildhood() {
  return (
    <StorySection id="childhood" title="Early Childhood" tinted>
      <div className="grid gap-8 sm:grid-cols-2">
        {childhood.map((person) => (
          <StoryCard key={person.name}>
            <StoryPhoto photo={person.photo} sizes={halfWidth} />
            <div className="space-y-2 p-6 text-center">
              <h3 className="font-serif text-2xl">Little {person.name}</h3>
              <p className="text-sm uppercase tracking-[0.15em] text-ink-muted">{person.place}</p>
              <p className="text-ink-muted">{person.text}</p>
            </div>
          </StoryCard>
        ))}
      </div>
    </StorySection>
  );
}

export function Education() {
  return (
    <StorySection id="education" title="Education">
      <div className="grid gap-8 sm:grid-cols-2">
        {education.map((grad) => (
          <StoryCard key={grad.name}>
            <StoryPhoto photo={grad.photo} sizes={halfWidth} />
            <div className="space-y-2 p-6 text-center">
              <h3 className="font-serif text-2xl">{grad.name}&apos;s graduation</h3>
              <dl className="text-ink-muted">
                <dt className="sr-only">School</dt>
                <dd>{grad.school}</dd>
                <dt className="sr-only">Field of study</dt>
                <dd>{grad.field}</dd>
                <dt className="sr-only">Year</dt>
                <dd className="text-sm tracking-[0.2em]">{grad.year}</dd>
              </dl>
            </div>
          </StoryCard>
        ))}
      </div>
    </StorySection>
  );
}

export function LoveNotes() {
  return (
    <StorySection id="love-notes" title="What We Love About Each Other">
      <div className="grid gap-8 sm:grid-cols-2">
        {loveNotes.map((note) => (
          <figure key={note.from} className="rounded-3xl border border-sand-edge bg-shell p-8 text-center shadow-sm">
            <blockquote className="font-serif text-xl italic">&ldquo;{note.text}&rdquo;</blockquote>
            <figcaption className="mt-4 text-sm uppercase tracking-[0.15em] text-ink-muted">
              {note.from} on {note.about}
            </figcaption>
          </figure>
        ))}
      </div>
    </StorySection>
  );
}
