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

/** Joins the words of text, lower-casing the first and capitalising the rest, splitting as `words()` does. */
export function camelCase(text: string): string {
  return words(text)
    .map((w, i) => (i === 0 ? w : w.replace(/^./u, (c) => c.toUpperCase())))
    .join('');
}

/**
 * Breaks text into lines of at most `width` code points, only at whitespace.
 * A word longer than `width` gets a line of its own and is never split.
 */
export function wrap(text: string, width: number): string[] {
  if (!(width >= 1)) throw new RangeError(`width must be >= 1, got ${width}`);
  const lines: string[] = [];
  for (const word of text.match(/\S+/gu) ?? []) {
    const last = lines.at(-1);
    if (last !== undefined && [...last].length + 1 + [...word].length <= width) {
      lines[lines.length - 1] = `${last} ${word}`;
    } else {
      lines.push(word);
    }
  }
  return lines;
}
