import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Collection } from '../generated-types/type-defs';

vi.mock('../auth', () => ({
  getManager: () => ({ refresh: async () => null }),
}));

const { CollectionAPI } = await import('../sources/collection');

const CANONICAL = 'NO-6X1Z4T0MX';
const STALE = 'NO-004DTA23G';

const verdict = {
  strategy: 'identifierIntegrity',
  status: 'invalid',
  score: 0,
  details: { expected_id: CANONICAL },
  immutable_fields: ['title', 'audience_type'],
};

const sourceReturning = (document: unknown) => {
  const source = Object.create(
    CollectionAPI.prototype
  ) as InstanceType<typeof CollectionAPI>;
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

    expect(evaluation).toMatchObject({ id: STALE, status: 'invalid' });
  });

  it('renames the immutable fields for the schema', async () => {
    const { source } = sourceReturning({ merge_evaluation: verdict });

    const evaluation = await source.getMergeEvaluation(
      STALE,
      'identifierIntegrity',
      Collection.Entities
    );

    expect(evaluation.immutableFields).toEqual(['title', 'audience_type']);
  });

  it('reports no immutable fields rather than nothing at all', async () => {
    const { source } = sourceReturning({
      merge_evaluation: { status: 'valid', score: 1 },
    });

    const evaluation = await source.getMergeEvaluation(
      STALE,
      'identifierIntegrity',
      Collection.Entities
    );

    expect(evaluation.immutableFields).toEqual([]);
  });

  it('still names the entity when the document carries no verdict', async () => {
    const { source } = sourceReturning({ id: STALE });

    const evaluation = await source.getMergeEvaluation(
      STALE,
      'identifierIntegrity',
      Collection.Entities
    );

    expect(evaluation).toEqual({ id: STALE, immutableFields: [] });
  });

  it('escapes the strategy so it cannot alter the query string', async () => {
    const { source, get } = sourceReturning({});

    await source.getMergeEvaluation(STALE, 'a&b=c', Collection.Entities);

    expect(get).toHaveBeenCalledWith(
      'entities/NO-004DTA23G?merge_evaluation=a%26b%3Dc'
    );
  });
});
