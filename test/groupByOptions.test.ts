import { describe, it, expect } from 'vitest';
import { baseResolver } from '../baseModule/baseResolver';

const category = {
  label: 'element-labels.comment-category',
  key: 'intialValues.category',
  filterKey: ['vlacc:1|properties.category.value'],
  distinctBy: 'properties.category.value',
  primary: true,
};

const author = {
  label: 'comments.creator',
  key: 'intialValues.author_name',
  filterKey: ['vlacc:1|properties.author_name.value'],
  distinctBy: 'properties.author_name.value',
  pageSize: 50,
};

const defaults = {
  groupOrderBy: 'properties.last_activity_at.value',
  pageSize: 20,
  groupsPageSize: 5,
  emptyLabel: 'comments.no-category',
};

const sessionValues: Record<string, string> = { id: 'U-CURRENT' };

const context = {
  dataSources: {
    CollectionAPI: {
      getSessionInfo: async (key: string) => sessionValues[key],
    },
  },
};

const resolveOptions = (input: unknown[], optionDefaults?: unknown) =>
  (baseResolver.GroupByOptions as any).options(
    { entityType: 'comment' },
    { input, defaults: optionDefaults },
    context
  );

const toYou = {
  id: 'to-you',
  label: 'comments.to-you',
  filterKey: ['vlacc:1|properties.thread_tagged_users.value'],
  value: 'session-$id',
};

describe('group by options', () => {
  it('returns a group by options holder for an entity type', async () => {
    const holder = await (baseResolver.Query as any).EntityTypeGroupByOptions(
      undefined,
      { entityType: 'comment' },
      {}
    );

    expect(holder).toEqual({ options: [] });
  });

  it('applies the shared defaults to every option', async () => {
    const options = await resolveOptions([category, author], defaults);

    expect(options).toEqual([
      { ...defaults, ...category },
      { ...defaults, ...author },
    ]);
  });

  it('lets an option override a shared default', async () => {
    const [, resolvedAuthor] = await resolveOptions([category, author], defaults);

    expect(resolvedAuthor.pageSize).toBe(50);
  });

  it('ignores defaults that are not set', async () => {
    const options = await resolveOptions(
      [{ ...category, groupOrderBy: 'properties.status.value' }],
      { groupOrderBy: null, pageSize: 20 }
    );

    expect(options[0].groupOrderBy).toBe('properties.status.value');
  });

  it('rejects an option without a group order', async () => {
    await expect(resolveOptions([category])).rejects.toThrow(
      'intialValues.category'
    );
  });

  it('resolves session values of pinned groups', async () => {
    const [option] = await resolveOptions(
      [{ ...category, pinnedGroups: [toYou] }],
      defaults
    );

    expect(option.pinnedGroups).toEqual([{ ...toYou, value: 'U-CURRENT' }]);
  });

  it('keeps literal values of pinned groups', async () => {
    const pinned = { ...toYou, value: 'U-OTHER' };
    const [option] = await resolveOptions(
      [{ ...category, pinnedGroups: [pinned] }],
      defaults
    );

    expect(option.pinnedGroups).toEqual([pinned]);
  });
});
