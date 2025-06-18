import { expect, test } from 'vitest';
import { getTypesFromFilterInputs } from '../helpers/helpers';
import {
  Entitytyping,
  AdvancedFilterInput,
  Operator,
  AdvancedFilterTypes,
} from '../../../generated-types/type-defs';

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
