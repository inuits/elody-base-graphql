const RELATION_FIELD_TYPES = new Set([
  'dropdownMultiselectRelations',
  'dropdownSingleselectRelations',
]);
export const TITLE_KEYS = [
  'title',
  'name',
  'computed_title',
  'email',
  'prefLabel',
  'code',
  'wording',
  'originalTitle',
  'preferred_title',
  'original_headtitle',
  'description',
];
const KNOWN_ENTITY_PATHS = /^(relationValues\.|id$|uuid$|type$)/;

type FilterConfig = Record<string, any>;
type FieldConfig = Record<string, any>;
export type SelectedOptionsRequest = {
  type: string;
  limit: number;
  skip: number;
  searchValue: Record<string, unknown>;
  advancedFilterInputs: Record<string, unknown>[];
};

const extractValue = (object: any, path: string): unknown => {
  const segments = path.split('.');
  let current = object;
  for (let i = 0; i < segments.length; i++) {
    if (current == null) return undefined;
    if (Array.isArray(current)) {
      const rest = segments.slice(i).join('.');
      const results = current
        .map((item) => extractValue(item, rest))
        .filter((value) => value !== undefined && value !== '');
      return results.length ? results : undefined;
    }
    current = current[segments[i]];
  }
  if (Array.isArray(current) && current.length === 0) return undefined;
  return current;
};

const hasFormVariable = (value: unknown) =>
  typeof (value as { includes?: unknown })?.includes === 'function' &&
  (value as { includes: (search: string) => boolean }).includes('$');

const isTypeFilter = (filter: FilterConfig) =>
  filter.type === 'type' ||
  (filter.type === 'selection' &&
    (Array.isArray(filter.key) ? filter.key : [filter.key]).some(
      (key: unknown) =>
        typeof key === 'string' && key.split('|').pop() === 'type'
    ));

const lookupOf = (lookup: FilterConfig) => ({
  from: lookup.from ?? null,
  local_field: lookup.local_field ?? null,
  foreign_field: lookup.foreign_field ?? null,
  as: lookup.as ?? null,
});

const asPwaOptionsFilter = (filter: FilterConfig) => ({
  type: filter.type,
  key: filter.key ?? null,
  value: filter.value,
  match_exact: filter.match_exact ?? null,
  item_types: filter.item_types || [],
  ...(filter.operator ? { operator: filter.operator } : {}),
  ...(filter.lookup ? { lookup: lookupOf(filter.lookup) } : {}),
});

const relationFilterFor = (
  field: FieldConfig,
  entity: any,
  pwaEntity: Record<string, unknown>
): Record<string, unknown> | undefined => {
  const relationFilter = field.relationFilter;
  if (!relationFilter)
    return {
      type: 'selection',
      key: [`elody:1|relations.${field.fromRelationType}.key`],
      value: [entity.id],
      match_exact: true,
    };
  let value = relationFilter.value;
  if (typeof value === 'string' && value.startsWith('$')) {
    const path = value.substring(1);
    if (!KNOWN_ENTITY_PATHS.test(path)) return undefined;
    value = extractValue(pwaEntity, path) ?? [];
  }
  return {
    lookup: relationFilter.lookup ? lookupOf(relationFilter.lookup) : null,
    type: relationFilter.type,
    key: relationFilter.key ?? null,
    value,
    match_exact: relationFilter.match_exact ?? null,
    item_types: relationFilter.item_types ?? null,
  };
};

export const buildSelectedOptionsRequest = (
  field: FieldConfig | undefined,
  entity: any,
  relationValues: Record<string, unknown>
): SelectedOptionsRequest | undefined => {
  if (!field || !RELATION_FIELD_TYPES.has(field.type)) return undefined;
  if (field.resolveOptionsFilterOnModalParent) return undefined;
  if (!field.entityType || !entity?.id) return undefined;
  const relationType = field.relationType || field.fromRelationType;
  if (!relationType) return undefined;

  const optionFilters: FilterConfig[] = field
    .advancedFilterInputForRetrievingRelatedOptions?.length
    ? field.advancedFilterInputForRetrievingRelatedOptions
    : (field.advancedFilterInputForRetrievingOptions ?? []);
  const pwaEntity = {
    id: entity.id,
    uuid: entity.uuid,
    type: entity.type,
    relationValues,
  };

  let type: string = field.entityType;
  let advancedFilterInputs: Record<string, unknown>[];
  if (optionFilters.length) {
    const typeFilters = optionFilters.filter(isTypeFilter);
    if (typeFilters.some((filter) => hasFormVariable(filter.value)))
      return undefined;
    const relationFilter = relationFilterFor(field, entity, pwaEntity);
    if (!relationFilter) return undefined;
    advancedFilterInputs = [
      ...typeFilters.map(asPwaOptionsFilter),
      relationFilter,
    ];
    type =
      (advancedFilterInputs.find((filter) => filter.type === 'type')
        ?.value as string) || type;
  } else if (!field.fromRelationType) {
    advancedFilterInputs = [{ type: 'type', value: type, match_exact: true }];
  } else {
    const relationFilter = relationFilterFor(field, entity, pwaEntity);
    if (!relationFilter) return undefined;
    advancedFilterInputs = [relationFilter];
  }

  return {
    type,
    limit: 20,
    skip: 1,
    searchValue: field.optionsOrderByKey
      ? {
          value: '',
          isAsc: true,
          key: 'title',
          order_by: field.optionsOrderByKey,
        }
      : { value: '', key: 'title', order_by: '' },
    advancedFilterInputs,
  };
};
