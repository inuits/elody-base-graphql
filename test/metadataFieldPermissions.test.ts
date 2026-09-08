import { describe, it, expect, vi } from 'vitest';
import { parse } from 'graphql';
import { baseResolver } from '../baseModule/baseResolver';
import { setCurrentEnvironment } from '../environment';

setCurrentEnvironment({ customization: {} } as any);

// Mirrors the two shapes clients configure on a panel metadata field: a read
// gate on the field and a write gate on the entity.
const customPermissions = {
  'read:gps_coordinates:field': {
    datasource: 'CollectionAPI',
    crud: 'get',
    uri: '/entities/$parentEntityId/fields/gps',
    body: {},
  },
  'update:asset:field:access': {
    datasource: 'CollectionAPI',
    crud: 'patch',
    uri: '/entities/$parentEntityId',
    body: {},
  },
} as any;

const contextGranting = (granted: string[]) => ({
  dataSources: {
    CollectionAPI: {
      checkAdvancedPermission: vi.fn(async (config: any, parent?: string) =>
        granted.includes(
          parent ? config.uri.replace(/\$parentEntityId/g, parent) : config.uri
        )
      ),
    },
    GraphqlAPI: { checkAdvancedPermission: vi.fn() },
  },
  customPermissions,
});

// The metaData fields of a panel are aliased siblings, so the resolver is asked
// about one alias at a time — info.fieldNodes groups by response key.
const infoForAlias = (query: string, alias: string) => {
  const document: any = parse(query);
  const panel = document.definitions[0].selectionSet.selections[0];
  const fieldNodes = panel.selectionSet.selections.filter(
    (selection: any) => (selection.alias ?? selection.name).value === alias
  );
  return { fieldNodes, fragments: {}, variableValues: {} } as any;
};

const query = `{
  panel {
    gps: metaData {
      key(input: "gps_coordinates")
      can(input: ["read:gps_coordinates:field"])
      permitted
    }
    label: metaData {
      key(input: "label")
      permitted
    }
    access: metaData {
      key(input: "access")
      canEdit(input: ["update:asset:field:access"])
      readOnly
    }
  }
}`;

const resolveMetaData = (alias: string, granted: string[]) =>
  (baseResolver.WindowElementPanel!.metaData as any)(
    { _id: 'SITE-1', type: 'site' },
    {},
    contextGranting(granted),
    infoForAlias(query, alias)
  );

describe('panel metadata field permissions', () => {
  it('marks a field the user may read as permitted', async () => {
    const field = await resolveMetaData('gps', [
      '/entities/SITE-1/fields/gps',
    ]);

    expect(field.permitted).toBe(true);
  });

  it('marks a field the user may not read as not permitted', async () => {
    const field = await resolveMetaData('gps', []);

    expect(field.permitted).toBe(false);
  });

  it('leaves a field that configures no read gate permitted, without calling out', async () => {
    const context = contextGranting([]);
    const field = await (baseResolver.WindowElementPanel!.metaData as any)(
      { _id: 'SITE-1', type: 'site' },
      {},
      context,
      infoForAlias(query, 'label')
    );

    expect(field.permitted).toBe(true);
    expect(
      context.dataSources.CollectionAPI.checkAdvancedPermission
    ).not.toHaveBeenCalled();
  });

  it('reads the can of the alias it was asked about, not of its sibling', async () => {
    // 'access' configures canEdit but no can, so it must not inherit the gps
    // field's read gate just because they share a panel.
    const field = await resolveMetaData('access', []);

    expect(field.permitted).toBe(true);
    expect(field.key).toBeUndefined();
  });

  it('keeps the two verdicts apart', async () => {
    // gps gates reading only, so it stays writable; access gates writing only,
    // so it stays visible. Neither gate may answer for the other.
    const gps = await resolveMetaData('gps', ['/entities/SITE-1/fields/gps']);
    const access = await resolveMetaData('access', []);

    expect(gps).toMatchObject({ permitted: true, readOnly: false });
    expect(access).toMatchObject({ permitted: true, readOnly: true });
  });
});
