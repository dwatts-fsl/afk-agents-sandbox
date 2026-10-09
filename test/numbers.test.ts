import { describe, expect, it } from 'vitest';
import { clamp } from '../src/numbers.js';

describe('clamp', () => {
  it('returns n when it is within the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });
  it('returns min when n is below the range', () => {
    expect(clamp(-1, 0, 10)).toBe(0);
  });
  it('returns max when n is above the range', () => {
    expect(clamp(11, 0, 10)).toBe(10);
  });
  it('treats min and max as inclusive', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });
  it('returns the bound when min equals max', () => {
    expect(clamp(3, 3, 3)).toBe(3);
  });
  it('throws a RangeError when min is greater than max', () => {
    expect(() => clamp(5, 10, 0)).toThrow(RangeError);
  });
});
