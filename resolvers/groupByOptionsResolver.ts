import type {
  GroupByConfig,
  GroupByConfigInput,
  GroupByDefaultsInput,
  GroupByPinnedGroup,
  GroupByPinnedGroupInput,
} from '../generated-types/type-defs';

type ResolveSessionValue = (key: string) => Promise<string>;
const SESSION_VALUE = /^session-\$(.+)$/;

const withoutEmptyValues = <T extends object>(value: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(value).filter(
      ([, fieldValue]) => fieldValue !== null && fieldValue !== undefined
    )
  ) as Partial<T>;

const resolvePinnedGroups = async (
  pinnedGroups: GroupByPinnedGroupInput[],
  resolveSessionValue: ResolveSessionValue
): Promise<GroupByPinnedGroup[]> =>
  Promise.all(
    pinnedGroups.map(async (pinnedGroup) => {
      const sessionKey = pinnedGroup.value.match(SESSION_VALUE)?.[1];
      if (!sessionKey) return pinnedGroup;
      return { ...pinnedGroup, value: await resolveSessionValue(sessionKey) };
    })
  );

export const resolveGroupByOptions = (
  input: GroupByConfigInput[],
  defaults: GroupByDefaultsInput | null | undefined,
  resolveSessionValue: ResolveSessionValue
): Promise<GroupByConfig[]> =>
  Promise.all(
    input.map(async (option) => {
      const resolved = {
        ...withoutEmptyValues(defaults ?? {}),
        ...withoutEmptyValues(option),
      } as GroupByConfig;
      if (!resolved.groupOrderBy)
        throw new Error(`Group by option ${option.key} has no groupOrderBy`);
      if (option.pinnedGroups)
        resolved.pinnedGroups = await resolvePinnedGroups(
          option.pinnedGroups,
          resolveSessionValue
        );
      return resolved;
    })
  );
