/**
 * Splits iCalendar text into content lines, undoing RFC 5545 line folding: a
 * line starting with a space or tab continues the line before it, minus that
 * first character. Lines end with CRLF or LF; empty lines are dropped, but
 * still end a fold.
 */
export function unfoldLines(text: string): string[] {
  const lines: string[] = [];
  for (const raw of text.split(/\r?\n/u)) {
    const continuation = raw.startsWith(' ') || raw.startsWith('\t');
    const content = continuation ? raw.slice(1) : raw;
    const last = lines.at(-1);
    if (continuation && last !== undefined) {
      lines[lines.length - 1] = last + content;
    } else {
      lines.push(content);
    }
  }
  return lines.filter((line) => line !== '');
}
