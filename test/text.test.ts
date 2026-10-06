import { describe, expect, it } from 'vitest';
import { DEFAULT_ELLIPSIS, countWords, initials, pluralize, slugify, titleCase, truncate, words } from '../src/text.js';

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

describe('truncate', () => {
  it('returns text unchanged when it fits', () => {
    expect(truncate('hello', 5)).toBe('hello');
    expect(truncate('hi', 10)).toBe('hi');
  });
  it('never exceeds max, counting the ellipsis', () => {
    const out = truncate('abcdefghij', 5);
    expect(out).toBe('abcd…');
    expect([...out].length).toBeLessThanOrEqual(5);
  });
  it('counts code points, not UTF-16 units', () => {
    expect(truncate('😀😀😀', 3)).toBe('😀😀😀');
    expect(truncate('😀😀😀😀', 3)).toBe('😀😀…');
  });
  it('cuts at the last whitespace before the limit', () => {
    expect(truncate('hello world again', 14)).toBe('hello world…');
  });
  it('keeps a whole word that ends exactly at the limit', () => {
    expect(truncate('hello world again', 12)).toBe('hello world…');
  });
  it('hard cuts when there is no whitespace before the limit', () => {
    expect(truncate('supercalifragilistic word', 6)).toBe('super…');
  });
  it('trims trailing whitespace before the ellipsis', () => {
    expect(truncate('hello    world', 9)).toBe('hello…');
  });
  it('uses a custom ellipsis', () => {
    expect(truncate('hello world again', 14, '...')).toBe('hello world...');
  });
  it('hard cuts when backing off to whitespace would leave nothing', () => {
    expect(truncate(' abcdefghij', 5)).toBe(' abc…');
    expect(truncate('  abcdefghij', 6)).toBe('  abc…');
  });
  it('returns just the ellipsis when max equals its length', () => {
    expect(truncate('hello world', 3, '...')).toBe('...');
  });
  it('throws RangeError when max is negative', () => {
    expect(() => truncate('hello', -1)).toThrow(RangeError);
  });
  it('returns the ellipsis sliced to max when max is shorter than it', () => {
    expect(truncate('hello world', 2, '...')).toBe('..');
    expect(truncate('hello world', 0)).toBe('');
  });
});

describe('DEFAULT_ELLIPSIS', () => {
  it('is the single-character ellipsis truncate uses by default', () => {
    expect(DEFAULT_ELLIPSIS).toBe('…');
    expect(truncate('abcdefghij', 5)).toBe(`abcd${DEFAULT_ELLIPSIS}`);
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

describe('titleCase', () => {
  it('capitalises each word', () => {
    expect(titleCase('hello WORLD')).toBe('Hello World');
  });
  it('collapses punctuation and extra whitespace to single spaces', () => {
    expect(titleCase('  hello,   world! ')).toBe('Hello World');
  });
  it('returns empty for empty or blank text', () => {
    expect(titleCase('')).toBe('');
    expect(titleCase('  ')).toBe('');
  });
  it('upper-cases accented first letters', () => {
    expect(titleCase('élan vital')).toBe('Élan Vital');
  });
});

describe('initials', () => {
  it('joins the upper-cased first letters of each word', () => {
    expect(initials('Ada Lovelace')).toBe('AL');
  });
  it('returns an empty string for blank text', () => {
    expect(initials('  ')).toBe('');
  });
  it('handles accented letters', () => {
    expect(initials('élodie durand')).toBe('ÉD');
  });
});

describe('pluralize', () => {
  it('returns the word unchanged when count is 1', () => {
    expect(pluralize('cat', 1)).toBe('cat');
    expect(pluralize('child', 1)).toBe('child');
  });
  it('adds -s for other counts', () => {
    expect(pluralize('cat', 2)).toBe('cats');
    expect(pluralize('cat', 0)).toBe('cats');
  });
  it('treats negative and fractional counts as plural', () => {
    expect(pluralize('cat', -1)).toBe('cats');
    expect(pluralize('cat', 1.5)).toBe('cats');
  });
  it('adds -es after s, x, z, ch and sh', () => {
    expect(pluralize('box', 0)).toBe('boxes');
    expect(pluralize('bus', 2)).toBe('buses');
    expect(pluralize('buzz', 2)).toBe('buzzes');
    expect(pluralize('church', 2)).toBe('churches');
    expect(pluralize('dish', 2)).toBe('dishes');
  });
  it('turns consonant + y into -ies, but keeps vowel + y', () => {
    expect(pluralize('city', 2)).toBe('cities');
    expect(pluralize('day', 2)).toBe('days');
  });
  it('uses the irregular table', () => {
    const irregulars: [string, string][] = [
      ['man', 'men'], ['woman', 'women'], ['child', 'children'], ['person', 'people'],
      ['mouse', 'mice'], ['goose', 'geese'], ['foot', 'feet'], ['tooth', 'teeth'],
      ['ox', 'oxen'], ['leaf', 'leaves'], ['knife', 'knives'],
      ['sheep', 'sheep'], ['fish', 'fish'], ['deer', 'deer'], ['series', 'series'], ['species', 'species'],
    ];
    for (const [singular, plural] of irregulars) expect(pluralize(singular, 2)).toBe(plural);
  });
  it('matches irregulars case-insensitively and keeps a leading capital', () => {
    expect(pluralize('Child', 2)).toBe('Children');
    expect(pluralize('Ox', 2)).toBe('Oxen');
    expect(pluralize('Sheep', 2)).toBe('Sheep');
  });
});
