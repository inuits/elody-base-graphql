import {
  parseRelationTypesForEntityType,
  parseRelations,
} from '../parsers/entity';
import { expect, test } from 'vitest';
import {
  EditStatus,
  Entitytyping,
  RelationFieldInput,
} from '../../../generated-types/type-defs';

test('Relation parsing', () => {
  const relationSet: RelationFieldInput[] = [
    {
      editStatus: EditStatus.New,
      key: 'tenant:super',
      type: 'isIn',
    },
    {
      editStatus: EditStatus.Changed,
      key: '06227485-04ef-44fd-9fc6-fe112b54c3d7',
      type: 'hasLanguage',
      value: 'Germaans',
    },
    {
      editStatus: EditStatus.Unchanged,
      key: '1ff7a8be-b834-4dc5-9fe9-8ede77a6a5a6',
      type: 'hasKeyword',
      value: 'Sleutel',
    },
    {
      editStatus: EditStatus.New,
      key: '2d4c4ec3-f134-4973-b7c2-7c77896b6655',
      type: 'hasMediafile',
    },
  ];

  expect(parseRelations(relationSet)).toStrictEqual({
    isIn: [
      {
        editStatus: EditStatus.New,
        key: 'tenant:super',
        type: 'isIn',
      },
    ],
    hasLanguage: [
      {
        editStatus: EditStatus.Changed,
        key: '06227485-04ef-44fd-9fc6-fe112b54c3d7',
        type: 'hasLanguage',
        value: 'Germaans',
      },
    ],
    hasKeyword: [
      {
        editStatus: EditStatus.Unchanged,
        key: '1ff7a8be-b834-4dc5-9fe9-8ede77a6a5a6',
        type: 'hasKeyword',
        value: 'Sleutel',
      },
    ],
    hasMediafile: [
      {
        editStatus: EditStatus.New,
        key: '2d4c4ec3-f134-4973-b7c2-7c77896b6655',
        type: 'hasMediafile',
      },
    ],
  });
});

test('Get relationTypes based on Entity type', () => {
  expect(
    parseRelationTypesForEntityType('Person' as Entitytyping)
  ).toStrictEqual({
    relationType: 'hasPerson',
    fromRelationType: 'isPersonFor',
  });
});
