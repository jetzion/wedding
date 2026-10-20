const bubbleColors = ["bg-shallows", "bg-sand-deep/70"];

type Line = { speaker: string | null; text: string };

/** Split "Name: text" lines into speaker lines; unlabeled lines join the previous one. */
function parseLines(content: string, speakers: string[]): Line[] {
  const lines: Line[] = [];
  for (const raw of content.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const speaker = speakers.find((name) => line.startsWith(`${name}:`));
    if (speaker) lines.push({ speaker, text: line.slice(speaker.length + 1).trim() });
    else if (lines.length) lines[lines.length - 1].text += ` ${line}`;
    else lines.push({ speaker: null, text: line });
  }
  return lines;
}

/** An assistant reply shown as one labeled bubble per speaker. */
export function ChatReply({ content, speakers }: { content: string; speakers: string[] }) {
  const lines = parseLines(content, speakers);

  if (!lines.length) {
    return <p className="w-fit rounded-2xl rounded-bl-sm bg-shallows px-4 py-2">&hellip;</p>;
  }

  return (
    <div className="space-y-2">
      {lines.map((line, i) => (
        <div key={i} className="w-fit max-w-[85%]">
          {line.speaker && (
            <p className="mb-0.5 ml-1 text-xs uppercase tracking-[0.15em] text-ink-muted">{line.speaker}</p>
          )}
          <p
            className={`rounded-2xl rounded-bl-sm px-4 py-2 ${bubbleColors[speakers.indexOf(line.speaker ?? "")] ?? "bg-shallows"}`}
          >
            <span className="sr-only">{line.speaker ? `${line.speaker} says: ` : "Answer: "}</span>
            {line.text}
          </p>
        </div>
      ))}
    </div>
  );
}
