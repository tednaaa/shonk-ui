import { toCsv } from './toCsv';

const byteOrderMark = '﻿';

describe('toCsv', () => {
  it('should start with a byte order mark so Excel reads non-ascii text', () => {
    expect(toCsv({ header: ['Name'], rows: [] }).startsWith(byteOrderMark)).toBe(true);
  });

  it('should separate values with a semicolon and rows with a line break', () => {
    const csv = toCsv({ header: ['Name', 'Age'], rows: [['Ada', 36], ['Linus', 54]] });

    expect(csv).toBe(`${byteOrderMark}Name;Age\r\nAda;36\r\nLinus;54`);
  });

  it('should quote a value with a semicolon, a quote or a line break in it', () => {
    const csv = toCsv({ header: ['Company'], rows: [['Chanay; Jeffrey'], ['Ada "the first"'], ['first\nsecond']] });

    expect(csv).toBe(`${byteOrderMark}Company\r\n"Chanay; Jeffrey"\r\n"Ada ""the first"""\r\n"first\nsecond"`);
  });

  it('should leave an empty value for a missing one', () => {
    expect(toCsv({ header: ['Name', 'Age'], rows: [[null, undefined]] })).toBe(`${byteOrderMark}Name;Age\r\n;`);
  });
});
