import { vi, expect, test, describe } from 'vitest';
import { resolveIntialValueRelationMetadata } from '../resolvers/intialValueResolver';
import { formatterFactory, ResolverFormatters } from '../resolvers/formatters';
import { RelationDirection } from '../generated-types/type-defs';

const formatted = (label: string) =>
  formatterFactory(ResolverFormatters.RelationMetadata)({ label, formatter: '' });

const series = {
  id: 'T-SERIES',
  identifiers: ['uuid-series', 'T-SERIES'],
  relations: [],
};

const work = {
  id: 'W-WORK',
  identifiers: ['uuid-work', 'W-WORK'],
  relations: [
    {
      key: 'T-SERIES',
      type: 'ref_series',
      metadata: [{ key: 'volume_number_label', value: '12' }],
    },
  ],
};

const dataSourcesFor = (entities: any[]) =>
  ({
    CollectionAPI: {
      getEntity: vi.fn(async (id: string) =>
        entities.find((entity) => entity.identifiers.includes(id))
      ),
    },
  }) as any;

describe('resolveIntialValueRelationMetadata', () => {
  test('reads the metadata when the relation key equals the given identifier', async () => {
    const result = await resolveIntialValueRelationMetadata(
      work,
      'volume_number_label',
      'T-SERIES',
      'ref_series',
      '',
      RelationDirection.FromEntity,
      dataSourcesFor([series, work])
    );

    expect(result).toEqual(formatted('12'));
  });

  test('reads the metadata when the given identifier is another identifier of the related entity', async () => {
    const result = await resolveIntialValueRelationMetadata(
      work,
      'volume_number_label',
      'uuid-series',
      'ref_series',
      '',
      RelationDirection.FromEntity,
      dataSourcesFor([series, work])
    );

    expect(result).toEqual(formatted('12'));
  });

  test('reads the metadata from the related entity when the relation is stored on the other side', async () => {
    const result = await resolveIntialValueRelationMetadata(
      series,
      'volume_number_label',
      'uuid-work',
      'ref_series',
      '',
      RelationDirection.FromEntity,
      dataSourcesFor([series, work])
    );

    expect(result).toEqual(formatted('12'));
  });

  test('returns an empty label when no relation matches', async () => {
    const result = await resolveIntialValueRelationMetadata(
      work,
      'volume_number_label',
      'uuid-other',
      'ref_series',
      '',
      RelationDirection.FromEntity,
      dataSourcesFor([series, work])
    );

    expect(result).toEqual(formatted(''));
  });
});
