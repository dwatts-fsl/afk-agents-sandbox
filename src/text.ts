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
