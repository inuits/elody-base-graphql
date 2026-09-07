import { describe, it, expect, vi } from 'vitest';
import { parse } from 'graphql';
import { isElementPermitted, readSubFieldArgument } from '../helpers/permissions';
import { setCurrentEnvironment } from '../environment';

// getEntityId reads the id key off the environment, so element permissions
// cannot resolve an entity id without one.
setCurrentEnvironment({ customization: {} } as any);

const customPermissions = {
  'read:mediafile:overview': {
    datasource: 'CollectionAPI',
    crud: 'post',
    uri: '/entities/filter',
    body: [{ type: 'type', value: 'mediafile' }],
  },
  'read:gps_coordinates:field': {
    datasource: 'CollectionAPI',
    crud: 'get',
    uri: '/entities/$parentEntityId?key_to_check=metadata.gps_coordinates',
    body: {},
  },
} as any;

// Mirrors what the real CollectionAPI does with the id before it calls out.
const dataSourcesGranting = (granted: string[]) => {
  const checkAdvancedPermission = vi.fn(
    async (config: any, parentEntityId?: string) =>
      granted.includes(
        parentEntityId
          ? config.uri.replace(/\$parentEntityId/g, parentEntityId)
          : config.uri
      )
  );
  return {
    dataSources: {
      CollectionAPI: { checkAdvancedPermission },
      GraphqlAPI: { checkAdvancedPermission: vi.fn() },
    } as any,
    checkAdvancedPermission,
  };
};

// Builds the `info` shape the resolver receives: the field nodes selected for
// `elements`, plus every fragment the document defines.
const infoFor = (query: string, variableValues: Record<string, any> = {}) => {
  const document = parse(query);
  const fragments = Object.fromEntries(
    document.definitions
      .filter((definition: any) => definition.kind === 'FragmentDefinition')
      .map((definition: any) => [definition.name.value, definition])
  );
  const operation: any = document.definitions.find(
    (definition: any) => definition.kind === 'OperationDefinition'
  );
  const elementsField = operation.selectionSet.selections[0];
  return {
    fieldNodes: [elementsField],
    fragments,
    variableValues,
  } as any;
};

describe('readSubFieldArgument', () => {
  it('finds an inline argument on the requested sub-field', () => {
    const info = infoFor('{ entityListElement { can(input: ["a", "b"]) } }');

    expect(readSubFieldArgument(info, 'can', 'input')).toEqual(['a', 'b']);
  });

  it('resolves the argument out of a fragment spread', () => {
    const info = infoFor(`
      { entityListElement { ...listElement } }
      fragment listElement on EntityListElement {
        can(input: ["read:mediafile:overview"])
      }
    `);

    expect(readSubFieldArgument(info, 'can', 'input')).toEqual([
      'read:mediafile:overview',
    ]);
  });

  it('substitutes a variable', () => {
    const info = infoFor('{ entityListElement { can(input: $needed) } }', {
      needed: ['read:mediafile:overview'],
    });

    expect(readSubFieldArgument(info, 'can', 'input')).toEqual([
      'read:mediafile:overview',
    ]);
  });

  it('returns undefined when the sub-field was never selected', () => {
    const info = infoFor('{ entityListElement { label } }');

    expect(readSubFieldArgument(info, 'can', 'input')).toBeUndefined();
  });

  it('ignores a can on a sibling element', () => {
    const info = infoFor(
      '{ entityListElement { label } hierarchyListElement { can(input: ["x"]) } }'
    );

    expect(readSubFieldArgument(info, 'can', 'input')).toBeUndefined();
  });
});

describe('isElementPermitted', () => {
  it('permits an element that declares no permission, without a call', async () => {
    const { dataSources, checkAdvancedPermission } = dataSourcesGranting([]);

    const isPermitted = await isElementPermitted(
      infoFor('{ entityListElement { label } }'),
      { _id: 'INS-1' },
      dataSources,
      customPermissions
    );

    expect(isPermitted).toBe(true);
    expect(checkAdvancedPermission).not.toHaveBeenCalled();
  });

  it('follows an id-free permission', async () => {
    const info = infoFor(
      '{ entityListElement { can(input: ["read:mediafile:overview"]) } }'
    );

    expect(
      await isElementPermitted(info, undefined, dataSourcesGranting(['/entities/filter']).dataSources, customPermissions)
    ).toBe(true);
    expect(
      await isElementPermitted(info, undefined, dataSourcesGranting([]).dataSources, customPermissions)
    ).toBe(false);
  });

  it('resolves an id-dependent permission against the entity being viewed', async () => {
    const info = infoFor(
      '{ hierarchyListElement { can(input: ["read:gps_coordinates:field"]) } }'
    );
    const granting = dataSourcesGranting([
      '/entities/INS-1?key_to_check=metadata.gps_coordinates',
    ]);

    expect(
      await isElementPermitted(info, { _id: 'INS-1' }, granting.dataSources, customPermissions)
    ).toBe(true);
    expect(
      await isElementPermitted(info, { _id: 'INS-2' }, granting.dataSources, customPermissions)
    ).toBe(false);
  });

  it('accepts a single string permission as well as a list', async () => {
    const info = infoFor(
      '{ windowElementPanel { can(input: "read:mediafile:overview") } }'
    );

    expect(
      await isElementPermitted(info, undefined, dataSourcesGranting(['/entities/filter']).dataSources, customPermissions)
    ).toBe(true);
  });

  it('denies an element whose permission no client configured', async () => {
    const info = infoFor(
      '{ entityListElement { can(input: ["read:nothing:configured"]) } }'
    );

    expect(
      await isElementPermitted(info, undefined, dataSourcesGranting(['/entities/filter']).dataSources, customPermissions)
    ).toBe(false);
  });
});

describe('isElementPermitted resolves the entity id off its source', () => {
  const info = infoFor(
    '{ hierarchyListElement { can(input: ["read:gps_coordinates:field"]) } }'
  );

  it('passes the id of the entity document the element hangs off', async () => {
    const { dataSources, checkAdvancedPermission } = dataSourcesGranting([]);

    await isElementPermitted(
      info,
      { _id: 'INS-1', type: 'inscription' },
      dataSources,
      customPermissions
    );

    expect(checkAdvancedPermission).toHaveBeenCalledWith(
      customPermissions['read:gps_coordinates:field'],
      'INS-1',
      undefined
    );
  });

  it('sends no id for a source that is not an entity, instead of throwing', async () => {
    const { dataSources, checkAdvancedPermission } = dataSourcesGranting([]);

    await expect(
      isElementPermitted(info, {}, dataSources, customPermissions)
    ).resolves.toBe(false);
    await expect(
      isElementPermitted(info, undefined, dataSources, customPermissions)
    ).resolves.toBe(false);

    for (const call of checkAdvancedPermission.mock.calls)
      expect(call[1]).toBeUndefined();
  });
});
