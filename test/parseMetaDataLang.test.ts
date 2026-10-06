import { describe, it, expect } from 'vitest';
import { parseMetaData } from '../parsers/entity';

// collection-api stores and returns a metadata item's language on the item
// itself ({ key, value, lang }), which is also what the PWA writes. Reading
// it only from nested metadata dropped the language of every translation.
describe('parseMetaData lang', () => {
  it('reads the language stored on the item', () => {
    expect(parseMetaData({ key: 'label', value: 'Een boek', lang: 'nl' }).lang).toBe('nl');
  });

  it('still reads a language given as nested metadata', () => {
    expect(parseMetaData({ key: 'label', value: 'Un livre', metadata: [{ key: 'lang', value: 'fr' }] }).lang).toBe('fr');
  });

  it('has no language for a plain value', () => {
    expect(parseMetaData({ key: 'title', value: 'x' }).lang).toBeUndefined();
  });

  it('does not fail on nested metadata without a language', () => {
    expect(parseMetaData({ key: 'title', value: 'x', metadata: [{ key: 'other', value: 'y' }] }).lang).toBeUndefined();
  });
});
