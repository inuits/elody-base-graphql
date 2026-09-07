import { describe, it, expect, vi } from 'vitest';
import { graphql, buildSchema, GraphQLObjectType } from 'graphql';
import { baseResolver } from '../baseModule/baseResolver';
import { setCurrentEnvironment } from '../environment';

setCurrentEnvironment({ customization: {} } as any);

// Only the slice of the schema this path touches, so the test needs no module,
// no data source wiring and no client.
const typeDefs = `
  type ContextMenuElodyAction {
    label(input: String): String!
    can(input: [String]): [String]
  }
  type ContextMenuActions {
    doElodyAction: ContextMenuElodyAction
  }
  type teaserMetadata {
    contextMenuActions: ContextMenuActions
  }
  type WindowElement {
    contextMenuActions: ContextMenuActions
  }
  type Query {
    row: teaserMetadata
    window: WindowElement
  }
`;

const customPermissions = {
  'delete:mediafile': {
    datasource: 'CollectionAPI',
    crud: 'delete',
    uri: '/entities/$childEntityId',
    body: {},
  },
  'delete:production': {
    datasource: 'CollectionAPI',
    crud: 'delete',
    uri: '/entities/$parentEntityId',
    body: {},
  },
} as any;

const run = async (
  source: string,
  granted: string[],
  parentEntityId?: string
) => {
  const checkAdvancedPermission = vi.fn(
    async (config: any) => granted.includes(config.uri)
  );
  const schema = buildSchema(typeDefs);
  const attach = (typeName: string, resolvers: Record<string, any>) => {
    const fields = (schema.getType(typeName) as GraphQLObjectType).getFields();
    Object.entries(resolvers).forEach(([field, resolve]) => {
      if (fields[field]) fields[field].resolve = resolve;
    });
  };
  attach('Query', {
    row: () => ({ _id: 'MF-1', type: 'mediafile' }),
    window: () => ({ _id: 'PROD-1', type: 'production' }),
  });
  attach('teaserMetadata', {
    contextMenuActions: baseResolver.teaserMetadata!.contextMenuActions,
  });
  attach('WindowElement', {
    contextMenuActions: baseResolver.WindowElement!.contextMenuActions,
  });
  attach('ContextMenuActions', baseResolver.ContextMenuActions as any);
  attach('ContextMenuElodyAction', baseResolver.ContextMenuElodyAction as any);

  const result = await graphql({
    schema,
    source,
    contextValue: {
      dataSources: {
        CollectionAPI: { checkAdvancedPermission },
        GraphqlAPI: { checkAdvancedPermission: vi.fn() },
      },
      customPermissions,
      parentEntityId,
    },
  });
  expect(result.errors).toBeUndefined();
  return { data: result.data as any, checkAdvancedPermission };
};

describe('context menu omission', () => {
  it('leaves out a denied row action and keeps a permitted one', async () => {
    const source = `{
      row {
        contextMenuActions {
          keep: doElodyAction { label(input: "keep") can(input: ["delete:mediafile"]) }
          drop: doElodyAction { label(input: "drop") can(input: ["delete:production"]) }
        }
      }
    }`;
    const { data } = await run(source, ['/entities/$childEntityId'], 'PROD-1');

    expect(data.row.contextMenuActions.keep).toEqual({
      label: 'keep',
      can: ['delete:mediafile'],
    });
    expect(data.row.contextMenuActions.drop).toBeNull();
  });

  it('keeps an action that configures no permission at all', async () => {
    const source = `{
      row { contextMenuActions { open: doElodyAction { label(input: "open") } } }
    }`;
    const { data, checkAdvancedPermission } = await run(source, []);

    expect(data.row.contextMenuActions.open).toEqual({ label: 'open' });
    expect(checkAdvancedPermission).not.toHaveBeenCalled();
  });

  it('resolves a row action against the request container and the row', async () => {
    const source = `{
      row { contextMenuActions { drop: doElodyAction { can(input: ["delete:mediafile"]) } } }
    }`;
    const { checkAdvancedPermission } = await run(source, [], 'PROD-1');

    expect(checkAdvancedPermission).toHaveBeenCalledWith(
      customPermissions['delete:mediafile'],
      'PROD-1',
      'MF-1'
    );
  });

  it('resolves a detail window action against the window entity, with no child', async () => {
    const source = `{
      window { contextMenuActions { drop: doElodyAction { can(input: ["delete:production"]) } } }
    }`;
    const { checkAdvancedPermission, data } = await run(
      source,
      ['/entities/$parentEntityId']
    );

    expect(checkAdvancedPermission).toHaveBeenCalledWith(
      customPermissions['delete:production'],
      'PROD-1',
      undefined
    );
    expect(data.window.contextMenuActions.drop).not.toBeNull();
  });
});
