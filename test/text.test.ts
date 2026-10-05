import { describe, expect, it } from 'vitest';
import { words } from '../src/text.js';

describe('words', () => {
  it('splits on punctuation and whitespace, lower-cased', () => {
    expect(words('Hello, World!  Again')).toEqual(['hello', 'world', 'again']);
  });
  it('returns nothing for empty text', () => {
    expect(words('  ')).toEqual([]);
  });
});
