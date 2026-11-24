import { describe, expect, it, vi } from 'vitest';
import { resolveSelectedOptions } from '../resolvers/selectedOptionsResolver';

const production = {
  id: 'PR-000001',
  type: 'production',
  relations: [
    { key: 'GN-000001', type: 'ref_genres' },
    { key: 'GN-000004', type: 'ref_genres' },
  ],
};

const genreField = {
  type: 'dropdownMultiselectRelations',
  entityType: 'genre',
  relationType: 'ref_genres',
  optionLabelKeys: ['code'],
  advancedFilterInputForRetrievingOptions: [
    { type: 'selection', key: 'type', value: ['genre'], match_exact: true },
  ],
  relationFilter: {
    type: 'selection',
    key: ['podiumnet:1|identifiers'],
    value: '$relationValues.ref_genres.key',
    match_exact: true,
    item_types: ['genre'],
  },
};

const dataSources = (results: unknown[]) =>
  ({
    CollectionAPI: {
      GetAdvancedEntities: vi
        .fn()
        .mockResolvedValue({ results, count: results.length }),
    },
  }) as any;

describe('resolveSelectedOptions', () => {
  it('sends the request through the same path as the Entities query', async () => {
    const sources = dataSources([]);
    await resolveSelectedOptions(genreField, production, sources);
    const [type, limit, skip, filters, searchValue] =
      sources.CollectionAPI.GetAdvancedEntities.mock.calls[0];
    expect({ type, limit, skip, searchValue }).toStrictEqual({
      type: 'genre',
      limit: 20,
      skip: 1,
      searchValue: { value: '', key: 'title', order_by: '' },
    });
    expect(filters[1].value).toStrictEqual(['GN-000001', 'GN-000004']);
  });

  it('returns each related entity with the values its label is made of', async () => {
    const options = await resolveSelectedOptions(
      genreField,
      production,
      dataSources([
        {
          id: 'GN-000001',
          uuid: 'u-1',
          type: 'genre',
          metadata: [
            { key: 'name', value: 'Drama' },
            { key: 'code', value: 'DR' },
            { key: 'notes', value: 'not part of a label' },
          ],
        },
      ])
    );
    expect(options).toStrictEqual([
      {
        id: 'GN-000001',
        uuid: 'u-1',
        type: 'genre',
        intialValues: { code: 'DR', name: 'Drama' },
      },
    ]);
  });

  it('gives the PWA nothing to use when the request fails', async () => {
    const sources = {
      CollectionAPI: {
        GetAdvancedEntities: vi.fn().mockRejectedValue(new Error('403')),
      },
    } as any;
    expect(
      await resolveSelectedOptions(genreField, production, sources)
    ).toBeNull();
  });
});
