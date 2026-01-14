export const isFresh = (ageMs: number | undefined, maxStaleMs: number): boolean =>
  ageMs !== undefined && ageMs <= maxStaleMs;
