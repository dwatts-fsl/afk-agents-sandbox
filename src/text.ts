/** Splits text into lower-case words on anything that is not a letter or digit. */
export function words(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w.length > 0);
}

/** Counts the words in text, splitting as `words()` does. */
export function countWords(text: string): number {
  return words(text).length;
}

/** The ellipsis `truncate()` appends when none is given. */
export const DEFAULT_ELLIPSIS = '…';

/**
 * Shortens text to at most `max` code points, ellipsis included. Cuts at the
 * last whitespace before the limit when there is one, else mid-word.
 */
export function truncate(text: string, max: number, ellipsis = DEFAULT_ELLIPSIS): string {
  if (max < 0) throw new RangeError(`max must be >= 0, got ${max}`);
  const chars = [...text];
  if (chars.length <= max) return text;
  const ellipsisChars = [...ellipsis];
  if (max < ellipsisChars.length) return ellipsisChars.slice(0, max).join('');

  const budget = max - ellipsisChars.length;
  const hardCut = chars.slice(0, budget).join('').trimEnd();
  // chars[budget] always exists here; `?? ''` only satisfies noUncheckedIndexedAccess.
  if (isSpace(chars[budget] ?? '')) return hardCut + ellipsis;
  const lastSpace = chars.slice(0, budget).findLastIndex(isSpace);
  const wordCut = chars.slice(0, Math.max(lastSpace, 0)).join('').trimEnd();
  return (wordCut || hardCut) + ellipsis;
}

function isSpace(c: string): boolean {
  return /\s/u.test(c);
}

/** Joins the lower-case words of text with `-`, splitting as `words()` does. */
export function slugify(text: string): string {
  return words(text).join('-');
}

/** Joins the capitalised words of text with single spaces, splitting as `words()` does. */
export function titleCase(text: string): string {
  return words(text)
    .map((w) => w.replace(/^./u, (c) => c.toUpperCase()))
    .join(' ');
}

/** Joins the upper-cased first letters of each word of text, splitting as `words()` does. */
export function initials(text: string): string {
  return words(text)
    .map((w) => [...w][0]?.toUpperCase() ?? '')
    .join('');
}

/** Lower-case singular → plural for nouns the suffix rules in `pluralize()` get wrong. */
const IRREGULAR_PLURALS: Readonly<Record<string, string>> = {
  man: 'men',
  woman: 'women',
  child: 'children',
  person: 'people',
  mouse: 'mice',
  goose: 'geese',
  foot: 'feet',
  tooth: 'teeth',
  ox: 'oxen',
  leaf: 'leaves',
  knife: 'knives',
  sheep: 'sheep',
  fish: 'fish',
  deer: 'deer',
  series: 'series',
  species: 'species',
};

/**
 * Returns `word` when `count` is 1, else its English plural: irregular nouns
 * from a fixed table, then `-es` after s/x/z/ch/sh, `-ies` after consonant + y,
 * else `-s`. Matches irregulars case-insensitively and keeps a leading capital.
 */
export function pluralize(word: string, count: number): string {
  if (count === 1) return word;
  const irregular = Object.hasOwn(IRREGULAR_PLURALS, word.toLowerCase())
    ? IRREGULAR_PLURALS[word.toLowerCase()]
    : undefined;
  if (irregular !== undefined) {
    return /^\p{Lu}/u.test(word) ? irregular.replace(/^./u, (c) => c.toUpperCase()) : irregular;
  }
  if (/(?:[sxz]|ch|sh)$/iu.test(word)) return `${word}es`;
  if (/[^aeiou]y$/iu.test(word)) return `${word.slice(0, -1)}ies`;
  return `${word}s`;
}
