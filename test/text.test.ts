import { describe, expect, it } from 'vitest';
import { countWords, words } from '../src/text.js';

describe('words', () => {
  it('splits on punctuation and whitespace, lower-cased', () => {
    expect(words('Hello, World!  Again')).toEqual(['hello', 'world', 'again']);
  });
  it('returns nothing for empty text', () => {
    expect(words('  ')).toEqual([]);
  });
});

describe('countWords', () => {
  it('counts words, ignoring punctuation', () => {
    expect(countWords('Hello, world!')).toBe(2);
  });
  it('returns 0 for empty or blank text', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('  ')).toBe(0);
  });
});
