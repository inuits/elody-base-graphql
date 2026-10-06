import { describe, it, expect } from 'vitest';
import { baseResolver } from '../baseModule/baseResolver';
import { baseSchema } from '../baseModule/baseSchema.schema';
import { print } from 'graphql';

// SHACL 1.2 UI: sh:languageIn gives the order in which a renderer prefers
// language-tagged values. A field passes that order on to the PWA.
describe('PanelMetaData.languageIn', () => {
  const languageIn = (baseResolver.PanelMetaData as any).languageIn;

  it('is declared on PanelMetaData', () => {
    const schema = typeof baseSchema === 'string' ? baseSchema : print(baseSchema as any);
    expect(schema).toMatch(/type PanelMetaData \{[\s\S]*?languageIn\(input: \[String!\]\): \[String!\]/);
  });

  it('returns the declared language order', async () => {
    expect(await languageIn({}, { input: ['fr', 'en'] }, {})).toEqual(['fr', 'en']);
  });

  it('is empty when the field declares none', async () => {
    expect(await languageIn({}, {}, {})).toEqual([]);
  });
});
