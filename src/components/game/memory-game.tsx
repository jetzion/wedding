"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { GalleryPhoto } from "@/content/engagement";

const PAIRS = 8;
const MAX_MISTAKES = 10;
const PREVIEW_MS = 5000;
const FLIP_BACK_MS = 900;

type Card = { id: number; photo: GalleryPhoto };
type Status = "idle" | "preview" | "playing" | "won" | "lost";

function shuffle<T>(items: T[]) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function newDeck(photos: GalleryPhoto[]): Card[] {
  const picked = shuffle(photos).slice(0, PAIRS);
  return shuffle([...picked, ...picked]).map((photo, id) => ({ id, photo }));
}

/** 4x4 photo matching game. Ten wrong guesses and you are "not invited". */
export function MemoryGame({ photos }: { photos: GalleryPhoto[] }) {
  const [deck, setDeck] = useState<Card[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState(0);

  function start() {
    setDeck(newDeck(photos));
    setFlipped([]);
    setMatched([]);
    setMistakes(0);
    setStatus("preview");
    setTimeout(() => setStatus("playing"), PREVIEW_MS);
  }

  function flip(index: number) {
    const card = deck[index];
    if (status !== "playing" || flipped.length === 2 || flipped.includes(index)) return;
    if (matched.includes(card.photo.src.src)) return;

    const next = [...flipped, index];
    setFlipped(next);
    if (next.length < 2) return;

    const [a, b] = next.map((i) => deck[i].photo.src.src);
    if (a === b) {
      const nowMatched = [...matched, a];
      setMatched(nowMatched);
      setFlipped([]);
      if (nowMatched.length === PAIRS) setStatus("won");
      return;
    }

    const nowMistakes = mistakes + 1;
    setMistakes(nowMistakes);
    setTimeout(() => {
      setFlipped([]);
      if (nowMistakes >= MAX_MISTAKES) setStatus("lost");
    }, FLIP_BACK_MS);
  }

  const faceUp = (index: number) =>
    status === "preview" ||
    status === "lost" ||
    flipped.includes(index) ||
    matched.includes(deck[index].photo.src.src);

  return (
    <div className="mx-auto w-full max-w-lg">
      <GameStatus status={status} mistakes={mistakes} pairsFound={matched.length} onStart={start} />

      {deck.length > 0 && (
        <ul className="mt-6 grid grid-cols-4 gap-2 sm:gap-3">
          {deck.map((card, index) => (
            <li key={card.id}>
              <button
                type="button"
                onClick={() => flip(index)}
                disabled={status !== "playing"}
                aria-label={faceUp(index) ? card.photo.alt : `Card ${index + 1}, face down`}
                className="relative block aspect-square w-full overflow-hidden rounded-xl shadow-sm"
              >
                {faceUp(index) ? (
                  <Image
                    src={card.photo.src}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 120px, 25vw"
                    className={`object-cover ${matched.includes(card.photo.src.src) ? "opacity-60" : ""}`}
                  />
                ) : (
                  <span
                    aria-hidden
                    className="flex h-full w-full items-center justify-center bg-sea font-serif text-3xl text-shell/80"
                  >
                    ?
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Modal "Game Over" popup shown over the board. */
function GameOverDialog({ onRestart }: { onRestart: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    dialogRef.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="game-over-title"
      className="m-auto w-[min(90vw,26rem)] animate-pop rounded-3xl bg-shell p-8 text-center shadow-2xl backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
    >
      <h2 id="game-over-title" className="text-sm uppercase tracking-[0.3em] text-ink-muted">
        Game Over
      </h2>
      <p className="mt-4 animate-shake font-serif text-4xl leading-tight font-semibold text-coral sm:text-5xl">
        You are not invited to the wedding.
      </p>
      <p className="mt-4 text-sm text-ink-muted">(Just kidding. Try again?)</p>
      <button
        type="button"
        onClick={onRestart}
        className="mt-6 rounded-full bg-sea px-8 py-3 text-shell transition-colors hover:bg-sea-dark"
      >
        Try again
      </button>
    </dialog>
  );
}

function GameStatus({
  status,
  mistakes,
  pairsFound,
  onStart,
}: {
  status: Status;
  mistakes: number;
  pairsFound: number;
  onStart: () => void;
}) {
  const startButton = (label: string) => (
    <button
      type="button"
      onClick={onStart}
      className="rounded-full bg-sea px-8 py-3 text-shell transition-colors hover:bg-sea-dark"
    >
      {label}
    </button>
  );

  return (
    <div aria-live="polite" className="flex flex-col items-center gap-3 text-center">
      {status === "idle" && (
        <>
          <p className="max-w-md text-ink-muted">
            Find all {PAIRS} pairs of photos. You get a quick peek, then the cards flip over. Make{" "}
            {MAX_MISTAKES} wrong guesses and you&apos;re out.
          </p>
          {startButton("Start game")}
        </>
      )}
      {status === "preview" && <p className="font-serif text-2xl">Memorize the photos&hellip;</p>}
      {status === "playing" && (
        <p className="text-ink-muted">
          Pairs found: {pairsFound} of {PAIRS} &middot; Wrong guesses: {mistakes} of {MAX_MISTAKES}
        </p>
      )}
      {status === "won" && (
        <>
          <p className="font-serif text-3xl">You found them all!</p>
          <p className="text-ink-muted">Clearly you know us well. See you on the dance floor.</p>
          {startButton("Play again")}
        </>
      )}
      {status === "lost" && (
        <>
          <p className="text-ink-muted">Game Over</p>
          {startButton("Try again")}
          <GameOverDialog onRestart={onStart} />
        </>
      )}
    </div>
  );
}
