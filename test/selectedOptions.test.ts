import { describe, expect, it } from 'vitest';
import { buildSelectedOptionsRequest } from '../resolvers/selectedOptionsRequest';

const production = {
  id: 'PR-000001',
  uuid: 'PR-000001',
  type: 'production',
  relations: [
    { key: 'ORG-000001', type: 'ref_booking_agency' },
    { key: 'ORG-000001', type: 'ref_companies' },
    { key: 'GN-000001', type: 'ref_genres' },
    { key: 'GN-000004', type: 'ref_genres' },
    { key: 'SE-000001', type: 'ref_seasons' },
    { key: 'TG-000001', type: 'ref_tags' },
  ],
};

const relationValues = {
  ref_booking_agency: [{ key: 'ORG-000001', type: 'ref_booking_agency' }],
  ref_companies: [{ key: 'ORG-000001', type: 'ref_companies' }],
  ref_genres: [
    { key: 'GN-000001', type: 'ref_genres' },
    { key: 'GN-000004', type: 'ref_genres' },
  ],
  ref_seasons: [{ key: 'SE-000001', type: 'ref_seasons' }],
  ref_tags: [{ key: 'TG-000001', type: 'ref_tags' }],
};
const build = (field: Record<string, unknown>) =>
  buildSelectedOptionsRequest(field, production, relationValues);

const nameSearch = {
  type: 'text',
  key: ['podiumnet:1|properties.name.value'],
  value: '*',
  match_exact: false,
};
const identifiersFilter = (relation: string, itemType: string) => ({
  type: 'selection',
  key: ['podiumnet:1|identifiers'],
  value: `$relationValues.${relation}.key`,
  match_exact: true,
  item_types: [itemType],
});

const fields = {
  seasonRelationTypeField: {
    type: 'dropdownMultiselectRelations',
    entityType: 'season',
    relationType: 'ref_seasons',
    advancedFilterInputForRetrievingOptions: [
      nameSearch,
      { type: 'type', value: 'season' },
    ],
    relationFilter: identifiersFilter('ref_seasons', 'season'),
  },
  tagsTypeField: {
    type: 'dropdownMultiselectRelations',
    entityType: 'tag',
    relationType: 'ref_tags',
    advancedFilterInputForRetrievingOptions: [
      nameSearch,
      { type: 'selection', key: 'type', value: ['tag'], match_exact: true },
    ],
    relationFilter: identifiersFilter('ref_tags', 'tag'),
  },
  companyTypeField: {
    type: 'dropdownMultiselectRelations',
    entityType: 'organization',
    relationType: 'ref_companies',
    optionsOrderByKey: 'properties.name.value',
    advancedFilterInputForRetrievingOptions: [
      nameSearch,
      {
        type: 'selection',
        key: 'type',
        value: ['organization'],
        match_exact: true,
      },
      {
        type: 'boolean',
        key: 'properties.is_company.value',
        value: [true],
        match_exact: true,
      },
    ],
    relationFilter: identifiersFilter('ref_companies', 'organization'),
  },
  genreTypeField: {
    type: 'dropdownMultiselectRelations',
    entityType: 'genre',
    relationType: 'ref_genres',
    advancedFilterInputForRetrievingOptions: [
      nameSearch,
      { type: 'selection', key: 'type', value: ['genre'], match_exact: true },
    ],
    relationFilter: identifiersFilter('ref_genres', 'genre'),
  },
};

const capturedFromThePwa = {
  seasonRelationTypeField: {
    type: 'season',
    limit: 20,
    skip: 1,
    searchValue: { value: '', key: 'title', order_by: '' },
    advancedFilterInputs: [
      {
        type: 'type',
        key: null,
        value: 'season',
        match_exact: null,
        item_types: [],
      },
      {
        lookup: null,
        type: 'selection',
        key: ['podiumnet:1|identifiers'],
        value: ['SE-000001'],
        match_exact: true,
        item_types: ['season'],
      },
    ],
  },
  tagsTypeField: {
    type: 'tag',
    limit: 20,
    skip: 1,
    searchValue: { value: '', key: 'title', order_by: '' },
    advancedFilterInputs: [
      {
        type: 'selection',
        key: 'type',
        value: ['tag'],
        match_exact: true,
        item_types: [],
      },
      {
        lookup: null,
        type: 'selection',
        key: ['podiumnet:1|identifiers'],
        value: ['TG-000001'],
        match_exact: true,
        item_types: ['tag'],
      },
    ],
  },
  companyTypeField: {
    type: 'organization',
    limit: 20,
    skip: 1,
    searchValue: {
      value: '',
      isAsc: true,
      key: 'title',
      order_by: 'properties.name.value',
    },
    advancedFilterInputs: [
      {
        type: 'selection',
        key: 'type',
        value: ['organization'],
        match_exact: true,
        item_types: [],
      },
      {
        lookup: null,
        type: 'selection',
        key: ['podiumnet:1|identifiers'],
        value: ['ORG-000001'],
        match_exact: true,
        item_types: ['organization'],
      },
    ],
  },
  genreTypeField: {
    type: 'genre',
    limit: 20,
    skip: 1,
    searchValue: { value: '', key: 'title', order_by: '' },
    advancedFilterInputs: [
      {
        type: 'selection',
        key: 'type',
        value: ['genre'],
        match_exact: true,
        item_types: [],
      },
      {
        lookup: null,
        type: 'selection',
        key: ['podiumnet:1|identifiers'],
        value: ['GN-000001', 'GN-000004'],
        match_exact: true,
        item_types: ['genre'],
      },
    ],
  },
};

