/** Limits n to the range from min to max, inclusive. Throws a RangeError when min > max. */
export function clamp(n: number, min: number, max: number): number {
  if (min > max) throw new RangeError(`min must be <= max, got min=${min}, max=${max}`);
  return Math.min(Math.max(n, min), max);
}
