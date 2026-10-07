/**
 * Relation labels in the reader's language ship behind a flag, off by default:
 * a client that turns it on (features.relationLabelsInPreferredLanguage) gets
 * the label of a related entity in the language the user reads in, as its own
 * multilingual fields already are; every other client keeps the label it had —
 * the first value of the label key, whatever its language.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { relationLabelsInPreferredLanguage, setCurrentEnvironment } from '../environment';
import { Environment } from '../types/environmentTypes';
import { extractValueFromEntity, relationLabelLanguage } from '../resolvers/intialValueResolver';

const environmentWith = (features: any) => ({ features }) as Environment;
const dataSources = { CollectionAPI: { preferredLanguage: 'nl' } } as any;
const relation = { key: 'a1b2', type: 'hasLanguage' };
const multilingual = {
  metadata: [
    { key: 'name', value: 'Arabic', lang: 'en' },
    { key: 'name', value: 'Arabisch', lang: 'nl' },
  ],
};

describe('relationLabelsInPreferredLanguage', () => {
  beforeEach(() => setCurrentEnvironment(undefined as any));

  it('is false when no environment has been set', () => {
    expect(relationLabelsInPreferredLanguage()).toBe(false);
  });

  it('is false when the flag is absent or off', () => {
    setCurrentEnvironment(environmentWith({}));
    expect(relationLabelsInPreferredLanguage()).toBe(false);
    setCurrentEnvironment(environmentWith({ relationLabelsInPreferredLanguage: false }));
    expect(relationLabelsInPreferredLanguage()).toBe(false);
  });

  it('is true only for an explicit opt-in', () => {
    setCurrentEnvironment(environmentWith({ relationLabelsInPreferredLanguage: true }));
    expect(relationLabelsInPreferredLanguage()).toBe(true);
  });
});

describe('the language of a relation label', () => {
  beforeEach(() => setCurrentEnvironment(undefined as any));

  it('is none when the flag is off: the first value, whatever its language, as before', () => {
    expect(relationLabelLanguage(dataSources)).toBeUndefined();
    expect(extractValueFromEntity(multilingual, relation, 'name', '', relationLabelLanguage(dataSources))).toBe('Arabic');
  });

  it("is the reader's language when the flag is on", () => {
    setCurrentEnvironment(environmentWith({ relationLabelsInPreferredLanguage: true }));
    expect(relationLabelLanguage(dataSources)).toBe('nl');
    expect(extractValueFromEntity(multilingual, relation, 'name', '', relationLabelLanguage(dataSources))).toBe('Arabisch');
  });

  it('without a language the first value is taken, even when a later one has no language', () => {
    const mixed = { metadata: [{ key: 'name', value: 'Arabic', lang: 'en' }, { key: 'name', value: 'Plain' }] };
    expect(extractValueFromEntity(mixed, relation, 'name', '')).toBe('Arabic');
  });
});
