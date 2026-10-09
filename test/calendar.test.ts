import { describe, expect, it } from 'vitest';
import { unfoldLines } from '../src/calendar.js';

describe('unfoldLines', () => {
  it('splits on CRLF and removes only the first whitespace of a space continuation', () => {
    expect(unfoldLines('BEGIN:VEVENT\r\nSUMMARY:Team\r\n  sync\r\nEND:VEVENT')).toEqual([
      'BEGIN:VEVENT',
      'SUMMARY:Team sync',
      'END:VEVENT',
    ]);
  });
  it('unfolds a tab continuation', () => {
    expect(unfoldLines('DESCRIPTION:ab\r\n\tcd')).toEqual(['DESCRIPTION:abcd']);
  });
  it('accepts bare LF line endings and ignores a trailing newline', () => {
    expect(unfoldLines('A:1\nB:2\n')).toEqual(['A:1', 'B:2']);
  });
  it('drops empty lines', () => {
    expect(unfoldLines('A:1\r\n\r\nB:2')).toEqual(['A:1', 'B:2']);
  });
  it('turns a leading continuation line into a line of its own, minus its first whitespace', () => {
    expect(unfoldLines(' X:1')).toEqual(['X:1']);
  });
  it('never emits an empty line, even for a lone leading continuation character', () => {
    expect(unfoldLines(' ')).toEqual([]);
    expect(unfoldLines('\t\r\nA:1')).toEqual(['A:1']);
  });
  it('returns nothing for empty text', () => {
    expect(unfoldLines('')).toEqual([]);
  });
});
