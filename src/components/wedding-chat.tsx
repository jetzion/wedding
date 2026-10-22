"use client";

import { usePathname } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";
import { ChatReply } from "@/components/chat-reply";
import { streamChat } from "@/lib/stream";

type Turn = { role: "user" | "assistant"; content: string };

type ChatProps = { starters: string[]; speakers: string[] };

/** The chat on guest pages only, not in the admin area. Reads the URL, so render it inside Suspense. */
export function GuestWeddingChat(props: ChatProps) {
  return usePathname().startsWith("/admin") ? null : <WeddingChat {...props} />;
}

/** Floating Q&A chat about the wedding. */
export function WeddingChat({ starters, speakers }: ChatProps) {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [turns]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;

    const history: Turn[] = [...turns, { role: "user", content }];
    setTurns([...history, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);
    setError(null);
    inputRef.current?.focus();

    try {
      await streamChat({ messages: history }, (reply) =>
        setTurns([...history, { role: "assistant", content: reply }]),
      );
    } catch (err) {
      setTurns(history.slice(0, -1));
      setInput(content);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void send(input);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={false}
        className="fixed right-4 bottom-4 z-50 rounded-full bg-sea px-5 py-3 text-shell shadow-lg transition-colors hover:bg-sea-dark"
      >
        Chat with us
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Wedding questions"
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
      className="fixed inset-x-0 bottom-0 z-50 flex max-h-[80dvh] flex-col rounded-t-3xl border border-sand-edge bg-sand shadow-2xl sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-96 sm:rounded-3xl"
    >
      <div className="flex items-center justify-between border-b border-sand-edge px-5 py-3">
        <h2 className="font-serif text-xl">Ask us anything</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-expanded
          className="rounded-full px-3 py-1 text-sm uppercase tracking-[0.2em] text-ink-muted hover:text-ink"
        >
          Close
        </button>
      </div>

      <div aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {turns.length === 0 && (
          <div className="space-y-3">
            <p className="text-ink-muted">
              Ask {speakers.join(" and ")} anything. Fair warning: they don&apos;t always agree.
            </p>
            <div className="flex flex-wrap gap-2">
              {starters.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => void send(q)}
                  className="rounded-full border border-seafoam px-3 py-1.5 text-sm text-ink hover:bg-shallows"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {turns.map((turn, i) =>
          turn.role === "user" ? (
            <p
              key={i}
              className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm bg-sea px-4 py-2 text-shell"
            >
              <span className="sr-only">You: </span>
              {turn.content}
            </p>
          ) : (
            <ChatReply key={i} content={turn.content} speakers={speakers} />
          ),
        )}
        {error && (
          <p role="alert" className="text-sm text-ink">
            {error}
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={onSubmit} className="flex gap-2 border-t border-sand-edge p-3">
        <label htmlFor="chat-input" className="sr-only">
          Your question
        </label>
        <input
          id="chat-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={1000}
          autoFocus
          placeholder="Type your question"
          className="min-w-0 flex-1 rounded-full border border-sand-edge bg-shell px-4 py-2 placeholder:text-ink-muted"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-full bg-sea px-4 py-2 text-shell hover:bg-sea-dark disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
