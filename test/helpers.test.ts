import { vi, expect, test, describe } from 'vitest';
import { getTypesFromFilterInputs, isTypeKey } from '../helpers/helpers';
import {
  Entitytyping,
  AdvancedFilterInput,
  Operator,
  AdvancedFilterTypes,
} from '../generated-types/type-defs';

const assetPartInputs: AdvancedFilterInput[] = [
  {
    key: 'type',
    match_exact: true,
    type: AdvancedFilterTypes.Selection,
    value: ['asset', 'asset_part'],
  },
  {
    key: ['dams:1|relations.isAssetPartFor.key'],
    match_exact: true,
    operator: Operator.Or,
    type: AdvancedFilterTypes.Selection,
    value: [
      '3857ed6b-0c5d-4452-96bb-2a8f7bf610be',
      '3857ed6b-0c5d-4452-96bb-2a8f7bf610be',
    ],
  },
  {
    key: ['dams:1|relations.hasAssetPart.key'],
    match_exact: true,
    operator: Operator.Or,
    type: AdvancedFilterTypes.Selection,
    value: [
      '3857ed6b-0c5d-4452-96bb-2a8f7bf610be',
      '3857ed6b-0c5d-4452-96bb-2a8f7bf610be',
    ],
  },
];

test('Get all types from filter inputs', () => {
  expect(
    getTypesFromFilterInputs(assetPartInputs, 'asset_part' as Entitytyping)
  ).toEqual(expect.arrayContaining(['asset_part', 'asset']));
});

test('Get types from filter inputs with schema-prefixed type key', () => {
  const filtersWithSchemaPrefix: AdvancedFilterInput[] = [
    {
      key: ['vlacc:1|type'],
      match_exact: true,
      type: AdvancedFilterTypes.Selection,
      value: ['person', 'corporation'],
    },
  ];
  expect(getTypesFromFilterInputs(filtersWithSchemaPrefix)).toEqual(
    expect.arrayContaining(['person', 'corporation'])
  );
});

describe('isTypeKey', () => {
  test('returns true for plain "type" string', () => {
    expect(isTypeKey('type')).toBe(true);
  });

  test('returns true for schema-prefixed type string', () => {
    expect(isTypeKey('vlacc:1|type')).toBe(true);
  });

  test('returns true for array with plain "type"', () => {
    expect(isTypeKey(['type'])).toBe(true);
  });

  test('returns true for array with schema-prefixed type', () => {
    expect(isTypeKey(['vlacc:1|type'])).toBe(true);
  });

  test('returns false for non-type key', () => {
    expect(isTypeKey('title')).toBe(false);
    expect(isTypeKey(['vlacc:1|title'])).toBe(false);
    expect(isTypeKey('vlacc:1|properties.title.value')).toBe(false);
  });
});
