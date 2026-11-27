import { DataSources } from '../types';
import { resolveAdvancedEntities } from './entitiesResolver';
import { resolveRelations } from './entityResolver';
import { resolveIntialValueMetadata } from './intialValueResolver';
import {
  buildSelectedOptionsRequest,
  TITLE_KEYS,
} from './selectedOptionsRequest';

type FieldConfig = Record<string, any>;

const labelValues = async (
  dataSources: DataSources,
  related: any,
  optionLabelKeys: string[] = []
) => {
  const values: Record<string, unknown> = {};
  for (const key of [...new Set([...optionLabelKeys, ...TITLE_KEYS])]) {
    const value = await resolveIntialValueMetadata(
      dataSources,
      related,
      key,
      undefined,
      ''
    );
    if (value !== undefined && value !== null && value !== '')
      values[key] = value;
  }
  return values;
};

export const resolveSelectedOptions = async (
  field: FieldConfig | undefined,
  entity: any,
  dataSources: DataSources
): Promise<Record<string, unknown>[] | null> => {
  const request = buildSelectedOptionsRequest(
    field,
    entity,
    await resolveRelations(entity)
  );
  if (!request) return null;
  try {
    const { results } = await resolveAdvancedEntities(
      dataSources,
      request.type as any,
      request.advancedFilterInputs as any,
      request.limit,
      request.skip,
      request.searchValue as any
    );
    return Promise.all(
      (results ?? []).map(async (related: any) => ({
        id: related.id,
        uuid: related.uuid,
        type: related.type,
        intialValues: await labelValues(
          dataSources,
          related,
          field?.optionLabelKeys
        ),
      }))
    );
  } catch {
    return null;
  }
};
