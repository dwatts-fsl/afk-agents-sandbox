import { describe, expect, it } from 'vitest';
import { countWords, slugify, words } from '../src/text.js';

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

describe('slugify', () => {
  it('joins lower-case words with hyphens', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
  });
  it('returns empty for empty or blank text', () => {
    expect(slugify('')).toBe('');
    expect(slugify('  ')).toBe('');
  });
  it('keeps accented letters as-is', () => {
    expect(slugify('Café au lait')).toBe('café-au-lait');
  });
  it('has no leading, trailing or double hyphens', () => {
    expect(slugify('--a  b--')).toBe('a-b');
  });
});
