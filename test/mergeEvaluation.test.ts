import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CollectionAPI } from '../sources/collection';
import { Collection } from '../generated-types/type-defs';

const CANONICAL = 'NO-6X1Z4T0MX';
const STALE = 'NO-004DTA23G';

const verdict = {
  strategy: 'identifierIntegrity',
  status: 'invalid',
  score: 0,
  details: { expected_id: CANONICAL },
};

const sourceReturning = (document: unknown) => {
  const source = Object.create(CollectionAPI.prototype) as CollectionAPI;
  const get = vi.fn().mockResolvedValue(document);
  (source as any).get = get;
  return { source, get };
};

describe('getMergeEvaluation', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('asks the regular document endpoint for the verdict', async () => {
    const { source, get } = sourceReturning({ merge_evaluation: verdict });

    await source.getMergeEvaluation(
      STALE,
      'identifierIntegrity',
      Collection.Entities
    );

    expect(get).toHaveBeenCalledWith(
      'entities/NO-004DTA23G?merge_evaluation=identifierIntegrity'
    );
  });

  it('reports the verdict against the entity it was asked about', async () => {
    const { source } = sourceReturning({ merge_evaluation: verdict });

    const evaluation = await source.getMergeEvaluation(
      STALE,
      'identifierIntegrity',
      Collection.Entities
    );

    expect(evaluation).toEqual({ id: STALE, ...verdict });
  });

  it('still names the entity when the document carries no verdict', async () => {
    const { source } = sourceReturning({ id: STALE });

    const evaluation = await source.getMergeEvaluation(
      STALE,
      'identifierIntegrity',
      Collection.Entities
    );

    expect(evaluation).toEqual({ id: STALE });
  });

  it('escapes the strategy so it cannot alter the query string', async () => {
    const { source, get } = sourceReturning({});

    await source.getMergeEvaluation(STALE, 'a&b=c', Collection.Entities);

    expect(get).toHaveBeenCalledWith(
      'entities/NO-004DTA23G?merge_evaluation=a%26b%3Dc'
    );
  });
});
