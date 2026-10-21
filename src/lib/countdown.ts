export type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

/** Whole days, hours, minutes, and seconds from now until the target, or null once it has passed. */
export function timeUntil(targetMs: number, nowMs: number): TimeLeft | null {
  const total = Math.floor((targetMs - nowMs) / 1000);
  if (total <= 0) return null;
  return {
    days: Math.floor(total / 86_400),
    hours: Math.floor(total / 3600) % 24,
    minutes: Math.floor(total / 60) % 60,
    seconds: total % 60,
  };
}
