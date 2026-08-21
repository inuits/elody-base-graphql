import {
  applyTypesenseHighlights,
  parseRelationTypesForEntityType,
  parseRelations,
} from '../parsers/entity';
import { expect, test } from 'vitest';
import {
  EditStatus,
  Entitytyping,
  RelationFieldInput,
} from '../generated-types/type-defs';

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

test('applyTypesenseHighlights replaces matching metadata value with the highlight snippet', () => {
  const results = [
    {
      _id: '6a3727e5-b57b-4b7e-899f-7f3bda951e93',
      metadata: [
        { key: 'reading', value: '<p><i>l ddt w ṯl bn lʿ{.}</i><br></p>' },
        { key: 'title', value: 'Untouched' },
      ],
    },
  ];
  const highlights = {
    '6a3727e5-b57b-4b7e-899f-7f3bda951e93': {
      properties_reading_value: {
        matched_tokens: ['dd'],
        snippet: '<p><i>l <mark>dd</mark>t w ṯl bn lʿ{.}</i><br></p>',
      },
    },
  };

  applyTypesenseHighlights(results, highlights);

  expect(results[0].metadata).toStrictEqual([
    {
      key: 'reading',
      value: '<p><i>l <mark>dd</mark>t w ṯl bn lʿ{.}</i><br></p>',
    },
    { key: 'title', value: 'Untouched' },
  ]);
});

test('applyTypesenseHighlights leaves entities without a highlight entry untouched', () => {
  const results = [
    {
      _id: 'entity-without-highlight',
      metadata: [{ key: 'reading', value: 'original' }],
    },
  ];

  applyTypesenseHighlights(results, {
    'some-other-id': {
      properties_reading_value: { matched_tokens: ['x'], snippet: 'x' },
    },
  });

  expect(results[0].metadata).toStrictEqual([
    { key: 'reading', value: 'original' },
  ]);
});

test('applyTypesenseHighlights ignores highlight keys that do not match the properties_*_value pattern', () => {
  const results = [
    {
      _id: '6a3727e5-b57b-4b7e-899f-7f3bda951e93',
      metadata: [{ key: 'reading', value: 'original' }],
    },
  ];

  applyTypesenseHighlights(results, {
    '6a3727e5-b57b-4b7e-899f-7f3bda951e93': {
      reading: { matched_tokens: ['x'], snippet: 'should not apply' },
    },
  });

  expect(results[0].metadata).toStrictEqual([
    { key: 'reading', value: 'original' },
  ]);
});

test('applyTypesenseHighlights is a no-op when highlights is undefined or empty', () => {
  const results = [
    {
      _id: '6a3727e5-b57b-4b7e-899f-7f3bda951e93',
      metadata: [{ key: 'reading', value: 'original' }],
    },
  ];

  applyTypesenseHighlights(results, undefined);
  applyTypesenseHighlights(results, {});

  expect(results[0].metadata).toStrictEqual([
    { key: 'reading', value: 'original' },
  ]);
});
