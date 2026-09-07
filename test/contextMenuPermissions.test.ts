import { describe, it, expect, vi } from 'vitest';
import { parse } from 'graphql';
import {
  isContextMenuActionPermitted,
  tagContextMenuEntityRole,
} from '../helpers/permissions';
import { setCurrentEnvironment } from '../environment';

setCurrentEnvironment({ customization: {} } as any);

// Mirrors podiumnet's context menu permissions: one resolves against the
// container, one against the row.
const customPermissions = {
  'delete:production': {
    datasource: 'CollectionAPI',
    crud: 'delete',
    uri: '/entities/$parentEntityId',
    body: {},
  },
  'delete:mediafile': {
    datasource: 'CollectionAPI',
    crud: 'delete',
    uri: '/entities/$childEntityId',
    body: {},
  },
} as any;

const dataSourcesWith = (granted: boolean = true) => {
  const checkAdvancedPermission = vi.fn(async () => granted);
  return {
    dataSources: {
      CollectionAPI: { checkAdvancedPermission },
      GraphqlAPI: { checkAdvancedPermission: vi.fn() },
    } as any,
    checkAdvancedPermission,
  };
};

const infoFor = (query: string, index: number = 0) => {
  const document = parse(query);
  const operation: any = document.definitions[0];
  return {
    fieldNodes: [operation.selectionSet.selections[index]],
    fragments: {},
    variableValues: {},
  } as any;
};

const mediafile = { _id: 'MF-1', type: 'mediafile' };

describe('isContextMenuActionPermitted', () => {
  it('keeps an action that configures no permission, without calling out', async () => {
    const info = infoFor('{ follow: doLinkAction { label(input: "x") } }');
    const { dataSources, checkAdvancedPermission } = dataSourcesWith();

    expect(
      await isContextMenuActionPermitted(
        info,
        tagContextMenuEntityRole(mediafile, 'child'),
        dataSources,
        customPermissions,
        'PROD-1'
      )
    ).toBe(true);
    expect(checkAdvancedPermission).not.toHaveBeenCalled();
  });

  it('sends the row as the child and the request container as the parent', async () => {
    const info = infoFor(
      '{ remove: doElodyAction { can(input: ["delete:mediafile"]) } }'
    );
    const { dataSources, checkAdvancedPermission } = dataSourcesWith();

    expect(
      await isContextMenuActionPermitted(
        info,
        tagContextMenuEntityRole(mediafile, 'child'),
        dataSources,
        customPermissions,
        'PROD-1'
      )
    ).toBe(true);
    expect(checkAdvancedPermission).toHaveBeenCalledWith(
      customPermissions['delete:mediafile'],
      'PROD-1',
      'MF-1'
    );
  });

  it('sends a detail window entity as the parent and no child at all', async () => {
    const info = infoFor(
      '{ archive: doQueryAction { can(input: ["delete:production"]) } }'
    );
    const production = { _id: 'PROD-1', type: 'production' };
    const { dataSources, checkAdvancedPermission } = dataSourcesWith();

    expect(
      await isContextMenuActionPermitted(
        info,
        tagContextMenuEntityRole(production, 'parent'),
        dataSources,
        customPermissions,
        undefined
      )
    ).toBe(true);
    expect(checkAdvancedPermission).toHaveBeenCalledWith(
      customPermissions['delete:production'],
      'PROD-1',
      undefined
    );
  });

  it('omits an action whose permission denies', async () => {
    const info = infoFor(
      '{ remove: doElodyAction { can(input: ["delete:mediafile"]) } }'
    );
    const { dataSources } = dataSourcesWith(false);

    expect(
      await isContextMenuActionPermitted(
        info,
        tagContextMenuEntityRole(mediafile, 'child'),
        dataSources,
        customPermissions,
        'PROD-1'
      )
    ).toBe(false);
  });

  it('reads the can of the alias it was asked about, not of its sibling', async () => {
    const query = `{
      keep: doElodyAction { can(input: ["delete:production"]) }
      remove: doElodyAction { can(input: ["delete:mediafile"]) }
    }`;
    const { dataSources, checkAdvancedPermission } = dataSourcesWith();

    await isContextMenuActionPermitted(
      infoFor(query, 1),
      tagContextMenuEntityRole(mediafile, 'child'),
      dataSources,
      customPermissions,
      'PROD-1'
    );

    expect(checkAdvancedPermission).toHaveBeenCalledWith(
      customPermissions['delete:mediafile'],
      'PROD-1',
      'MF-1'
    );
  });

  it('denies an action naming a permission no client configured', async () => {
    const info = infoFor(
      '{ remove: doElodyAction { can(input: ["delete:nothing"]) } }'
    );
    const { dataSources } = dataSourcesWith();

    expect(
      await isContextMenuActionPermitted(
        info,
        tagContextMenuEntityRole(mediafile, 'child'),
        dataSources,
        customPermissions,
        'PROD-1'
      )
    ).toBe(false);
  });
});
