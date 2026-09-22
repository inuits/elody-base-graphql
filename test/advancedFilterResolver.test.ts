import { describe, it, expect } from 'vitest';
import { baseResolver } from '../baseModule/baseResolver';

describe('AdvancedFilters.advancedFilter', () => {
  it('forwards distinctBy, needed to dedupe listings behind a $lookup + $unwind', async () => {
    const filter = await (baseResolver.AdvancedFilters as any).advancedFilter(
      {},
      {
        type: 'boolean',
        key: 'lookup.virtual_relations.ref_organizations.properties.is_booker.value',
        distinctBy: 'id',
        lookup: {
          from: 'organizations_actual',
          local_field: 'properties.ref_organizations.value',
          foreign_field: 'id',
          as: 'lookup.virtual_relations.ref_organizations',
        },
      }
    );

    expect(filter.distinctBy).toBe('id');
    expect(filter.lookup.from).toBe('organizations_actual');
  });
});
