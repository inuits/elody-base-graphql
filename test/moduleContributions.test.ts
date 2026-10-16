import { describe, it, expect, vi } from 'vitest';
import {
  collectModuleFeatures,
  collectModuleInputFields,
  collectModulePermissions,
  collectModuleDataSources,
  findUnmetModuleRequirements,
} from '../helpers/moduleContributions';
import {
  resolveModuleFeatures,
  resolveReadableSimpleSearchTypes,
} from '../endpoints/appConfigEndpoint';

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

const privacyField = { type: 'dropdown', options: [] } as any;

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

describe('collectModuleDataSources', () => {
  it('gathers the data sources every installed module ships', () => {
    class ImportAPI {}
    const importModule = {
      id: 'importModule',
      elodyDataSources: { ImportAPI },
    } as any;

    expect(collectModuleDataSources([plainModule, importModule])).toEqual({
      ImportAPI,
    });
  });
});

describe('findUnmetModuleRequirements', () => {
  const importModuleWithRequirements = {
    id: 'importModule',
    elodyRequirements: {
      environment: {
        'api.fileSystemImporterServiceUrl': 'FILE_SYSTEM_IMPORTER_URL',
      },
    },
  } as any;

  it.each([
    ['missing', { api: {} }],
    ['empty', { api: { fileSystemImporterServiceUrl: '' } }],
  ])('names the env variable of a setting that is %s', (_label, environment) => {
    expect(
      findUnmetModuleRequirements(
        [plainModule, importModuleWithRequirements],
        environment as any
      )
    ).toEqual([
      'importModule requires settings that are not set: FILE_SYSTEM_IMPORTER_URL',
    ]);
  });

  it('is empty when every setting is set', () => {
    expect(
      findUnmetModuleRequirements([importModuleWithRequirements], {
        api: { fileSystemImporterServiceUrl: 'http://importer:5000' },
      } as any)
    ).toEqual([]);
  });

  it('ignores modules without requirements', () => {
    expect(findUnmetModuleRequirements([plainModule], {} as any)).toEqual([]);
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

describe('collectModuleInputFields', () => {
  it('gathers the input fields of every installed module', () => {
    const moduleWithField = {
      id: 'savedSearchModule',
      elodyInputFields: { privacyTypeField: privacyField },
    } as any;

    expect(collectModuleInputFields([plainModule, moduleWithField])).toEqual({
      privacyTypeField: privacyField,
    });
    expect(collectModuleInputFields([plainModule])).toEqual({});
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

describe('resolveReadableSimpleSearchTypes', () => {
  const request = { session: {}, headers: {}, ip: '10.0.0.1' } as any;

  const contextReading = (readable: string[]) => {
    const postEntitiesFilterSoftCall = vi.fn(async (itemType: string) =>
      readable.includes(itemType) ? '200' : '403'
    );
    return {
      context: {
        buildDataSources: vi.fn(() => ({
          CollectionAPI: { postEntitiesFilterSoftCall },
        })) as any,
        permissions: {} as any,
        features: {},
      },
      postEntitiesFilterSoftCall,
    };
  };

  it('keeps only the item types the user may read', async () => {
    const { context } = contextReading(['production']);

    expect(
      await resolveReadableSimpleSearchTypes(
        request,
        ['production', 'mediafile'],
        context
      )
    ).toEqual(['production']);
  });

  it('offers nothing when no item type is readable', async () => {
    const { context } = contextReading([]);

    expect(
      await resolveReadableSimpleSearchTypes(request, ['production'], context)
    ).toEqual([]);
  });

  it('never calls out for a client without simple search', async () => {
    const { context, postEntitiesFilterSoftCall } = contextReading([]);

    expect(
      await resolveReadableSimpleSearchTypes(request, [], context)
    ).toEqual([]);
    expect(postEntitiesFilterSoftCall).not.toHaveBeenCalled();
    expect(context.buildDataSources).not.toHaveBeenCalled();
  });
});
