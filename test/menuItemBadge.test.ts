import { describe, it, expect } from 'vitest';
import { baseResolver } from '../baseModule/baseResolver';
import { setCurrentEnvironment } from '../environment';

setCurrentEnvironment({ customization: {} } as any);

const badge = {
  source: 'seenItems',
  query: 'GetCommentsPage',
  filterQuery: 'GetAdvancedFiltersForMyCommentsPage',
  entityType: 'comment',
};

const resolveMenuItem = (args: any) =>
  (baseResolver as any).Menu.menuItem({}, args, {
    dataSources: {},
    customPermissions: {},
  });

describe('Menu.menuItem badge config', () => {
  it('passes the badge and child total flag through', async () => {
    const menuItem = await resolveMenuItem({
      label: 'navigation.comments',
      requiresAuth: false,
      badge,
      showChildBadgeTotal: true,
    });

    expect(menuItem.badge).toEqual(badge);
    expect(menuItem.showChildBadgeTotal).toBe(true);
    expect(await (baseResolver as any).MenuItem.badge(menuItem)).toEqual(badge);
    expect(
      await (baseResolver as any).MenuItem.showChildBadgeTotal(menuItem)
    ).toBe(true);
  });
});