describe('buildSelectedOptionsRequest', () => {
  it.each(Object.keys(fields) as (keyof typeof fields)[])(
    'asks collection-api exactly what the PWA asks today for %s',
    (fieldName) => {
      expect(build(fields[fieldName])).toStrictEqual(
        capturedFromThePwa[fieldName]
      );
    }
  );

  it('takes the entity type from the type filter when the field has no entityType', () => {
    const inscription = {
      id: 'AICAP0001_001MAr01',
      uuid: 'u',
      type: 'inscription',
    };
    const request = buildSelectedOptionsRequest(
      {
        type: 'dropdownSingleselectRelations',
        relationType: 'ref_support',
        advancedFilterInputForRetrievingOptions: [
          {
            type: 'text',
            key: ['aicap:1|properties.name.value'],
            value: '*',
            match_exact: false,
          },
          { type: 'type', value: 'support' },
        ],
        relationFilter: {
          type: 'selection',
          key: ['aicap:1|id'],
          value: '$relationValues.ref_support.key',
          match_exact: true,
          item_types: [],
        },
      },
      inscription,
      { ref_support: [{ key: 'SU-61LW0U4L0', type: 'ref_support' }] }
    );
    expect(request).toStrictEqual({
      type: 'support',
      limit: 20,
      skip: 1,
      searchValue: { value: '', key: 'title', order_by: '' },
      advancedFilterInputs: [
        {
          type: 'type',
          key: null,
          value: 'support',
          match_exact: null,
          item_types: [],
        },
        {
          lookup: null,
          type: 'selection',
          key: ['aicap:1|id'],
          value: ['SU-61LW0U4L0'],
          match_exact: true,
          item_types: [],
        },
      ],
    });
  });

  it('leaves it to the PWA when no entity type is known', () => {
    expect(
      build({
        ...fields.genreTypeField,
        entityType: undefined,
        advancedFilterInputForRetrievingOptions: [],
      })
    ).toBeUndefined();
  });

  it('uses the reverse relation when the field has no relation filter', () => {
    const request = build({
      type: 'dropdownMultiselectRelations',
      entityType: 'production',
      fromRelationType: 'ref_productions',
      advancedFilterInputForRetrievingOptions: [
        { type: 'type', value: 'production' },
      ],
    });
    expect(request?.advancedFilterInputs[1]).toStrictEqual({
      type: 'selection',
      key: ['elody:1|relations.ref_productions.key'],
      value: ['PR-000001'],
      match_exact: true,
    });
  });

  it('leaves it to the PWA when a filter depends on the edit form', () => {
    expect(
      build({
        ...fields.genreTypeField,
        advancedFilterInputForRetrievingOptions: [
          { type: 'type', value: '$ref_categories' },
        ],
      })
    ).toBeUndefined();
  });

  it('leaves it to the PWA when the relation filter reads something the server cannot know', () => {
    expect(
      build({
        ...fields.genreTypeField,
        relationFilter: {
          ...fields.genreTypeField.relationFilter,
          value: '$intialValues.genre',
        },
      })
    ).toBeUndefined();
  });

  it('leaves fields that are not relation dropdowns alone', () => {
    expect(
      build({ ...fields.genreTypeField, type: 'baseTextField' })
    ).toBeUndefined();
  });

  it('leaves fields that resolve their options on a modal parent to the PWA', () => {
    expect(
      build({
        ...fields.genreTypeField,
        resolveOptionsFilterOnModalParent: true,
      })
    ).toBeUndefined();
  });
});
