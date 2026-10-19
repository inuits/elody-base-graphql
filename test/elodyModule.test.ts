import { describe, it, expect } from 'vitest';
import {
  assembleElodyModules,
  defineElodyModule,
  initializeElodyModules,
  requireSettings,
} from '../helpers/elodyModule';

class ImportAPI {}
class OtherAPI {}

describe('defineElodyModule', () => {
  it('gives every contribution an empty default', () => {
    const module = defineElodyModule({ name: 'emptyModule' });

    expect(module.dataSources).toEqual([]);
    expect(module.endpoints).toEqual([]);
    expect(module.translations).toEqual({});
    expect(module.permissions).toEqual({});
    expect(module.features).toEqual({});
    expect(module.inputFields).toEqual({});
    expect(module.formatters).toEqual({});
    expect(module.typeCollectionMapping).toEqual({});
    expect(module.typeUrlMapping).toEqual({ mapping: {}, reverseMapping: {} });
    expect(module.typePillLabelMapping).toEqual({});
    expect(module.filterMatchers).toEqual({});
    expect(() => module.initialize({} as any)).not.toThrow();
  });
});

describe('assembleElodyModules', () => {
  it('keeps the graphql modules in registration order', () => {
    const first = { id: 'first' } as any;
    const second = { id: 'second' } as any;

    expect(
      assembleElodyModules([
        defineElodyModule({ name: 'a', graphqlModule: first }),
        defineElodyModule({ name: 'b' }),
        defineElodyModule({ name: 'c', graphqlModule: second }),
      ]).graphqlModules
    ).toEqual([first, second]);
  });

  it('registers each data source under its name', () => {
    expect(
      assembleElodyModules([
        defineElodyModule({
          name: 'importModule',
          dataSources: [{ name: 'ImportAPI', source: ImportAPI as any }],
        }),
      ]).dataSources
    ).toEqual([{ name: 'ImportAPI', source: ImportAPI }]);
  });

  it('refuses two modules registering the same data source name', () => {
    expect(() =>
      assembleElodyModules([
        defineElodyModule({
          name: 'importModule',
          dataSources: [{ name: 'ImportAPI', source: ImportAPI as any }],
        }),
        defineElodyModule({
          name: 'clientModule',
          dataSources: [{ name: 'ImportAPI', source: OtherAPI as any }],
        }),
      ])
    ).toThrow(
      'Data source ImportAPI is registered by both importModule and clientModule'
    );
  });

  it('mounts endpoints in registration order', () => {
    const first = () => {};
    const second = () => {};

    expect(
      assembleElodyModules([
        defineElodyModule({ name: 'a', endpoints: [first] }),
        defineElodyModule({ name: 'b', endpoints: [second] }),
      ]).endpoints
    ).toEqual([first, second]);
  });

  it('lets a later module win on a key clash for keyed contributions', () => {
    const assembled = assembleElodyModules([
      defineElodyModule({
        name: 'shared',
        permissions: { read: 'shared' as any, keep: 'shared' as any },
        features: { flag: { enabled: false } },
        inputFields: { field: 'shared' as any },
        typeCollectionMapping: { asset: 'entities' as any },
        typePillLabelMapping: { asset: ['shared'] },
        filterMatchers: { text: ['shared'] },
      }),
      defineElodyModule({
        name: 'client',
        permissions: { read: 'client' as any },
        features: { flag: { enabled: true } },
        inputFields: { field: 'client' as any },
        typeCollectionMapping: { asset: 'mediafiles' as any },
        typePillLabelMapping: { asset: ['client'] },
        filterMatchers: { text: ['client'] },
      }),
    ]);

    expect(assembled.permissions).toEqual({ read: 'client', keep: 'shared' });
    expect(assembled.features).toEqual({ flag: { enabled: true } });
    expect(assembled.inputFields).toEqual({ field: 'client' });
    expect(assembled.typeCollectionMapping).toEqual({ asset: 'mediafiles' });
    expect(assembled.typePillLabelMapping).toEqual({ asset: ['client'] });
    expect(assembled.filterMatchers).toEqual({ text: ['client'] });
  });

  it('deep-merges translations and formatters', () => {
    const assembled = assembleElodyModules([
      defineElodyModule({
        name: 'shared',
        translations: { en: { a: { b: 'shared', c: 'shared' } } },
        formatters: { link: { asset: { value: 'shared' } } } as any,
      }),
      defineElodyModule({
        name: 'client',
        translations: { en: { a: { b: 'client' } }, nl: { a: 'client' } },
        formatters: { link: { work: { value: 'client' } } } as any,
      }),
    ]);

    expect(assembled.translations).toEqual({
      en: { a: { b: 'client', c: 'shared' } },
      nl: { a: 'client' },
    });
    expect(assembled.formatters).toEqual({
      link: { asset: { value: 'shared' }, work: { value: 'client' } },
    });
  });

  it('merges both sides of the type url mapping', () => {
    expect(
      assembleElodyModules([
        defineElodyModule({
          name: 'shared',
          typeUrlMapping: {
            mapping: { asset: 'assets' },
            reverseMapping: { assets: 'asset' },
          },
        }),
        defineElodyModule({
          name: 'client',
          typeUrlMapping: {
            mapping: { work: 'works' },
            reverseMapping: { works: 'work' },
          },
        }),
      ]).typeUrlMapping
    ).toEqual({
      mapping: { asset: 'assets', work: 'works' },
      reverseMapping: { assets: 'asset', works: 'work' },
    });
  });

  it('does not change the modules it assembles', () => {
    const shared = defineElodyModule({
      name: 'shared',
      permissions: { read: 'shared' as any },
    });
    assembleElodyModules([
      shared,
      defineElodyModule({ name: 'client', permissions: { read: 'client' as any } }),
    ]);

    expect(shared.permissions).toEqual({ read: 'shared' });
  });
});

describe('initializeElodyModules', () => {
  it('reports every module that fails to initialize at once', () => {
    expect(() =>
      initializeElodyModules(
        [
          defineElodyModule({
            name: 'importModule',
            initialize: () => {
              throw new Error('missing importer url');
            },
          }),
          defineElodyModule({ name: 'fineModule' }),
          defineElodyModule({
            name: 'mediafileModule',
            initialize: () => {
              throw new Error('missing storage url');
            },
          }),
        ],
        {} as any
      )
    ).toThrow(
      'Elody modules failed to initialize:\n- importModule: missing importer url\n- mediafileModule: missing storage url'
    );
  });

  it('passes the environment to each module', () => {
    let received: any;
    initializeElodyModules(
      [
        defineElodyModule({
          name: 'importModule',
          initialize: (environment) => {
            received = environment;
          },
        }),
      ],
      { port: 1 } as any
    );

    expect(received).toEqual({ port: 1 });
  });
});

describe('requireSettings', () => {
  const settings = {
    'api.fileSystemImporterServiceUrl': 'FILE_SYSTEM_IMPORTER_URL',
  };

  it.each([
    ['missing', { api: {} }],
    ['empty', { api: { fileSystemImporterServiceUrl: '' } }],
  ])('names the env variable of a setting that is %s', (_label, environment) => {
    expect(() => requireSettings(environment as any, settings)).toThrow(
      'settings are not set: FILE_SYSTEM_IMPORTER_URL'
    );
  });

  it('passes when every setting is set', () => {
    expect(() =>
      requireSettings(
        { api: { fileSystemImporterServiceUrl: 'http://importer' } } as any,
        settings
      )
    ).not.toThrow();
  });
});
