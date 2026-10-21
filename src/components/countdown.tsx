"use client";

import { useSyncExternalStore } from "react";
import { timeUntil } from "@/lib/countdown";

/** Re-render every second. */
function subscribe(onTick: () => void) {
  const id = setInterval(onTick, 1000);
  return () => clearInterval(id);
}
const nowInSeconds = () => Math.floor(Date.now() / 1000) * 1000;
/** The server has no "now" for the visitor, so it renders placeholders until the browser takes over. */
const noTimeOnServer = () => null;

/** Days, hours, minutes, and seconds until the wedding, ticking every second. */
export function Countdown({ target }: { target: string }) {
  const now = useSyncExternalStore(subscribe, nowInSeconds, noTimeOnServer);
  const left = now === null ? undefined : timeUntil(Date.parse(target), now);

  if (left === null) {
    return <p className="font-serif text-2xl text-sea">Today we celebrate!</p>;
  }

  const units = [
    ["Days", left?.days],
    ["Hours", left?.hours],
    ["Minutes", left?.minutes],
    ["Seconds", left?.seconds],
  ] as const;

  return (
    <div role="timer" aria-label="Countdown to the wedding" className="grid w-full grid-cols-4 gap-2 sm:gap-3">
      {units.map(([label, value], i) => (
        <div
          key={label}
          className="flex flex-col items-center rounded-2xl border border-sand-edge bg-shell/80 px-1 py-3 sm:py-4"
        >
          <span className="font-serif text-3xl leading-none lining-nums tabular-nums text-ink sm:text-4xl">
            {value === undefined ? "--" : i === 0 ? value : String(value).padStart(2, "0")}
          </span>
          <span className="mt-2 text-[0.65rem] uppercase tracking-[0.2em] text-ink-muted sm:text-xs">{label}</span>
        </div>
      ))}
    </div>
  );
}
