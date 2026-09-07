import { describe, it, expect, vi } from 'vitest';
import {
  collectModuleFeatures,
  collectModulePermissions,
} from '../helpers/moduleContributions';
import { resolveModuleFeatures } from '../endpoints/appConfigEndpoint';

const savedSearchPermission = {
  datasource: 'CollectionAPI',
  crud: 'post',
  uri: '/entities',
  body: { type: 'saved_search' },
};

const moduleWithContributions = {
  id: 'savedSearchModule',
  elodyPermissions: { 'create:saved_search': savedSearchPermission },
  elodyFeatures: {
    savedSearch: { enabled: true, permission: 'create:saved_search' },
  },
} as any;

const plainModule = { id: 'importModule' } as any;

describe('collectModulePermissions', () => {
  it('gathers the permissions of every installed module', () => {
    expect(
      collectModulePermissions([plainModule, moduleWithContributions])
    ).toEqual({ 'create:saved_search': savedSearchPermission });
  });

  it('is empty when no installed module contributes any', () => {
    expect(collectModulePermissions([plainModule])).toEqual({});
  });
});

describe('collectModuleFeatures', () => {
  it('reports a feature only while its module is installed', () => {
    expect(collectModuleFeatures([moduleWithContributions])).toEqual({
      savedSearch: { enabled: true, permission: 'create:saved_search' },
    });
    expect(collectModuleFeatures([plainModule])).toEqual({});
  });
});

describe('resolveModuleFeatures', () => {
  const request = { session: {}, headers: {}, ip: '10.0.0.1' } as any;

  const contextGranting = (isPermitted: boolean) => {
    const checkAdvancedPermission = vi.fn().mockResolvedValue(isPermitted);
    return {
      buildDataSources: vi.fn(() => ({
        CollectionAPI: { checkAdvancedPermission },
        GraphqlAPI: { checkAdvancedPermission: vi.fn() },
      })) as any,
      permissions: { 'create:saved_search': savedSearchPermission } as any,
      features: {
        savedSearch: { enabled: true, permission: 'create:saved_search' },
      },
      checkAdvancedPermission,
    };
  };

  it('reports a permitted feature as enabled', async () => {
    expect(await resolveModuleFeatures(request, contextGranting(true))).toEqual({
      savedSearch: { enabled: true },
    });
  });

  it('reports a denied feature as disabled', async () => {
    expect(await resolveModuleFeatures(request, contextGranting(false))).toEqual(
      { savedSearch: { enabled: false } }
    );
  });

  it('never builds a datasource for a feature that names no permission', async () => {
    const context = contextGranting(true);
    context.features = { savedSearch: { enabled: true } } as any;

    expect(await resolveModuleFeatures(request, context)).toEqual({
      savedSearch: { enabled: true },
    });
    expect(context.buildDataSources).not.toHaveBeenCalled();
  });

  it('contributes nothing when no module is installed', async () => {
    expect(await resolveModuleFeatures(request, undefined)).toEqual({});
  });
});
