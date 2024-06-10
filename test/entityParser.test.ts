import { parseRelationTypesForEntityType } from '../parsers/entity';
import { expect, test } from 'vitest';
import { Entitytyping } from '../../../generated-types/type-defs';

test('Get relationTypes based on Entity type', () => {
  expect(
    parseRelationTypesForEntityType('Person' as Entitytyping)
  ).toStrictEqual({
    relationType: 'hasPerson',
    fromRelationType: 'isPersonFor',
  });
});
