import { describe, it, expect, vi } from 'vitest';
import { parse } from 'graphql';
import { isPanelPermitted } from '../helpers/permissions';
import { setCurrentEnvironment } from '../environment';

setCurrentEnvironment({ customization: {} } as any);

// Mirrors the client permissions that reach this path: every one of them
// substitutes an entity id the panel selection never carries.
const customPermissions = {
  'update:asset:has-mediafile': {
    datasource: 'CollectionAPI',
    crud: 'patch',
    uri: '/entities/$parentEntityId',
    body: {},
  },
  'read:user:overview': {
    datasource: 'CollectionAPI',
    crud: 'post',
    uri: '/entities/filter',
    body: [{ type: 'type', value: 'user' }],
  },
} as any;

const dataSourcesWith = (verdicts: {
  advanced?: string[];
  updatable?: string[];
  deletable?: string[];
}) => {
  const checkAdvancedPermission = vi.fn(async (config: any) =>
    (verdicts.advanced ?? []).includes(config.uri)
  );
  const patchEntityDetailSoftCall = vi.fn(async (id: string) =>
    (verdicts.updatable ?? []).includes(id) ? '200' : '403'
  );
  const delEntityDetailSoftCall = vi.fn(async (id: string) =>
    (verdicts.deletable ?? []).includes(id) ? '200' : '403'
  );
  return {
    dataSources: {
      CollectionAPI: {
        checkAdvancedPermission,
        patchEntityDetailSoftCall,
        delEntityDetailSoftCall,
      },
      GraphqlAPI: { checkAdvancedPermission: vi.fn() },
    } as any,
    checkAdvancedPermission,
    patchEntityDetailSoftCall,
    delEntityDetailSoftCall,
  };
};

const infoFor = (query: string) => {
  const document = parse(query);
  const operation: any = document.definitions[0];
  return {
    fieldNodes: [operation.selectionSet.selections[0]],
    fragments: {},
    variableValues: {},
  } as any;
};

const asset = { _id: 'ASSET-1', type: 'asset' };

describe('isPanelPermitted', () => {
  it('keeps a panel that configures no permission, without calling out', async () => {
    const info = infoFor('{ access: panels { isEditable(input: true) } }');
    const { dataSources, checkAdvancedPermission } = dataSourcesWith({});

    expect(
      await isPanelPermitted(info, asset, dataSources, customPermissions)
    ).toBe(true);
    expect(checkAdvancedPermission).not.toHaveBeenCalled();
  });

  it('keeps a panel whose advanced permission grants it', async () => {
    const info = infoFor('{ users: panels { can(input: "read:user:overview") } }');
    const { dataSources, patchEntityDetailSoftCall } = dataSourcesWith({
      advanced: ['/entities/filter'],
    });

    expect(
      await isPanelPermitted(info, asset, dataSources, customPermissions)
    ).toBe(true);
    expect(patchEntityDetailSoftCall).not.toHaveBeenCalled();
  });

  it('falls back to the entity itself when the advanced permission denies', async () => {
    const info = infoFor(
      '{ media: panels { can(input: "update:asset:has-mediafile") } }'
    );
    const { dataSources, patchEntityDetailSoftCall } = dataSourcesWith({
      updatable: ['ASSET-1'],
    });

    expect(
      await isPanelPermitted(info, asset, dataSources, customPermissions)
    ).toBe(true);
    expect(patchEntityDetailSoftCall).toHaveBeenCalledWith('ASSET-1', 'asset');
  });

  it('leaves out a panel the user may neither reach nor update', async () => {
    const info = infoFor(
      '{ media: panels { can(input: "update:asset:has-mediafile") } }'
    );
    const { dataSources } = dataSourcesWith({ updatable: ['ASSET-2'] });

    expect(
      await isPanelPermitted(info, asset, dataSources, customPermissions)
    ).toBe(false);
  });

  it('falls back to a delete verdict for a delete action', async () => {
    const info = infoFor('{ danger: panels { can(input: "delete:asset") } }');
    const { dataSources, delEntityDetailSoftCall } = dataSourcesWith({
      deletable: ['ASSET-1'],
    });

    expect(
      await isPanelPermitted(info, asset, dataSources, customPermissions)
    ).toBe(true);
    expect(delEntityDetailSoftCall).toHaveBeenCalledWith('ASSET-1', 'asset');
  });

  it('never falls back to another entity type than the one being resolved', async () => {
    const info = infoFor(
      '{ media: panels { can(input: "update:mediafile:has-asset") } }'
    );
    const { dataSources, patchEntityDetailSoftCall } = dataSourcesWith({
      updatable: ['ASSET-1'],
    });

    expect(
      await isPanelPermitted(info, asset, dataSources, customPermissions)
    ).toBe(false);
    expect(patchEntityDetailSoftCall).not.toHaveBeenCalled();
  });

  it('leaves out a panel gated on a read the mapping never answered', async () => {
    const info = infoFor('{ hidden: panels { can(input: "read:asset") } }');
    const { dataSources } = dataSourcesWith({ updatable: ['ASSET-1'] });

    expect(
      await isPanelPermitted(info, asset, dataSources, customPermissions)
    ).toBe(false);
  });
});
