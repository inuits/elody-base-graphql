import { describe, it, expect } from 'vitest';
import { extractValueFromEntity } from '../resolvers/intialValueResolver';

// SHACL 1.2 UI value-node labels: the label properties in their preference
// order (metadataKeyAsLabel "a|b|c"), each value chosen by language, and the
// local name of the IRI when the related entity has no label.
const entity = (...metadata: { key: string; value: string; lang?: string }[]) => ({ metadata });
const relation = { key: 'http://example.org/ns#researchDept', type: 'isMemberFor' };

describe('extractValueFromEntity', () => {
  it('takes the label keys in their preference order, not the metadata order', () => {
    const e = entity({ key: 'title', value: 'Title' }, { key: 'prefLabel', value: 'Preferred' });
    expect(extractValueFromEntity(e, relation, 'prefLabel|title', '')).toBe('Preferred');
  });

  it('picks the value in the preferred language', () => {
    const e = entity(
      { key: 'title', value: 'Research Department', lang: 'en' },
      { key: 'title', value: 'Onderzoeksafdeling', lang: 'nl' }
    );
    expect(extractValueFromEntity(e, relation, 'title', '', 'nl')).toBe('Onderzoeksafdeling');
  });

  it('matches language tags by basic filtering (en-GB for en)', () => {
    const e = entity({ key: 'title', value: 'Département', lang: 'fr' }, { key: 'title', value: 'Department', lang: 'en-GB' });
    expect(extractValueFromEntity(e, relation, 'title', '', 'en')).toBe('Department');
  });

  it('falls back to a value without language, then to any value', () => {
    expect(
      extractValueFromEntity(entity({ key: 'title', value: 'Fr', lang: 'fr' }, { key: 'title', value: 'Plain' }), relation, 'title', '', 'nl')
    ).toBe('Plain');
    expect(extractValueFromEntity(entity({ key: 'title', value: 'Fr', lang: 'fr' }), relation, 'title', '', 'nl')).toBe('Fr');
  });

  it('uses the local name of the IRI when the entity has no label', () => {
    expect(extractValueFromEntity(entity({ key: 'other', value: 'x' }), relation, 'title', '')).toBe('researchDept');
    expect(extractValueFromEntity(null, { key: 'a1b2-c3', type: 't' }, 'title', '')).toBe('a1b2-c3');
  });
});
