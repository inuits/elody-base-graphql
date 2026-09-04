import { describe, expect, it } from 'vitest';
import path from 'path';
import { loadTranslationsFromDirectory } from '../translations/loadTranslations';

const translations = loadTranslationsFromDirectory(
  path.join(__dirname, '../translations')
);

describe('entity-translations', () => {
  Object.entries(translations).forEach(([locale, messages]) => {
    const entityTranslations = (messages as Record<string, any>)[
      'entity-translations'
    ];

    it(`holds flat vue-i18n pluralization messages for ${locale}`, () => {
      Object.entries(entityTranslations).forEach(([type, message]) => {
        expect(typeof message, type).toBe('string');
        expect((message as string).split('|').length, type).toBeLessThan(3);
      });
    });

    it(`keys entity types case insensitively for ${locale}`, () => {
      Object.keys(entityTranslations).forEach((type) =>
        expect(type).toBe(type.toLowerCase())
      );
    });
  });

  it('keeps a plural form for every base entity type', () => {
    Object.entries(translations).forEach(([locale, messages]) => {
      const entityTranslations = (messages as Record<string, any>)[
        'entity-translations'
      ];
      Object.entries(entityTranslations).forEach(([type, message]) => {
        expect((message as string), `${locale}.${type}`).toContain('|');
      });
    });
  });
});
