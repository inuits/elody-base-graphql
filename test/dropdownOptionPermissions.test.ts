import { describe, it, expect, vi } from 'vitest';
import { filterPermittedOptions } from '../helpers/permissions';

const customPermissions = {
  'create:production': {
    datasource: 'CollectionAPI',
    crud: 'post',
    uri: '/entities',
    body: { type: 'production' },
  },
  'delete:production': {
    datasource: 'CollectionAPI',
    crud: 'delete',
    uri: '/entities/$parentEntityId',
    body: {},
  },
} as any;

// Mirrors what the real CollectionAPI does with the ids before it calls out, so
// the fake grants on the uri the request would actually have used.
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

const labelsOf = (options: { label: string }[]) =>
  options.map((option) => option.label);

describe('filterPermittedOptions', () => {
  it('keeps an option that declares no permission', async () => {
    const { dataSources, checkAdvancedPermission } = dataSourcesGranting([]);

    const options = await filterPermittedOptions(
      [{ label: 'openDropdown' }, { label: 'export', can: [] }],
      dataSources,
      customPermissions
    );

    expect(labelsOf(options)).toEqual(['openDropdown', 'export']);
    expect(checkAdvancedPermission).not.toHaveBeenCalled();
  });

  it('drops an id-free option the user is denied and keeps the granted one', async () => {
    const { dataSources } = dataSourcesGranting(['/entities']);

    const options = await filterPermittedOptions(
      [
        { label: 'create', can: ['create:production'] },
        { label: 'delete', can: ['delete:production'] },
      ],
      dataSources,
      customPermissions,
      'PROD-1'
    );

    expect(labelsOf(options)).toEqual(['create']);
  });

  it('resolves an id-dependent permission against the parent entity id', async () => {
    const { dataSources, checkAdvancedPermission } = dataSourcesGranting([
      '/entities/PROD-1',
    ]);

    const options = await filterPermittedOptions(
      [{ label: 'delete', can: ['delete:production'] }],
      dataSources,
      customPermissions,
      'PROD-1'
    );

    expect(labelsOf(options)).toEqual(['delete']);
    expect(checkAdvancedPermission).toHaveBeenCalledWith(
      customPermissions['delete:production'],
      'PROD-1',
      undefined
    );
  });

  it('hides an id-dependent option when no parent entity id was sent', async () => {
    // Matches the frontend: without the id the placeholder is never substituted,
    // the soft call fails and the option stays hidden.
    const { dataSources } = dataSourcesGranting(['/entities/PROD-1']);

    const options = await filterPermittedOptions(
      [{ label: 'delete', can: ['delete:production'] }],
      dataSources,
      customPermissions,
      undefined
    );

    expect(labelsOf(options)).toEqual([]);
  });

  it('drops an option whose permission no client configured', async () => {
    const { dataSources } = dataSourcesGranting(['/entities']);

    const options = await filterPermittedOptions(
      [{ label: 'mystery', can: ['read:nothing:configured'] }],
      dataSources,
      customPermissions
    );

    expect(labelsOf(options)).toEqual([]);
  });

  it('preserves the order of the options that survive', async () => {
    const { dataSources } = dataSourcesGranting([
      '/entities',
      '/entities/PROD-1',
    ]);

    const options = await filterPermittedOptions(
      [
        { label: 'delete', can: ['delete:production'] },
        { label: 'openDropdown' },
        { label: 'create', can: ['create:production'] },
      ],
      dataSources,
      customPermissions,
      'PROD-1'
    );

    expect(labelsOf(options)).toEqual(['delete', 'openDropdown', 'create']);
  });
});
