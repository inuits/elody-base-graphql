import type {
  GroupByConfig,
  GroupByConfigInput,
  GroupByDefaultsInput,
} from '../generated-types/type-defs';

const withoutEmptyValues = <T extends object>(value: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(value).filter(
      ([, fieldValue]) => fieldValue !== null && fieldValue !== undefined
    )
  ) as Partial<T>;

export const resolveGroupByOptions = (
  input: GroupByConfigInput[],
  defaults?: GroupByDefaultsInput | null
): GroupByConfig[] =>
  input.map((option) => {
    const resolved = {
      ...withoutEmptyValues(defaults ?? {}),
      ...withoutEmptyValues(option),
    } as GroupByConfig;
    if (!resolved.groupOrderBy)
      throw new Error(`Group by option ${option.key} has no groupOrderBy`);
    return resolved;
  });
