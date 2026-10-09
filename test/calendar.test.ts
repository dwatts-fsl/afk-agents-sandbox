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
  it.each([
    ['CRLF space', '\r\n', ' '],
    ['CRLF tab', '\r\n', '\t'],
    ['LF space', '\n', ' '],
    ['LF tab', '\n', '\t'],
  ])('does not fold a %s continuation across a blank line', (_name, eol, ws) => {
    expect(unfoldLines(`SUMMARY:Off${eol}${eol}${ws}site`)).toEqual(['SUMMARY:Off', 'site']);
  });
  it('lets a blank line end a fold that is already under way', () => {
    expect(unfoldLines('A:1\r\n b\r\n\r\n c')).toEqual(['A:1b', 'c']);
  });
  it('does not fold a continuation across a blank line followed by a whitespace-only line', () => {
    expect(unfoldLines('A:1\r\n\r\n \r\n b')).toEqual(['A:1', 'b']);
  });
  it('folds a continuation that follows leading blank lines into a line of its own', () => {
    expect(unfoldLines('\r\n\r\n B')).toEqual(['B']);
  });
  it('keeps trailing and inner whitespace on a line', () => {
    expect(unfoldLines('A:1 \r\nB:2\t\r\nC:x  y')).toEqual(['A:1 ', 'B:2\t', 'C:x  y']);
  });
  it('keeps the rest of the whitespace of a continuation line that has no line before it', () => {
    expect(unfoldLines('  X:1')).toEqual([' X:1']);
    expect(unfoldLines(' \tX:1')).toEqual(['\tX:1']);
  });
  it('does not treat a bare CR as a line ending', () => {
    expect(unfoldLines('A:1\rB:2')).toEqual(['A:1\rB:2']);
  });
  it('lets only a space or tab start a continuation', () => {
    expect(unfoldLines('A:1\r\n\fb')).toEqual(['A:1', '\fb']);
    expect(unfoldLines('A:1\r\n b')).toEqual(['A:1', ' b']);
  });
  it('drops only empty lines, keeping a line that holds just whitespace', () => {
    expect(unfoldLines('A:1\r\n\r\n  ')).toEqual(['A:1', ' ']);
  });
  it('still folds a whitespace-only line, which is a continuation and not a blank line', () => {
    expect(unfoldLines('A:1\r\n \r\n b')).toEqual(['A:1b']);
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
