const hits = new Map<string, number[]>();

/**
 * Sliding-window rate limit kept in memory. Per server instance only, so it
 * slows down abuse but is not a hard guarantee on serverless hosting.
 */
export function isRateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > limit;
}
